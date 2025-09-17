import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaUser, FaBox, FaMapMarkerAlt, FaKey, FaSignOutAlt } from 'react-icons/fa';
import { logout } from '../store/userSlice'; 
import './ProfilePage.css';

const UserInfoCard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.user);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="user-info-card-sidebar">
            <div className="avatar-placeholder">{userInfo?.name?.charAt(0)}</div>
            <h3>{userInfo?.name || 'Khách'}</h3>
            <p>{userInfo?.email}</p>
            <button onClick={handleLogout} className="logout-btn-sidebar">
                <FaSignOutAlt /> Đăng xuất
            </button>
        </div>
    );
};


const ProfilePage = () => {
    return (
        <div className="container" style={{ marginTop: '30px', marginBottom: '30px' }}>
            <div className="profile-page-layout">
                <aside className="profile-sidebar">
                    <UserInfoCard />
                    
                    <nav className="profile-nav">
                        <NavLink to="/profile" end>
                            <FaUser /> Thông tin tài khoản
                        </NavLink>
                        <NavLink to="/my-orders">
                            <FaBox /> Đơn hàng của tôi
                        </NavLink>
                        <NavLink to="/addresses">
                            <FaMapMarkerAlt /> Địa chỉ
                        </NavLink>
                        <NavLink to="/change-password">
                            <FaKey /> Đổi mật khẩu
                        </NavLink>
                    </nav>
                </aside>
                <main className="profile-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ProfilePage;