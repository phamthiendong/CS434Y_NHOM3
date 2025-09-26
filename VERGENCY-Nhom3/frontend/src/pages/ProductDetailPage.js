import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { fetchProductById, fetchRelatedProducts, clearSelectedProduct } from '../store/productSlice';
import Rating from '../components/Rating.js';
import EnhancedModal from '../components/EnhancedModal.js';
import Spinner from '../components/Spinner';
import { FaShoppingCart, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { FiTruck, FiRefreshCw, FiCreditCard, FiPhoneCall } from 'react-icons/fi';
import RelatedProducts from '../components/RelatedProducts';


const THUMBNAILS_TO_SHOW = 4; 

const useViewHistory = (currentProduct) => {
    const [viewedProducts, setViewedProducts] = useState([]);
    const productRef = useRef(currentProduct);
    productRef.current = currentProduct;

    useEffect(() => {
        if (!currentProduct || !currentProduct._id) return;
        const history = JSON.parse(localStorage.getItem('viewHistory') || '[]');
        setViewedProducts(history.filter(p => p._id !== currentProduct._id));
    }, [currentProduct?._id]); 

    useEffect(() => {
        return () => {
            const productToSave = productRef.current;
            if (productToSave && productToSave._id) {
                const history = JSON.parse(localStorage.getItem('viewHistory') || '[]');
                const updatedHistory = history.filter(p => p._id !== productToSave._id);
                updatedHistory.unshift(productToSave);
                const limitedHistory = updatedHistory.slice(0, 10);
                localStorage.setItem('viewHistory', JSON.stringify(limitedHistory));
            }
        };
    }, [currentProduct?._id]); 

    return viewedProducts;
};


const PolicySidebar = () => {
    return (
        <aside className="policy-sidebar">
            <h4>TIỆN ÍCH</h4>
            <div className="policy-item"><div className="policy-icon-wrapper-v2"><FiTruck /></div><div className="policy-content"><h5>GIAO HÀNG TOÀN QUỐC</h5><p>Thời gian giao hàng linh động từ 2 - 4 - 5 ngày tùy khu vực, có thể nhanh hoặc chậm hơn. Mong Quý Khách hàng thông cảm và cân nhắc khi đặt hàng giúp shop.</p></div></div>
            <div className="policy-item"><div className="policy-icon-wrapper-v2"><FiRefreshCw /></div><div className="policy-content"><h5>CHÍNH SÁCH ĐỔI TRẢ HÀNG</h5><p>Sản phẩm được phép đổi hàng trong vòng 36h nếu phát sinh lỗi từ nhà sản xuất. Quý Khách vui lòng giữ lại hóa đơn và cung cấp video, hình ảnh phần bị lỗi rõ nét, chi tiết và đầy đủ.</p></div></div>
            <div className="policy-item"><div className="policy-icon-wrapper-v2"><FiCreditCard /></div><div className="policy-content"><h5>GIAO HÀNG NHẬN TIỀN VÀ KIỂM KÊ ĐƠN HÀNG</h5><p>Được phép kiểm hàng trước khi thanh toán. Đối với những trường hợp Quý Khách hàng đã đặt hàng mà không nhận hàng vui lòng thanh toán phí ship 2 chiều cho đơn vị vận chuyển.</p></div></div>
            <div className="policy-item"><div className="policy-icon-wrapper-v2"><FiPhoneCall /></div><div className="policy-content"><h5>ĐẶT HÀNG TRỰC TUYẾN VÀ KIỂM TRA TÌNH TRẠNG ĐƠN HÀNG</h5><p>Vui lòng liên hệ: 035 999 6789</p></div></div>
        </aside>
    );
};

const ProductDetailPage = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { 
        productDetails: product, 
        status_single: status, 
        error_single: error,
        relatedProducts,
        relatedStatus
    } = useSelector((state) => state.products);

    const [selectedImage, setSelectedImage] = useState('');
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [modalData, setModalData] = useState(null);
    const [startIndex, setStartIndex] = useState(0); 
    const [activeTab, setActiveTab] = useState('description');

    const viewedProducts = useViewHistory(product);

    useEffect(() => {
        if (productId) {
            window.scrollTo(0, 0);
            dispatch(fetchProductById(productId));
            dispatch(fetchRelatedProducts(productId));
        }
        return () => {
            dispatch(clearSelectedProduct());
        };
    }, [dispatch, productId]);

    useEffect(() => {
        if (product) {
            if (product.images && product.images.length > 0) { setSelectedImage(product.images[0]); }
            setSelectedSize(null);
            setQuantity(1);
            setStartIndex(0); 
        }
    }, [product]);

    const addToCartHandler = () => {
        const isSoldOut = product.countInStock === 0;
        if (isSoldOut) { return; } 
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            alert('Vui lòng chọn kích thước sản phẩm!');
            return;
        }
        dispatch(addToCart({ _id: product._id, name: product.name, image: product.images && product.images.length > 0 ? product.images[0] : '', price: product.price, countInStock: product.countInStock, size: selectedSize, qty: quantity }));
        setModalData({ type: 'success', title: 'Thêm Thành Công', message: 'Sản phẩm đã được thêm vào giỏ hàng.', actionText: 'Xem Giỏ Hàng & Thanh Toán' });
    };

    const buyNowHandler = () => {
        const isSoldOut = product.countInStock === 0;
        if (isSoldOut) { return; }
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            alert('Vui lòng chọn kích thước sản phẩm!');
            return;
        }
        dispatch(addToCart({ _id: product._id, name: product.name, image: product.images && product.images.length > 0 ? product.images[0] : '', price: product.price, countInStock: product.countInStock, size: selectedSize, qty: quantity }));
        navigate('/cart');
    };

    const handleNextThumbnails = () => {
        const maxStartIndex = product.images.length - THUMBNAILS_TO_SHOW;
        setStartIndex(prev => Math.min(prev + 1, maxStartIndex));
    };

    const handlePrevThumbnails = () => {
        setStartIndex(prev => Math.max(prev - 1, 0));
    };

    if (status === 'loading' || !product) { return <Spinner />; }
    if (status === 'failed') { return <div className="container error-message">Lỗi: {error}</div>; }
    
    const isSoldOut = product.countInStock === 0;
    const showThumbnailArrows = product.images && product.images.length > THUMBNAILS_TO_SHOW;

    return (
        <div className="container">
            <EnhancedModal modalData={modalData} onClose={() => setModalData(null)} navigate={navigate} product={product} selectedSize={selectedSize} quantity={quantity} />
            
            <div className="breadcrumb">
                <Link to="/">Trang chủ</Link> <span>{'>'}</span>
                <Link to={`/shop`}>Shop</Link> <span>{'>'}</span>
                <span>{product.name}</span>
            </div>
            
            <div className="product-page-layout">
                <div className="product-main-content">
                    <div className="product-primary-info-grid">
                        <div className="product-image-section">
                            <div className="thumbnail-scroller">
                                {showThumbnailArrows && <button className="scroll-arrow" onClick={handlePrevThumbnails} disabled={startIndex === 0}><FaChevronUp /></button>}
                                <div className="thumbnail-list-container">
                                    <div className="thumbnail-list">
                                        {product.images?.slice(startIndex, startIndex + THUMBNAILS_TO_SHOW).map((img, index) => (
                                            <div key={startIndex + index} className={`thumbnail-item ${img === selectedImage ? 'active' : ''}`} onClick={() => setSelectedImage(img)}>
                                                {/* SỬA LẠI ĐÂY: Dùng trực tiếp URL từ API */}
                                                <img src={img} alt={`${product.name} thumbnail ${index + 1}`} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {showThumbnailArrows && <button className="scroll-arrow" onClick={handleNextThumbnails} disabled={startIndex >= product.images.length - THUMBNAILS_TO_SHOW}><FaChevronDown /></button>}
                            </div>
                            <div className="main-image-column"><img src={selectedImage || '/default-image.jpg'} alt={product.name} /></div>
                        </div>
                        <div className="info-action-column">
                            <h1>{product.name}</h1>
                            <p className="sku">SKU: {product.sku || 'N/A'}</p> 
                            {/* === THAY ĐỔI DUY NHẤT Ở ĐÂY === */}
                            <Rating />
                            <div className="price-box">
                                <span className="current-price">{product.price.toLocaleString('vi-VN')}₫</span>
                                {product.priceBeforeDiscount > product.price && <span className="original-price">{product.priceBeforeDiscount.toLocaleString('vi-VN')}₫</span>}
                            </div>
                            {product.sizes?.length > 0 && (
                                <div className="size-selector">
                                    <p>Kích thước</p>
                                    <div className="sizes">{product.sizes.map(size => <button key={size} className={`size-btn ${selectedSize === size ? 'active' : ''} ${isSoldOut ? 'disabled' : ''}`} onClick={() => setSelectedSize(size)} disabled={isSoldOut}>{size}</button>)}</div>
                                </div>
                            )}
                            <div className="quantity-selector">
                                <p>Số lượng</p>
                                <div className="qty-input">
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={isSoldOut || quantity <= 1}>-</button>
                                    <input type="number" value={quantity} readOnly />
                                    <button onClick={() => setQuantity(q => Math.min(product.countInStock || 1, q + 1))} disabled={isSoldOut || quantity >= product.countInStock}>+</button>
                                </div>
                            </div>
                            <div className="action-buttons">
                                <button className="btn-add-to-cart" onClick={addToCartHandler} disabled={isSoldOut}>{isSoldOut ? 'HẾT HÀNG' : 'Thêm vào giỏ'}</button>
                                <button className="btn-buy-now" onClick={buyNowHandler} disabled={isSoldOut}>{isSoldOut ? 'HẾT HÀNG' : 'Mua ngay'}</button>
                            </div>
                            <div className="tags-section"><p>Tags:****</p></div>
                        </div>
                    </div>
                    <div className="product-bottom-section">
                        <div className="product-description-container">
                            <div className="product-description-section">
                                <div className="product-tabs">
                                    <button className={`tab-button ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>Mô tả sản phẩm</button>
                                    <button className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Bình luận ({product.numReviews})</button>
                                </div>
                                <div className="tab-content">
                                    {activeTab === 'description' && (<div className="description-content" dangerouslySetInnerHTML={{ __html: product.description || 'Sản phẩm chưa có mô tả.' }}></div>)}
                                    {activeTab === 'reviews' && (<div className="reviews-content"><p>****</p></div>)}
                                </div>
                            </div>
                        </div>
                        <div className="related-products-container">
                            {relatedStatus === 'succeeded' && <RelatedProducts title="Sản Phẩm Liên Quan" products={relatedProducts} />}
                            {relatedStatus === 'loading' && <Spinner />}
                        </div>
                    </div>
                </div>
                <aside className="product-detail-sidebar">
                    <PolicySidebar />
                </aside>
            </div>
            
            {viewedProducts.length > 0 && <RelatedProducts title="Sản phẩm đã xem:" products={viewedProducts.slice(0, 3)} layout="horizontal" />}
        </div>
    );
};

export default ProductDetailPage;