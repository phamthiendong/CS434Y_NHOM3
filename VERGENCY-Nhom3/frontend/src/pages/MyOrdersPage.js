import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyOrders } from '../store/orderSlice';
import Spinner from '../components/Spinner';
import { FaShoppingBag } from 'react-icons/fa';
import './MyOrdersPage.css';

const OrderStatusBadge = ({ status, type }) => {
    const getStatusConfig = () => {
        if (type === 'payment') {
            return status ? 
                { text: 'Đã thanh toán', className: 'status-success' } : 
                { text: 'Chưa thanh toán', className: 'status-pending' };
        } else { 
            return status ? 
                { text: 'Đã giao hàng', className: 'status-delivered' } : 
                { text: 'Đang xử lý', className: 'status-processing' };
        }
    };

    const config = getStatusConfig();
    return <span className={`status-badge ${config.className}`}>{config.text}</span>;
};

const MyOrdersPage = () => {
    const dispatch = useDispatch();
    const { orders, status, error } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(fetchMyOrders());
    }, [dispatch]);

    const renderContent = () => {
        if (status === 'loading') {
            return (
                <div className="loading-container">
                    <Spinner />
                </div>
            );
        }

        if (status === 'failed') {
            return (
                <div className="error-container">
                    <p>{error}</p>
                    <button onClick={() => dispatch(fetchMyOrders())}>Thử lại</button>
                </div>
            );
        }

        if (orders.length === 0) {
            return (
                <div className="empty-state">
                    <div className="empty-icon"><FaShoppingBag /></div>
                    <h3>Chưa có đơn hàng nào</h3>
                    <p>Hãy khám phá các sản phẩm tuyệt vời của chúng tôi.</p>
                    <Link to="/shop" className="shop-now-btn">Mua sắm ngay</Link>
                </div>
            );
        }

        return (
            <div className="table-responsive">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Mã Đơn Hàng</th>
                            <th>Ngày đặt</th>
                            <th>Sản phẩm</th>
                            <th>Tổng tiền</th>
                            <th>Thanh toán</th>
                            <th>Vận chuyển</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>
                                    <Link to={`/order/${order._id}`} className="order-id-link">
                                        #{order._id.slice(-6).toUpperCase()}
                                    </Link>
                                </td>
                                <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                                <td className="product-info-cell">
                                    
                                    <img 
                                        src={order.orderItems[0].image} 
                                        alt={order.orderItems[0].name} 
                                        className="product-image-table" 
                                    />
                                    
                                    <div>
                                        <div className="product-name-table">{order.orderItems[0].name}</div>
                                        {order.orderItems.length > 1 && (
                                            <div className="product-more-items">
                                                + {order.orderItems.length - 1} sản phẩm khác
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="order-total-price">
                                    {order.totalPrice.toLocaleString('vi-VN')}₫
                                </td>
                                <td><OrderStatusBadge status={order.isPaid} type="payment" /></td>
                                <td><OrderStatusBadge status={order.isDelivered} type="delivery" /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="my-orders-page-container">
            <div className="my-orders-header">
                <h2><FaShoppingBag /> Đơn hàng của bạn</h2>
                <span className="order-count-badge">{orders.length > 0 ? `${orders.length} đơn hàng` : 'Chưa có đơn hàng'}</span>
            </div>
            {renderContent()}
        </div>
    );
};

export default MyOrdersPage;