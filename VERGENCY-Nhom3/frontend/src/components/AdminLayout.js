import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/userSlice';
import { getAllUsers } from '../store/userSlice'; 
import api from '../services/api'; 
import './AdminLayout.css';

const menuItems = [
    { path: '/admin/dashboard', icon: 'fas fa-tachometer-alt', name: 'Dashboard' },
    { path: '/admin/products', icon: 'fas fa-shopping-cart', name: 'Sản Phẩm' },
    { path: '/admin/orders', icon: 'fas fa-chart-bar', name: 'Đơn Hàng' },
    { path: '/admin/customers', icon: 'fas fa-users', name: 'Khách Hàng' }, 
    { path: '/admin/reviews', icon: 'fas fa-comments', name: 'Đánh Giá' },
    { path: '/admin/categories', icon: 'fas fa-tags', name: 'Danh Mục' },
    { path: '/admin/discounts', icon: 'fas fa-percentage', name: 'Khuyến Mãi' },
    { path: '/admin/shipping', icon: 'fas fa-truck', name: 'Vận Chuyển' },
    { path: '/admin/settings', icon: 'fas fa-cog', name: 'Cài Đặt' },
];

const AdminLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    
    const { userInfo, users } = useSelector((state) => state.user);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchLayoutStats = async () => {
            try {
                const { data } = await api.get('/api/v1/orders/stats');
                setStats(data);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu thống kê:", error);
            }
        };

        fetchLayoutStats();
        
        dispatch(getAllUsers()); 
    }, [dispatch]);

    const handleLogout = () => {
        if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            dispatch(logout());
            navigate('/login');
        }
    };

    const currentPage = menuItems.find(item => location.pathname.startsWith(item.path));
    const pageTitle = currentPage ? currentPage.name : 'Dashboard';

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <h1>Vergency Admin</h1>
                </div>
                <nav className="admin-nav">
                    <ul>
                        {menuItems.map((item) => (
                            <li key={item.name}>
                                <NavLink to={item.path} end={item.path === '/admin/dashboard'}>
                                    <i className={item.icon}></i>
                                    <span>{item.name}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
            <div className="admin-main-content">
                <header className="admin-page-header">
                    <h2>{pageTitle}</h2>
                    <div className="user-info">
                        <span>
                            <i className="fas fa-user-circle"></i> 
                            {userInfo?.name || 'Admin'}
                        </span>
                        <button onClick={handleLogout} className="logout-button">
                            <i className="fas fa-sign-out-alt"></i>
                            <span>Đăng Xuất</span>
                        </button>
                    </div>
                </header>
                <main>
                  <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-card-icon blue"><i className="fas fa-shopping-cart"></i></div>
                        <div className="stat-card-content">
                            <p className="stat-card-title">Tổng sản phẩm</p>
                            <p className="stat-card-value">{stats ? stats.overview.totalProducts : '...'}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-icon green"><i className="fas fa-chart-bar"></i></div>
                        <div className="stat-card-content">
                            <p className="stat-card-title">Tổng Đơn hàng</p>
                            <p className="stat-card-value">{stats ? stats.overview.totalOrders : '...'}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-icon purple"><i className="fas fa-users"></i></div>
                        <div className="stat-card-content">
                            <p className="stat-card-title">Khách hàng</p>
                            <p className="stat-card-value">{users ? users.length : 0}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-icon orange"><i className="fas fa-dollar-sign"></i></div>
                        <div className="stat-card-content">
                            <p className="stat-card-title">Tổng Doanh thu</p>
                            <p className="stat-card-value">{stats ? stats.overview.totalRevenue.toLocaleString('vi-VN') + 'đ' : '...'}</p>
                        </div>
                    </div>
                </div>
                    
                    <div className="content-card">
                       <Outlet context={stats ? stats.monthlyReport : null} />
                    </div>
                </main>
            </div>
        </div>
    );
};
export default AdminLayout;