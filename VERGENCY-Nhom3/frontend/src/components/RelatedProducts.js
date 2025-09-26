import React from 'react';
import { Link } from 'react-router-dom';


const RelatedProducts = ({ title, products, layout }) => {
  if (!products || products.length === 0) {
    return null;
  }

  const containerClassName = `related-products-section ${layout ? `layout-${layout}` : ''}`;

  return (
    <div className={containerClassName}>
      <h4>{title}</h4>
      <div className="related-products-list">
        {products.map((product) => (
          <Link to={`/product/${product._id}`} key={product._id} className="related-product-item">
            
            <img 
              src={product.images && product.images.length > 0 ? product.images[0] : '/default-image.jpg'} 
              alt={product.name} 
            />

            <div className="related-product-info">
              <p className="name">{product.name}</p>
              <p className="price">{product.price.toLocaleString('vi-VN')}₫</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;