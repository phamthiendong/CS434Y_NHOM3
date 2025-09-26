import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { FiMail } from 'react-icons/fi';
import { createOrder, resetOrder } from '../store/orderSlice.js';
import { clearCart } from '../store/cartSlice.js';
import { logout } from '../store/userSlice.js';
import Spinner from '../components/Spinner';

const HOST = "https://provinces.open-api.vn/api/";

const OrderSummary = ({ shippingPrice }) => {
    const { cartItems } = useSelector((state) => state.cart);
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const totalPrice = itemsPrice + (typeof shippingPrice === 'number' ? shippingPrice : 0);

    return (
        <aside className="order-summary-v2">
            <div className="order-summary-items">
                {cartItems.map(item => (
                    <div key={`${item._id}-${item.size}`} className="summary-item-v2">
                        <div className="summary-item-image">
                            <img src={item.image} alt={item.name} />
                            <span className="summary-item-qty">{item.qty}</span>
                        </div>
                        <div className="summary-item-info"><h4>{item.name}</h4><p>{item.size || 'N/A'}</p></div>
                        <span className="summary-item-price">{(item.price * item.qty).toLocaleString('vi-VN')}₫</span>
                    </div>
                ))}
            </div>
            <div className="discount-code">
                <input type="text" placeholder="Mã giảm giá" />
                <button disabled>Sử dụng</button>
            </div>
            <div className="order-summary-calculation">
                <div className="calc-row"><span>Tạm tính</span><span>{itemsPrice.toLocaleString('vi-VN')}₫</span></div>
                <div className="calc-row"><span>Phí vận chuyển</span><span>{typeof shippingPrice === 'number' ? shippingPrice.toLocaleString('vi-VN') + '₫' : '—'}</span></div>
            </div>
            <div className="order-summary-total">
                <div className="calc-row total">
                    <span>Tổng cộng</span>
                    <span className="total-price">VND {totalPrice.toLocaleString('vi-VN')}₫</span>
                </div>
            </div>
        </aside>
    );
};

const CheckoutPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { cartItems } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.user);
    const { order, status, error } = useSelector((state) => state.orders); 

    const [shippingInfo, setShippingInfo] = useState({
        email: userInfo?.email || '',
        fullName: userInfo?.name || '',
        phone: '',
        address: '',
    });
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [shippingPrice, setShippingPrice] = useState('—');
    
    const isFormComplete = shippingInfo.fullName && shippingInfo.email && shippingInfo.phone && shippingInfo.address && selectedProvince && selectedDistrict && selectedWard;
    const isPhoneValid = shippingInfo.phone.startsWith('0') && shippingInfo.phone.length === 10;

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const { data } = await axios.get(`${HOST}?depth=1`);
                setProvinces(data);
            } catch (err) { console.error("Failed to fetch provinces", err); }
        };
        fetchProvinces();
        if (cartItems.length === 0 && status !== 'succeeded') { navigate('/cart'); }
    }, [cartItems.length, navigate, status]);
    
    useEffect(() => {
        if (selectedProvince) {
            const fetchDistricts = async () => {
                const { data } = await axios.get(`${HOST}p/${selectedProvince}?depth=2`);
                setDistricts(data.districts);
                setWards([]);
                setSelectedDistrict('');
                setSelectedWard('');
                setShippingPrice(35000);
            };
            fetchDistricts();
        } else {
            setShippingPrice('—');
        }
    }, [selectedProvince]);
    
    useEffect(() => {
        if (selectedDistrict) {
            const fetchWards = async () => {
                const { data } = await axios.get(`${HOST}d/${selectedDistrict}?depth=2`);
                setWards(data.wards);
                setSelectedWard('');
            };
            fetchWards();
        }
    }, [selectedDistrict]);

    useEffect(() => {
        if (status === 'succeeded' && order) {
            toast.success(`Tạo đơn hàng ${order._id} thành công!`);
            dispatch(clearCart());
            dispatch(resetOrder());
            navigate('/'); 
        }
        if (status === 'failed') {
            toast.error(`Lỗi tạo đơn hàng: ${error}`);
        }
    }, [status, order, navigate, dispatch, error]);

    const handleInputChange = (e) => setShippingInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const placeOrderHandler = (e) => {
        e.preventDefault();
        if (!isFormComplete) {
            toast.error('Vui lòng điền và chọn đầy đủ thông tin giao hàng.');
            return;
        }
        if (!isPhoneValid) {
            toast.error('Số điện thoại không hợp lệ. Vui lòng kiểm tra lại.');
            return;
        }
        const provinceName = provinces.find(p => p.code == selectedProvince)?.name || '';
        const districtName = districts.find(d => d.code == selectedDistrict)?.name || '';
        const wardName = wards.find(w => w.code == selectedWard)?.name || '';
        const fullAddress = `${shippingInfo.address}, ${wardName}, ${districtName}, ${provinceName}`;

        dispatch(createOrder({
            orderItems: cartItems.map(item => ({...item, product: item._id})),
            shippingAddress: { ...shippingInfo, address: fullAddress, city: provinceName, district: districtName, ward: wardName },
            paymentMethod: 'COD',
            itemsPrice: cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
            shippingPrice: typeof shippingPrice === 'number' ? shippingPrice : 0,
            totalPrice: cartItems.reduce((acc, item) => acc + item.price * item.qty, 0) + (typeof shippingPrice === 'number' ? shippingPrice : 0),
        }));
    };
    
    return (
        <>
            {/* Logo Vergency ở trên cùng, click về /shop */}
            <div className="checkout-logo">
                <Link to="/shop" className="checkout-logo-link">
                    <span>Vergency</span>
                </Link>
            </div>
            <div className="checkout-layout-container">
                <main className="checkout-main">
                    <div className="checkout-header-minimal">
                        <Link to="/home">
                            {/* <img src="/images/logo2.webp" alt="Vergency Logo" /> */}
                        </Link>
                    </div>
                    <div className="checkout-breadcrumb">
                        <Link to="/cart">Giỏ hàng</Link> <span>›</span>
                        <strong>Thông tin giao hàng</strong>
                    </div>
                    <section>
                        <h2>Thông tin giao hàng</h2>
                        {userInfo ? (
                            <div className="user-info-box">
                               <span>{userInfo.name} ({userInfo.email})</span>
                               <button onClick={() => dispatch(logout())} className="logout-link">Đăng xuất</button>
                            </div>
                        ) : (
                            <p className="login-prompt">Bạn đã có tài khoản? <Link to="/account?redirect=/checkout">Đăng nhập</Link></p>
                        )}
                    </section>
                    <form onSubmit={placeOrderHandler}>
                        <input type="text" name="fullName" placeholder="Họ và tên" value={shippingInfo.fullName} onChange={handleInputChange} required />
                        <div className="form-row">
                            <div className="form-col">
                                <input type="email" name="email" placeholder="Email" value={shippingInfo.email} onChange={handleInputChange} required />
                            </div>
                            <div className="form-col">
                                <input type="tel" name="phone" placeholder="Số điện thoại" value={shippingInfo.phone} onChange={handleInputChange} required />
                            </div>
                        </div>
                        {shippingInfo.phone && !isPhoneValid && <div className="phone-note">Số điện thoại phải bắt đầu bằng số 0 và bắt buộc đủ 10 số, không chứa ký tự đặc biệt và khoảng trắng</div>}

                        <input type="text" name="address" placeholder="Địa chỉ" value={shippingInfo.address} onChange={handleInputChange} required />
                        <div className="address-selects">
                            <select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)} required>
                                <option value="">Chọn tỉnh / thành</option>
                                {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                            </select>
                            <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} required>
                                <option value="">Chọn quận / huyện</option>
                                {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                            </select>
                            <select value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)} required>
                                <option value="">Chọn phường / xã</option>
                                {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                            </select>
                        </div>
                        <section className="shipping-section">
                            <h3>Phương thức vận chuyển</h3>
                            <div className={`shipping-option ${selectedProvince ? 'selected' : 'placeholder'}`}>
                                {selectedProvince ? (
                                    <>
                                        <div className="radio-wrapper">
                                            <input type="radio" id="shipping_rate_1" name="shipping_rate" value="standard" defaultChecked />
                                            <label htmlFor="shipping_rate_1"></label>
                                        </div>
                                        <span>Giao hàng tận nơi</span>
                                        <span className="shipping-price">{typeof shippingPrice === 'number' ? shippingPrice.toLocaleString('vi-VN') + '₫' : '—'}</span>
                                    </>
                                ) : (
                                    <div className="shipping-placeholder">
                                        <FiMail size={48} />
                                        <p>Vui lòng chọn tỉnh / thành phố để có danh sách các phương thức vận chuyển.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                        <section className="payment-section">
                            <h3>Phương thức thanh toán</h3>
                            <div className="payment-option selected">
                                <div className="radio-wrapper">
                                    <input type="radio" id="payment_cod" name="payment_method" value="COD" defaultChecked />
                                    <label htmlFor="payment_cod"></label>
                                </div>
                                <div className="payment-option-label">
                                    <img src="https://hstatic.net/0/0/global/design/seller/image/payment/cod.svg?v=6" alt="COD" />
                                    <span>Thanh toán khi giao hàng (COD)</span>
                                </div>
                            </div>
                        </section>
                        <div className="checkout-notes">
                            <ol>
                                <li>Khi click vào nút hoàn tất đơn hàng thì đơn hàng sẽ được hệ thống tự động xác nhận mà không cần phải gọi qua điện thoại, nếu điền thông tin địa chỉ và số điện thoại chính xác thì đơn hàng sẽ được vận chuyển từ 3-4-5 ngày tùy vùng miền.</li>
                                <li>Trường hợp đặt hàng xong nhưng nhưng muốn HỦY ĐƠN, vui lòng soạn tin nhắn theo cú pháp: SĐT ĐÃ ĐẶT ĐƠN (hoặc MÃ ĐƠN hoặc EMAIL ĐƠN HÀNG) + TÊN NGƯỜI NHẬN sau đó gửi qua các kênh online: Page Facebook, Intagram. Nhân viên check tin nhắn sẽ xử lý hủy giúp Quý KH.</li>
                            </ol>
                        </div>
                        <div className="form-footer">
                            <Link to="/cart" className="return-link">‹ Giỏ hàng</Link>
                            <button type="submit" className="btn-place-order-v2" disabled={status === 'loading' || !isFormComplete || !isPhoneValid}>
                                {status === 'loading' ? <Spinner size="small" /> : 'Hoàn tất đơn hàng'}
                            </button>
                        </div>
                    </form>
                </main>
                <OrderSummary shippingPrice={shippingPrice} />
            </div>
        </>
    );
};
export default CheckoutPage;