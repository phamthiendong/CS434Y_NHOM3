import React, { useEffect } from 'react';

const EnhancedModal = ({ modalData, onClose, navigate, product, selectedSize, quantity }) => {
    
    useEffect(() => {
        const handleEscKey = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (modalData) {
            document.addEventListener('keydown', handleEscKey);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
            document.body.style.overflow = 'unset';
        };
    }, [modalData, onClose]);


    if (!modalData) return null;


    const { type, title, message, actionText } = modalData;

    const handleViewCart = () => {
        onClose();
        navigate('/cart');
    };

    const handleContinueShopping = () => {
        onClose();
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const getProductDetails = () => {
        if (type === 'success' && product) {
            return {
                image: product.image,
                name: product.name,
                size: selectedSize,
                quantity: quantity,
                price: product.price
            };
        }
        return null;
    };

    const productDetails = getProductDetails();

    return (
        <div 
            className={`modal-backdrop-v3 ${modalData ? 'show' : ''}`} 
            onClick={handleBackdropClick}
        >
            <div className="modal-content-v3" onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button 
                    className="modal-close-btn" 
                    onClick={onClose}
                    aria-label="Đóng modal"
                >
                </button>
                
                {/* Icon */}
                <div className="modal-icon-wrapper-v3">
                    <div className={`modal-icon-v3 ${type}`}></div>
                </div>
                
                {/* Title and Message */}
                <h3 className="modal-title-v3">{title}</h3>
                <p className="modal-message-v3">{message}</p>

                {/* Product Preview (chỉ hiện khi success) */}
                {/* {type === 'success' && productDetails && (
                    <div className="modal-product-preview">
                        <img 
                            src={productDetails.image} 
                            alt={productDetails.name}
                            className="modal-product-image"
                        />
                        <div className="modal-product-info">
                            <h4 className="modal-product-name">{productDetails.name}</h4>
                            <p className="modal-product-details">
                                {productDetails.size && `Size: ${productDetails.size} • `}
                                Số lượng: {productDetails.quantity} • {productDetails.price.toLocaleString('vi-VN')}₫
                            </p>
                        </div>
                    </div>
                )} */}

                {/* Action Buttons */}
                {type === 'success' && actionText && (
                    <div className="modal-actions-v3">
                        <button 
                            onClick={handleContinueShopping} 
                            className="btn-secondary-v3"
                        >
                            Tiếp tục mua
                        </button>
                        <button 
                            onClick={handleViewCart} 
                            className="btn-primary-v3"
                        >
                            {actionText}
                        </button>
                    </div>
                )}

                {/* Error modal chỉ có nút đóng */}
                {type === 'error' && (
                    <div className="modal-actions-v3">
                        <button 
                            onClick={onClose} 
                            className="btn-primary-v3"
                            style={{ width: '100%' }}
                        >
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnhancedModal;