import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
    return (
        <div className="container">
            <div className="breadcrumb">
                <Link to="/">Trang chủ</Link>
                <span>{'>'}</span>
                <span>ABOUT</span>
            </div>

            <div className="page-content">
                <h1 className="page-title">CÔNG TY TNHH VERGENCY</h1>
                <div className="page-text-content">
                    <p>
                        Ngoài thị trường họ chỉ quan tâm đến doanh thu, lợi nhuận. Còn chúng tôi thì tìm đủ mọi cách, làm bất cứ điều gì để khách hàng luôn cảm thấy hài lòng và hạnh phúc. Chúng tôi chưa dám nghĩ mình là số một, nhưng trong tương lai chúng tôi tự tin khẳng định sẽ mãi nỗ lực nâng cao, phát triển nhằm mục đích vươn lên đỉnh điểm về chất lượng dịch vụ và sản phẩm trong từng ngày, từng giờ, từng phút, từng giây, để đem lại cho khách hàng những item tinh tuý nhất, kèm theo đó là một mức giá phù hợp với túi tiền của tất cả mọi người.
                    </p>
                    <p>
                        Chào mừng đến với Vergency! Hãy để chúng tôi có cơ hội được phục vụ bạn một cách chân thành và tận tâm hết sức có thể.

                    </p>
                </div>
            </div>

            <div className="image-sequence">
                <img src="/images/banner1.webp" alt="Vergency Banner 1" />
                <img src="/images/banner2.webp" alt="Vergency Banner 2" />
                <img src="/images/banner3.webp" alt="Vergency Banner 3" />
            </div>
        </div>
    );
};

export default AboutPage;