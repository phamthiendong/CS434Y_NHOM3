
import React from 'react';
import { FiTruck, FiRefreshCw, FiCreditCard, FiPhoneCall } from 'react-icons/fi';

const policies = [
    { icon: <FiTruck />, title: 'Giao hàng toàn quốc', text: 'Thời gian giao hàng linh động từ 3 - 4 - 5 ngày tùy khu vực, đôi khi sẽ nhanh hơn hoặc chậm hơn. Mong Quý Khách hàng thông cảm và cố gắng đợi hàng giúp shop.' },
    { icon: <FiRefreshCw />, title: 'Chính sách đổi trả hàng', text: 'Sản phẩm được phép đổi hàng trong vòng 36h nếu phát sinh lỗi từ nhà sản xuất (Yêu cầu: hình ảnh phần bị lỗi rõ nét, chi tiết và đầy đủ).' },
    { icon: <FiCreditCard />, title: 'Giao hàng nhận tiền', text: 'Được phép kiểm hàng trước khi thanh toán. Lưu ý: Trường hợp Quý Khách hàng đã nhận hàng về nhà, vui lòng quay video unbox đơn hàng trong tình trạng nguyên vẹn để có căn cứ xác thực đơn hàng gặp phải vấn đề, trường hợp không có video shop không thể hỗ trợ.' },
    { icon: <FiPhoneCall />, title: 'Đặt hàng online và kiểm tra đơn hàng vui lòng liên hệ', text: 'Hotline: 035 999 6789' },
];

const PolicySection = () => {
    return (
        <section className="policy-section">
            <div className="container">
                <div className="policy-grid">
                    {policies.map((policy, index) => (
                        <div key={index} className="policy-item-home">
                            <div className="policy-icon-wrapper">
                                {policy.icon}
                            </div>
                            <div className="policy-text">
                                <h4>{policy.title}</h4>
                                <p>{policy.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PolicySection;