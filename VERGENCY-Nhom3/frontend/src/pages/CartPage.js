import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
import { removeFromCart, updateCartQuantity } from '../store/cartSlice';
import { toast } from 'react-hot-toast';
const CartPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cartItems } = useSelector((state) => state.cart);

    const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

    const handleQuantityChange = (item, newQty) => {
        if (newQty >= 1 && newQty <= item.countInStock) {
            dispatch(updateCartQuantity({ _id: item._id, size: item.size, qty: newQty }));
        }
    };
    
    const handleRemoveFromCart = (item) => {
        dispatch(removeFromCart({ _id: item._id, size: item.size }));
    };

    const checkoutHandler = () => {
        if (cartItems.length === 0) {
            toast.error('Giỏ hàng của bạn đang trống!');
            return;
        }
        navigate('/checkout');
    };

    return (
        <div className="container">
            <div className="breadcrumb">
                <Link to="/">Trang chủ</Link>
                <span>{'>'}</span>
                <span>Giỏ hàng</span>
            </div>
            <h1 className="page-title" style={{textAlign: 'left', display: 'block'}}>Giỏ hàng</h1>

            {cartItems.length === 0 ? (
                <div className="cart-empty">
                    <p>Giỏ hàng của bạn đang trống!</p>
                    <div className="cart-summary-empty">
                        <h3>Đơn hàng</h3>
                        <button onClick={() => navigate('/shop')} className="btn-checkout">Tiếp tục mua hàng</button>
                    </div>
                </div>
            ) : (
                <div className="cart-page-wrapper">
                    <div className="cart-header-v2">
                        <span className="header-product">Sản phẩm</span>
                        <span className="header-price">Giá</span>
                        <span className="header-qty">Số lượng</span>
                        <span className="header-subtotal">Tổng</span>
                    </div>

                    <div className="cart-items-list">
                        {cartItems.map(item => (
                            <div key={`${item._id}-${item.size}`} className="cart-item-v2">
                                <div className="cart-item-product">
                                    <Link to={`/product/${item._id}`}>
                                        <img src={item.image} alt={item.name} />
                                    </Link>
                                    <div className="cart-item-info">
                                        <Link to={`/product/${item._id}`}>{item.name}</Link>
                                        <p>Size: {item.size || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="cart-item-price">
                                    {item.price.toLocaleString('vi-VN')}₫
                                </div>
                                <div className="cart-item-qty">
                                    <div className="qty-input">
                                        <button onClick={() => handleQuantityChange(item, item.qty - 1)}>-</button>
                                        <input type="number" value={item.qty} readOnly />
                                        <button onClick={() => handleQuantityChange(item, item.qty + 1)}>+</button>
                                    </div>
                                </div>
                                <div className="cart-item-subtotal">
                                    {(item.price * item.qty).toLocaleString('vi-VN')}₫
                                </div>
                                <button
                                    className="cart-item-delete"
                                    onClick={() => handleRemoveFromCart(item)}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="cart-footer">
                        <div className="cart-actions">
                            <Link to="/shop" className="btn-continue">Tiếp tục mua sản phẩm khác</Link>
                        </div>
                        <div className="cart-note">
                            <h4>Ghi chú đơn hàng</h4>
                            <textarea placeholder="Ghi chú..."></textarea>
                        </div>
                        <div className="cart-summary">
                            <div className="summary-row">
                                <span>Tổng tiền:</span>
                                <span className="summary-total">{subtotal.toLocaleString('vi-VN')}₫</span>
                            </div>
                            <button className="btn-checkout" onClick={checkoutHandler}>Thanh toán</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;