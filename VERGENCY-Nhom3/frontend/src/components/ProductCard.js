import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';


const Rating = () => {
  return (
    <div className="rating">
      <span><i className="fas fa-star"></i></span>
      <span><i className="fas fa-star"></i></span>
      <span><i className="fas fa-star"></i></span>
      <span><i className="fas fa-star"></i></span>
      <span><i className="fas fa-star"></i></span>
    </div>
  );
};

const ProductCard = ({ product }) => {
  const price = product.price || 0;
  const priceBeforeDiscount = product.priceBeforeDiscount || 0;
  const countInStock = product.countInStock;
  const brand = product.brand || 'VERGENCY';

  const discountPercentage = priceBeforeDiscount > price
    ? Math.round(((priceBeforeDiscount - price) / priceBeforeDiscount) * 100)
    : 0;

  const imageUrl = product.images && product.images.length > 0
    ? product.images[0]
    : 'https://via.placeholder.com/300';

  return (
    <div className={`product-card ${countInStock === 0 ? 'sold-out' : ''}`}>
      <div className="product-card__image-container">
        <Link to={`/product/${product._id}`}>
          <img
            className="product-card__image"
            src={imageUrl}
            alt={product.name}
          />
        </Link>
        
        {discountPercentage > 0 && countInStock > 0 && (
          <div className="sale-tag">-{discountPercentage}%</div>
        )}

        {countInStock === 0 && (
          <div className="sold-out-overlay">
            <span className="sold-out-text">HẾT HÀNG</span>
          </div>
        )}
      </div>

      {/* ===== PHẦN THÔNG TIN SẢN PHẨM ===== */}
      <div className="product-card__body">
        {/* === THAY ĐỔI: Đã đảo ngược vị trí của Brand và Name === */}

        {/* 1. Tên thương hiệu */}
        <p className="product-brand">{brand}</p>
        
        {/* 2. Tên sản phẩm */}
        <h3 className="product-name">
          <Link to={`/product/${product._id}`}>{product.name}</Link>
        </h3>
        
        {/* 3. Đánh giá sao */}
        <div className="product-meta">
          <Rating />
        </div>
        
        {/* 4. Giá sản phẩm */}
        <div className="price-container">
          <span className="price">{price.toLocaleString('vi-VN')}₫</span>
          {discountPercentage > 0 && (
            <span className="original-price">
              {priceBeforeDiscount.toLocaleString('vi-VN')}₫
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;