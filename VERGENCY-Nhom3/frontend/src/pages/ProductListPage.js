import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchProducts } from '../store/productSlice.js';
import { fetchCategories } from '../store/categorySlice.js'; 
import ProductCard from '../components/ProductCard.js';
import { FaPlus, FaMinus } from 'react-icons/fa'; 

const ProductCardSkeleton = () => {
    return (
      <div className="skeleton-card">
        <div className="skeleton-image"></div>
        <div className="skeleton-text skeleton-title"></div>
        <div className="skeleton-text skeleton-price"></div>
      </div>
    );
};

const Sidebar = () => {
    const dispatch = useDispatch();
    const { category: currentCategorySlug } = useParams();
    
    const { categories = [], status: categoryStatus } = useSelector((state) => state.categories);

    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        if (categoryStatus === 'idle') {
            dispatch(fetchCategories());
        }
    }, [dispatch, categoryStatus]);

    return (
        <aside className="sidebar">
            <div className="sidebar-header" onClick={() => setIsOpen(!isOpen)}>
                <h2>Danh mục nhóm</h2>
                <span className="toggle-icon">{isOpen ? <FaMinus /> : <FaPlus />}</span>
            </div>
            
            {isOpen && (
                <ul className="sidebar-list">
                    <li>
                        <Link to="/shop" className={!currentCategorySlug ? 'active' : ''}>
                            Tất cả sản phẩm
                        </Link>
                    </li>
                    {categoryStatus === 'succeeded' && categories.map(cat => (
                        <li key={cat._id}>
                            <Link
                                to={`/shop/${cat.name}`} 
                                className={currentCategorySlug === cat.name ? 'active' : ''}
                            >
                                {cat.name}
                            </Link>
                        </li>
                    ))}
                    {categoryStatus === 'loading' && <li>Đang tải...</li>}
                </ul>
            )}
        </aside>
    );
};

const ProductListPage = () => {
    const dispatch = useDispatch();
    const { category } = useParams();
    
    const { products = [], status, error } = useSelector((state) => state.products);

    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        const params = { sortBy };
        if (category) {
            params.category = category;
        }
        dispatch(fetchProducts(params));
    }, [dispatch, category, sortBy]); 
    
    if (status === 'failed') { return <div className="error-message">Lỗi: {error}</div>; }
    
    return (
        <div className="container">
            <div className="breadcrumb">
                <Link to="/">Trang chủ</Link> <span>{'>'}</span>
                {category ? (<><Link to="/shop">Danh mục</Link><span>{'>'}</span><span>{category}</span></>) : (<span>Tất cả sản phẩm</span>)}
            </div>

            <div className="main-content">
                <Sidebar /> 
                
                <div className="product-grid-container">
                    <div className="listing-header">
                        <h2 className="section-title-main">{category ? category.toUpperCase() : 'Tất cả sản phẩm'}</h2>
                        <div className="sort-options">
                            <span>Sắp xếp theo:</span>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="newest">Mới nhất</option>
                            <option value="oldest">Cũ nhất</option>
                            <option value="price-asc">Giá: Tăng dần</option>
                            <option value="price-desc">Giá: Giảm dần</option>
                        </select>
                        </div>
                    </div>
                    
                    <div className="product-list">
                        {status === 'loading' && (
                            Array.from({ length: 8 }).map((_, index) => (
                                <ProductCardSkeleton key={index} />
                            ))
                        )}

                        {status === 'succeeded' && products.length > 0 && (
                            products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))
                        )}
                    </div>

                    {status === 'succeeded' && products.length === 0 && (
                        <div className="empty">
						    <p>Hiện tại sản phẩm đang cập nhật. Bạn quay lại sau nhé !</p>
					    </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductListPage;