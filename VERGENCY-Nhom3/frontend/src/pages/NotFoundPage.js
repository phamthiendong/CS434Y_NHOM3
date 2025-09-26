import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

import notFoundImage from '../assets/images/404.png'; 

const NotFoundPage = () => {
    return (
        <div className="not-found-container">
            <div className="not-found-content">
                
                <img 
                    src={notFoundImage} 
                    alt="Trang không tồn tại - 404 Not Found" 
                    className="custom-404-image" 
                />
                <div className="message-box">
                    <p>Thật đáng tiếc, trang này hiện không tồn tại!!!</p>
                    <p>Bạn vui lòng thử lại hoặc quay về trang chủ.</p>
                    <Link to="/" className="home-button">
                        Quay về Trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;