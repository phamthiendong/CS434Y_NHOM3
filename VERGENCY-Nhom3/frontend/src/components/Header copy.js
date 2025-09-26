// frontend/src/components/Header.js

import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiUser, FiLogOut, FiBox, FiSettings } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/userSlice';

const Header = () => {
    const [isSticky, setIsSticky] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const location = useLocation();
    const isCheckoutPage = location.pathname.startsWith('/checkout');
    
    const userMenuRef = useRef(null);
    const stickyUserMenuRef = useRef(null);
    const hideTimeoutRef = useRef(null);

    const { cartItems } = useSelector(state => state.cart);
    const { userInfo } = useSelector(state => state.user);

    const totalItemsInCart = cartItems.reduce((acc, item) => acc + item.qty, 0);
    const categories = ['T-SHIRTS', 'SHIRTS', 'SWEATERS', 'HOODIES', 'SHORTS', 'PERFUME', 'JACKET', 'ACCESSORIES', 'POLO', 'PANTS'];

    useEffect(() => {
        const handleScroll = () => setIsSticky(!isCheckoutPage && window.scrollY > 100);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isCheckoutPage]); 

    useEffect(() => {
        const handleClickOutside = (event) => {
            if ((userMenuRef.current && !userMenuRef.current.contains(event.target)) && (stickyUserMenuRef.current && !stickyUserMenuRef.current.contains(event.target))) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const logoutHandler = () => {
        dispatch(logout());
        navigate('/account');
        setShowUserMenu(false);
    };

    const handleUserMenuShow = () => {
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        setShowUserMenu(true);
    };

    const handleUserMenuHide = () => {
        hideTimeoutRef.current = setTimeout(() => setShowUserMenu(false), 300);
    };

    const handleUserMenuEnter = () => {
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };

    const toggleUserMenu = (e) => {
        e.preventDefault();
        setShowUserMenu(!showUserMenu);
    };

    const renderHeaderActions = (isStickyVersion = false) => (
        <div className="header-actions">
            <Link to="/search"><FiSearch /></Link>
            {userInfo ? (
                <div className="user-dropdown" ref={isStickyVersion ? stickyUserMenuRef : userMenuRef}>
                    <button className="user-icon-link" onClick={toggleUserMenu} onMouseEnter={handleUserMenuShow} onMouseLeave={handleUserMenuHide}>
                        <FiUser />
                    </button>
                    {showUserMenu && (
                        <ul className="dropdown-menu user-menu-active" onMouseEnter={handleUserMenuEnter} onMouseLeave={handleUserMenuHide}>
                            <li className="dropdown-header">Chào, {userInfo.name}</li>
                            <li className="divider-li"><hr /></li>
                            <li><Link to="/profile" onClick={() => setShowUserMenu(false)}><FiSettings /> Hồ sơ</Link></li>
                            <li><Link to="/my-orders" onClick={() => setShowUserMenu(false)}><FiBox /> Đơn hàng của tôi</Link></li>
                            <li className="divider-li"><hr /></li>
                            <li><button onClick={logoutHandler} className="logout-button"><FiLogOut /> Đăng xuất</button></li>
                        </ul>
                    )}
                </div>
            ) : (
                <Link to="/account"><FiUser /></Link>
            )}
            
            {/* === ICON GIỎ HÀNG ĐÃ ĐƯỢC THAY THẾ === */}
            <Link to="/cart" className="cart" title="Giỏ hàng">
                <svg className="svg-next-icon svg-next-icon-size-24">
                    <use xlinkHref="#icon-cart-header"></use>
                </svg>
                {totalItemsInCart > 0 && (
                    <span id="cart-count">{totalItemsInCart}</span>
                )}
            </Link>
        </div>
    );

    return (
        <header className="site-header">
            <div className="top-bar">
                <div className="top-bar-container">
                    <div className="phone-contact">
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'inherit', textDecoration: 'none' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            <span>035 999 6789</span>
                        </Link>
                    </div>
                    <div className="logo-container">
                        <Link to="/"><img src="/images/logo2.webp" alt="Vergency Logo" className="header-logo" /></Link>
                    </div>
                    {renderHeaderActions(false)}
                </div>
            </div>
            <nav className={`main-nav ${isSticky ? 'is-sticky' : ''}`}>
                <div className="main-nav-container">
                    {isSticky && <div className="logo-container-sticky"></div>}
                    <ul>
                        <li><NavLink to="/home" end>HOME</NavLink></li>
                        <li className="dropdown-li">
                            <NavLink to="/shop">SHOP</NavLink>
                            <ul className="dropdown-menu">
                                {categories.map(cat => (<li key={cat}><Link to={`/shop/${cat}`}>{cat}</Link></li>))}
                            </ul>
                        </li>
                        <li><NavLink to="/blog">BLOG</NavLink></li>
                        <li><NavLink to="/contact">CONTACT</NavLink></li>
                        <li><NavLink to="/about">ABOUT</NavLink></li>
                        <li><a href="https://www.facebook.com/groups/vergency" target="_blank" rel="noopener noreferrer">VERGENCY GROUP</a></li>
                        <li><a href="https://www.instagram.com/vergency.vn/" target="_blank" rel="noopener noreferrer">VERGENCY INSTAGRAM</a></li>
                    </ul>
                    {isSticky && renderHeaderActions(true)}
                </div>
            </nav>
        </header>
    );
};

export default Header;