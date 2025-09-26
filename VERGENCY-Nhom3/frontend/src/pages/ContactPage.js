import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserAlt, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaMobileAlt } from 'react-icons/fa';

const ContactPage = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Cảm ơn bạn đã gửi lời nhắn!');
    };

    return (
        <div className="container">
            <div className="breadcrumb">
                <Link to="/">Trang chủ</Link>
                <span>{'>'}</span>
                <span>Liên hệ</span>
            </div>
            <h1 className="page-title">Liên hệ</h1>

            <div className="google-map-container">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.668581007886!2d106.60085837480509!3d10.760081289387227!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752c15c822c53b%3A0x63428e21715626e2!2zODkxIEh1w4IgTG9uZyBIw7IgY-G6p24gMiBkdSBsaWNoLCBCw6xuaCBUcuG7iyDEkMO0bmcgQSwgQsOsbmggVMOibiwgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1687258814000!5m2!1svi!2s"
                    width="100%" height="450" style={{ border: 0 }} allowFullScreen="" loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade" title="Vergency Location">
                </iframe>
            </div>
            
            <div className="contact-content-layout">
                <form className="contact-form-grid" onSubmit={handleSubmit}>
                    <div className="form-left">
                        <div className="form-group">
                            <label htmlFor="name"><FaUserAlt /></label>
                            <input type="text" id="name" placeholder="Họ và tên" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email"><FaEnvelope /></label>
                            <input type="email" id="email" placeholder="Email đầy đủ" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone"><FaPhoneAlt /></label>
                            <input type="tel" id="phone" placeholder="Số điện thoại" required />
                        </div>
                    </div>
                    <div className="form-right">
                        <textarea placeholder="Viết lời nhắn" required></textarea>
                    </div>
                    <div className="form-full-width">
                        <button type="submit" className="btn-submit">Gửi lời nhắn</button>
                    </div>
                </form>

                <div className="store-info-wrapper">
                    <h3>Chúng tôi sẽ kết nối ngay lập tức khi bạn cần trợ giúp.</h3>
                    <div className="store-info">
                        <h3>Vergency.</h3>
                        <p><FaMobileAlt /> 035 999 6789</p>
                        <p><FaMapMarkerAlt /> 01 Đ. Nguyễn Văn Linh, Phước Ninh, Hải Châu, Đà Nẵng 550000, Việt Nam</p>
                        <p><FaEnvelope /> vergency.contact@gmail.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;