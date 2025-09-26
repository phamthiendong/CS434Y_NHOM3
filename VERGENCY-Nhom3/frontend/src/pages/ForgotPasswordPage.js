import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Nếu email tồn tại, một link phục hồi mật khẩu đã được gửi đến!');
    };

    return (
        <div className="forgot-password-body">
            <div className="forgot-password-container">
                <form onSubmit={handleSubmit} className="forgot-password-form">
                    <h1 className="form-title">Đặt lại mật khẩu</h1>
                    <p className="form-subtitle">Nhập email của bạn và chúng tôi sẽ gửi một liên kết để khôi phục tài khoản.</p>
                    
                    <div className="input-wrapper">
                        <input 
                            type="email" 
                            id="email" 
                            placeholder="Nhập email của bạn" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>

                    <button type="submit" className="btn-submit-forgot" /* disabled={status === 'loading'} */>
                        Gửi liên kết khôi phục
                    </button>
                    
                    <Link to="/auth" className="back-to-login-link">Quay lại Đăng nhập</Link>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;