import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAllOrders, updateOrderAdmin, resetUpdateStatus } from '../../store/orderSlice'; 
import Spinner from '../../components/Spinner'; 
import toast from 'react-hot-toast';
import { FaBoxOpen, FaCalendarAlt, FaTruck, FaDollarSign, FaSearch, FaUser, FaEye } from 'react-icons/fa';

import './OrderListPage.css'; 

const OrderListPage = () => {
    const dispatch = useDispatch();
    const { orders, status, error, updateStatus } = useSelector((state) => state.orders); 
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchAllOrders());
        }
    }, [dispatch, status]);

    useEffect(() => {
        if (updateStatus === 'succeeded') { toast.success('Cập nhật trạng thái thành công!'); dispatch(resetUpdateStatus()); }
        if (updateStatus === 'failed') { toast.error('Cập nhật thất bại!'); dispatch(resetUpdateStatus()); }
    }, [updateStatus, dispatch]);

    const handleStatusChange = (orderId, newStatus) => {
        if (window.confirm('Bạn có chắc muốn thay đổi trạng thái đơn hàng này?')) {
            dispatch(updateOrderAdmin({ orderId, status: newStatus }));
        }
    };

    const filteredOrders = orders.filter(order => {
        const customerName = order.user?.name || order.shippingAddress?.fullName || '';
        const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             order._id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'Chờ xác nhận').length;
    const shippingOrders = orders.filter(o => o.status === 'Đang giao hàng').length;
    const completedOrders = orders.filter(o => o.status === 'Đã giao').length;

    if (status === 'loading') return <Spinner />;
    if (status === 'failed') return <div className="admin-error-message">Lỗi: {error}</div>;

    return (
        <div className="order-management-container">
            <div className="stats-grid">
                <div className="stat-card"><div className="stat-info"><p>Tổng đơn hàng</p><p>{totalOrders}</p></div><div className="stat-icon total"><FaBoxOpen /></div></div>
                <div className="stat-card"><div className="stat-info"><p>Chờ xác nhận</p><p>{pendingOrders}</p></div><div className="stat-icon pending"><FaCalendarAlt /></div></div>
                <div className="stat-card"><div className="stat-info"><p>Đang giao</p><p>{shippingOrders}</p></div><div className="stat-icon shipping"><FaTruck /></div></div>
                <div className="stat-card"><div className="stat-info"><p>Hoàn thành</p><p>{completedOrders}</p></div><div className="stat-icon completed"><FaDollarSign /></div></div>
            </div>

            {/* Bộ lọc */}
            <div className="filter-card">
                <div className="filter-controls">
                    <div className="filter-search">
                        <FaSearch className="search-icon" />
                        <input type="text" placeholder="Tìm theo tên khách hàng hoặc mã đơn..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <div className="filter-select">
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="all">Tất cả trạng thái</option>
                            <option value="Chờ xác nhận">Chờ xác nhận</option>
                            <option value="Đã xác nhận">Đã xác nhận</option>
                            <option value="Đang giao hàng">Đang giao hàng</option>
                            <option value="Đã giao">Đã giao</option>
                            <option value="Đã hủy">Đã hủy</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="order-list-card">
                <div className="table-responsive">
                    <table className="order-table">
                        <thead>
                            <tr>
                                <th>Đơn hàng</th>
                                <th>Khách hàng</th>
                                <th>Ngày đặt</th>
                                <th>Tổng tiền</th>
                                <th>Thanh toán</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr key={order._id}>
                                    <td className="order-id-cell">
                                        <div className="id">#{order._id.slice(-8).toUpperCase()}</div>
                                        <div className="items">{order.orderItems.length} sản phẩm</div>
                                    </td>
                                    <td className="customer-cell">
                                        <div className="customer-avatar"><FaUser /></div>
                                        <div>
                                            <div className="customer-name">{order.user?.name || order.shippingAddress?.fullName || 'N/A'}</div>
                                            <div className="customer-payment">{order.paymentMethod}</div>
                                        </div>
                                    </td>
                                    <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                                    <td>{order.totalPrice.toLocaleString('vi-VN')}đ</td>
                                    <td>
                                        <span className={`payment-status ${order.isPaid ? 'paid' : 'unpaid'}`}>
                                            {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className={`status-select ${order.status?.toLowerCase().replace(/\s/g, '-') || 'pending'}`}
                                            disabled={updateStatus === 'loading'}
                                        >
                                            <option value="Chờ xác nhận">Chờ xác nhận</option>
                                            <option value="Đã xác nhận">Đã xác nhận</option>
                                            <option value="Đang giao hàng">Đang giao hàng</option>
                                            <option value="Đã giao">Đã giao</option>
                                            <option value="Đã hủy">Đã hủy</option>
                                        </select>
                                    </td>
                                    <td>
                                        <Link to={`/admin/order/${order._id}`} className="btn-detail">
                                            <FaEye /> Chi tiết
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderListPage;