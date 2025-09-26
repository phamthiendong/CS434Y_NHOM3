import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderDetails } from '../../store/orderSlice'; 
import Spinner from '../../components/Spinner';
import { FaArrowLeft } from 'react-icons/fa';

import './OrderDetailPage.css'; 

const OrderDetailPage = () => {
    const { id: orderId } = useParams(); 
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { orderDetails, status, error } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(fetchOrderDetails(orderId));
    }, [dispatch, orderId]);

    const goBackHandler = () => {
        navigate('/admin/orders'); 
    };

    if (status === 'loading' || !orderDetails) {
        return <Spinner />;
    }

    if (status === 'failed') {
        return <div className="admin-error-message">Lỗi: {error}</div>;
    }

    return (
        <div className="order-detail-container" style={{ padding: '2rem' }}>
            <div className="page-header-admin">
                <h2>Chi tiết đơn hàng #{orderDetails._id.slice(-8).toUpperCase()}</h2>
                <button onClick={goBackHandler} className="btn-back">
                    <FaArrowLeft style={{ marginRight: '8px' }} />
                    Quay lại
                </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div>
                    <div className="card" style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '8px', marginBottom: '1rem' }}>
                        <h4>Thông tin giao hàng</h4>
                        <p><strong>Tên khách hàng:</strong> {orderDetails.shippingAddress.fullName}</p>
                        <p><strong>Số điện thoại:</strong> {orderDetails.shippingAddress.phone}</p>
                        <p><strong>Địa chỉ:</strong> {`${orderDetails.shippingAddress.address}, ${orderDetails.shippingAddress.ward}, ${orderDetails.shippingAddress.district}, ${orderDetails.shippingAddress.city}`}</p>
                         <p>
                            <strong>Trạng thái giao hàng:</strong> 
                            <span style={{ 
                                color: orderDetails.isDelivered ? 'orange' : 'orange', 
                                fontWeight: 'bold' 
                            }}>
                                {orderDetails.isDelivered ? ` Đã giao vào ${new Date(orderDetails.deliveredAt).toLocaleDateString('vi-VN')}` : ' Chưa giao'}
                            </span>
                        </p>
                    </div>

                    <div className="card" style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
                         <h4>Sản phẩm trong đơn hàng</h4>
                        {orderDetails.orderItems.map((item) => (
                            <div key={item._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                                <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '1rem', borderRadius: '4px' }} />
                                <div style={{ flex: 1 }}>
                                    <div><strong>{item.name}</strong></div>
                                    <div>Size: {item.size}</div>
                                    <div>{item.qty} x {item.price.toLocaleString('vi-VN')}đ</div>
                                </div>
                                <div style={{ fontWeight: 'bold' }}>
                                    {(item.qty * item.price).toLocaleString('vi-VN')}đ
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card" style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '8px', height: 'fit-content' }}>
                    <h4>Tổng </h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Tiền hàng:</span>
                        <span>{orderDetails.itemsPrice.toLocaleString('vi-VN')}đ</span>
                    </div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Phí vận chuyển:</span>
                        <span>{orderDetails.shippingPrice.toLocaleString('vi-VN')}đ</span>
                    </div>
                     <hr />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.5rem' }}>
                        <span>Tổng cộng:</span>
                        <span>{orderDetails.totalPrice.toLocaleString('vi-VN')}đ</span>
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                         <strong>Phương thức thanh toán:</strong> {orderDetails.paymentMethod}
                    </div>
                     <p>
                        <strong>Trạng thái thanh toán:</strong> 
                        <span style={{ 
                            color: orderDetails.isPaid ? 'green' : 'red', 
                            fontWeight: 'bold' 
                        }}>
                            {orderDetails.isPaid ? ` Đã thanh toán vào ${new Date(orderDetails.paidAt).toLocaleDateString('vi-VN')}` : ' Chưa thanh toán'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;