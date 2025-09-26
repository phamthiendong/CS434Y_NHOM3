import React, { useState } from 'react';
import { Eye, EyeOff, Key, ShieldCheck } from 'lucide-react';
import './ChangePasswordPage.css';

const ChangePasswordPage = () => {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [visibility, setVisibility] = useState({
        old: false,
        new: false,
        confirm: false
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.oldPassword) newErrors.oldPassword = "Vui lòng nhập mật khẩu cũ.";
        if (formData.newPassword.length < 8) newErrors.newPassword = "Mật khẩu mới phải có ít nhất 8 ký tự.";
        if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Đang gửi dữ liệu:', formData);
            alert('Đổi mật khẩu thành công!');
            setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        }
    };

    const toggleVisibility = (field) => {
        setVisibility(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const renderInputField = (name, placeholder, type) => (
        <div className={`form-group ${errors[name] ? 'has-error' : ''}`}>
            <div className="input-group">
                <input
                    type={visibility[type] ? 'text' : 'password'}
                    id={name}
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    placeholder=""
                    autoComplete="off"
                />
                <label htmlFor={name}>{placeholder}</label>
                <button
                    type="button"
                    className="password-toggle"
                    onClick={() => toggleVisibility(type)}
                    aria-label={`Toggle ${placeholder} visibility`}
                >
                    {visibility[type] ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
            {errors[name] && <div className="error-message">{errors[name]}</div>}
        </div>
    );

    return (
        <div className="cp-container">
            <div className="cp-card">
                <div className="cp-header">
                    <div className="cp-icon-wrapper">
                        <Key size={30} />
                    </div>
                    <h1>Đổi mật khẩu</h1>
                    <p>Cập nhật mật khẩu của bạn để tăng cường bảo mật.</p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    {renderInputField("oldPassword", "Mật khẩu cũ", "old")}
                    {renderInputField("newPassword", "Mật khẩu mới", "new")}
                    {renderInputField("confirmPassword", "Xác nhận mật khẩu mới", "confirm")}

                    <button type="submit" className="submit-btn">
                        Cập Nhật Mật Khẩu
                    </button>
                </form>
            </div>

            <div className="security-tips-card">
                <div className="security-tips-header">
                    <ShieldCheck size={20} />
                    <h4>Lời khuyên bảo mật</h4>
                </div>
                <ul>
                    <li>Sử dụng mật khẩu mạnh với ít nhất 8 ký tự.</li>
                    <li>Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt.</li>
                    <li>Tránh sử dụng thông tin cá nhân dễ đoán.</li>
                    <li>Thay đổi mật khẩu của bạn định kỳ.</li>
                </ul>
            </div>
        </div>
    );
};

export default ChangePasswordPage;