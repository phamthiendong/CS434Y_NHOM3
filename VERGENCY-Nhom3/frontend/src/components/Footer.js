import React from 'react';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="footer-main">
                <div className="footer-container">
                    {/* Cột 1: Thông tin liên hệ */}
                    <div className="footer-column">
                        <h4>Thông tin liên hệ</h4>
                        <p>Phone: 035 999 6789</p>
                        <p>Email: vergency.contact@gmail.com</p>
                    </div>

                    {/* Cột 2: Chính sách */}
                    <div className="footer-column">
                        <h4>Chính sách hỗ trợ</h4>
                        <ul>
                            <li><a href="#">Tìm kiếm</a></li>
                            <li><a href="#">Giới thiệu</a></li>
                            <li><a href="#">Chính sách đổi trả</a></li>
                            <li><a href="#">Chính sách bảo mật</a></li>
                            <li><a href="#">Điều khoản dịch vụ</a></li>
                        </ul>
                    </div>

                    {/* Cột 3: Liên kết */}
                    <div className="footer-column">
                        <h4>Thông tin liên kết</h4>
                        <p>Hãy kết nối với chúng tôi.</p>
                        <div className="social-icons">
                           
                            <a 
                                href="https://www.facebook.com/Vergency.vn" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                aria-label="Facebook"
                            >
                                <span className="social-icon facebook-icon"></span>
                            </a>
                            <a 
                                href="https://www.instagram.com/vergency.vn/" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                aria-label="Instagram"
                            >
                                <span className="social-icon instagram-icon"></span>
                            </a>
                        </div>
                    </div>

                    {/* Cột 4: Fanpage */}
                    <div className="footer-column">
                        <h4>Theo dõi Fanpage</h4>
                        <a 
                            href="https://www.facebook.com/Vergency.vn" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="facebook-link"
                        >
                            Facebook
                        </a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>©Bản quyền thuộc về VERGENCY.</p>
            </div>
        </footer>
    );
};

export default Footer;