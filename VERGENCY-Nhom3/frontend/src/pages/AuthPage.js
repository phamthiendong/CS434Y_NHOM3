import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, clearUserState } from '../store/userSlice';
import './AuthPage.css';

const FloatingLabelInput = ({ id, label, type, value, onChange, required }) => {
    return (
        <div className="input-group">
            <input 
                id={id} 
                type={type} 
                value={value} 
                onChange={onChange}
                required={required} 
                placeholder=" " 
            />
            <label htmlFor={id}>{label}</label>
        </div>
    );
};

const AuthPage = () => {
    const [formType, setFormType] = useState('login'); 
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
   
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userInfo, status, error } = useSelector((state) => state.user);

    useEffect(() => {
        if (userInfo) {
            navigate(userInfo.isAdmin ? '/admin/dashboard' : '/', { replace: true });
        }
    }, [navigate, userInfo]);
   
    const resetFormAndErrors = () => {
        setName('');
        setEmail('');
        setPassword('');
        if (error) {
            dispatch(clearUserState());
        }
    };
   
    const switchForm = (type) => {
        resetFormAndErrors();
        setFormType(type);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        if (formType === 'register') {
            dispatch(registerUser({ name, email, password }));
        } else {
            dispatch(loginUser({ email, password }));
        }
    };

    return (
        <div className="auth-body-microsoft">
            <div className="auth-container-microsoft">
                <div className="form-header">
                    <span className="brand-name">VERGENCY</span>
                </div>

                {formType === 'login' ? (
                    <form key="login-form" className="auth-form" onSubmit={submitHandler}>
                        <h1 className="auth-title-microsoft">Đăng nhập</h1>
                        
                        <FloatingLabelInput id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <FloatingLabelInput id="password" label="Mật khẩu" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        
                        <div className="auth-links">
                            <Link to="/forgot-password">Quên mật khẩu?</Link>
                        </div>
                        
                        <button type="submit" className="btn-submit-microsoft" disabled={status === 'loading'}>
                            {status === 'loading' ? 'Đang xử lý...' : 'Đăng Nhập'}
                        </button>
                        
                        {error && <div className="auth-error-microsoft">{error}</div>}
                        
                        <p className="switch-form-prompt">
                            Chưa có tài khoản? <span onClick={() => switchForm('register')}>Tạo tài khoản mới!</span>
                        </p>
                    </form>
                ) : (
                    <form key="register-form" className="auth-form" onSubmit={submitHandler}>
                        <h1 className="auth-title-microsoft">Tạo tài khoản</h1>

                        <FloatingLabelInput id="name" label="Tên của bạn" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                        <FloatingLabelInput id="email-reg" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <FloatingLabelInput id="password-reg" label="Mật khẩu" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                        <button type="submit" className="btn-submit-microsoft" disabled={status === 'loading'}>
                            {status === 'loading' ? 'Đang xử lý...' : 'Đăng Ký'}
                        </button>
                        
                        {error && <div className="auth-error-microsoft">{error}</div>}
                        
                        <p className="switch-form-prompt">
                            Bạn đã có tài khoản? <span onClick={() => switchForm('login')}>Đăng nhập</span>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AuthPage;