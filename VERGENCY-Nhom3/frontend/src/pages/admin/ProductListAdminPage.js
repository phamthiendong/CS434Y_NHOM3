import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    resetCreateStatus,
    resetUpdateStatus,
    resetDeleteStatus,
} from '../../store/productSlice';
import categoryApi from '../../services/categoryApi';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';
import { FaUpload, FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa'; 

const ProductForm = ({ selectedProduct, clearSelection }) => {
    const dispatch = useDispatch();
    const { createStatus, updateStatus } = useSelector((state) => state.products);

    const [formData, setFormData] = useState({
        name: '', price: 0, priceBeforeDiscount: 0, sku: '', category: '',
        countInStock: 0, sizes: 'S, M, L, XL', description: '',
    });
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [categories, setCategories] = useState([]);
    
    const isEditMode = selectedProduct && selectedProduct._id;

    const resetForm = React.useCallback(() => {
        setFormData({
            name: '', 
            price: 0, 
            priceBeforeDiscount: 0, 
            sku: '', 
            category: categories[0]?._id || '',
            countInStock: 0, 
            sizes: 'S, M, L, XL', 
            description: '',
        });
        setImages([]);
        setImagePreviews([]);
        const fileInput = document.getElementById('image-upload');
        if (fileInput) {
            fileInput.value = '';
        }
    }, [categories]);

    useEffect(() => {
        if (!isEditMode && selectedProduct === null && categories.length > 0) {
            resetForm();
        }
    }, [selectedProduct, isEditMode, categories, resetForm]);

    useEffect(() => {
        const fetchCategoriesData = async () => {
            try {
                const fetchedCategories = await categoryApi.getAllCategories();
                setCategories(fetchedCategories);
                if (!isEditMode && fetchedCategories.length > 0) {
                    setFormData(prev => ({...prev, category: fetchedCategories[0]._id}));
                }
            } catch (error) { 
                console.error("Không thể tải danh mục:", error); 
            }
        };
        fetchCategoriesData();
    }, [isEditMode]);

    useEffect(() => {
        if (isEditMode) {
            setFormData({
                name: selectedProduct.name || '',
                price: selectedProduct.price || 0,
                priceBeforeDiscount: selectedProduct.priceBeforeDiscount || 0,
                sku: selectedProduct.sku || '',
                category: selectedProduct.category?._id || '',
                countInStock: selectedProduct.countInStock || 0,
                sizes: selectedProduct.sizes?.join(', ') || '',
                description: selectedProduct.description || '',
            });
            setImagePreviews(selectedProduct.images ? selectedProduct.images.map(img => img.startsWith('http') ? img : `http://localhost:5000${img}`) : []);
            setImages([]);
        } else {
            resetForm();
        }
    }, [selectedProduct, isEditMode, categories, resetForm]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setImages(prevImages => prevImages.concat(files));
        
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prevPreviews => prevPreviews.concat(newPreviews));
        
        e.target.value = '';
    };

    const removeImage = (indexToRemove) => {
        const previewToRemove = imagePreviews[indexToRemove];

        if (previewToRemove && previewToRemove.startsWith('blob:')) {
            URL.revokeObjectURL(previewToRemove);
        }

        const newImages = images.filter((_, index) => index !== indexToRemove);
        const newImagePreviews = imagePreviews.filter((_, index) => index !== indexToRemove);

        setImages(newImages);
        setImagePreviews(newImagePreviews);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({...prev, [field]: value}));
    };

    const submitHandler = (e) => {
        e.preventDefault();

        const sanitizedFormData = {
            ...formData,
            price: Number(String(formData.price).replace(/[^0-9]/g, '')) || 0,
            priceBeforeDiscount: Number(String(formData.priceBeforeDiscount).replace(/[^0-9]/g, '')) || 0,
        };

        if (isEditMode) {
            const productData = {
                ...sanitizedFormData,
                sizes: String(formData.sizes || '').split(',').map(s => s.trim().toUpperCase()).filter(Boolean),
            };
            dispatch(updateProduct({ productId: selectedProduct._id, productData }));
        } else {
            if (images.length === 0) {
                toast.error('Vui lòng tải lên ít nhất một hình ảnh.');
                return;
            }

            const productFormData = new FormData();
            
            Object.keys(sanitizedFormData).forEach(key => {
                if (key !== 'sizes') {
                    productFormData.append(key, sanitizedFormData[key]);
                }
            });
            productFormData.append('sizes', formData.sizes); 

            for (let i = 0; i < images.length; i++) {
                productFormData.append('images', images[i]);
            }
            
            dispatch(createProduct(productFormData));
        }
    };

    useEffect(() => {
        return () => {
            imagePreviews.forEach(url => {
                if (url.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [imagePreviews]);
    
    return (
        <div className="admin-form-card">
            <h1 className="form-title">
                {isEditMode ? `Chỉnh Sửa: ${selectedProduct.name}` : 'Tạo Sản Phẩm Mới'}
            </h1>
            
            <form onSubmit={submitHandler}>
                <div className="form-row">
                    <div className="form-group-half">
                        <label>Tên Sản Phẩm</label>
                        <input 
                            type="text" 
                            value={formData.name} 
                            onChange={(e) => handleInputChange('name', e.target.value)} 
                            required 
                            placeholder="Nhập tên sản phẩm"
                        />
                    </div>
                    <div className="form-group-half">
                        <label>SKU</label>
                        <input 
                            type="text" 
                            value={formData.sku} 
                            onChange={(e) => handleInputChange('sku', e.target.value)} 
                            required 
                            placeholder="Nhập mã SKU"
                        />
                    </div>
                </div>
                
                <div className="form-row">
                    <div className="form-group-half">
                        <label>Giá Bán (VND)</label>
                        <input 
                            type="text" 
                            value={Number(formData.price).toLocaleString('vi-VN')}
                            onChange={(e) => handleInputChange('price', e.target.value.replace(/[^0-9]/g, ''))} 
                            required 
                            placeholder="0"
                        />
                    </div>
                    <div className="form-group-half">
                        <label>Giá Gốc (VND)</label>
                        <input 
                            type="text" 
                            value={Number(formData.priceBeforeDiscount).toLocaleString('vi-VN')}
                            onChange={(e) => handleInputChange('priceBeforeDiscount', e.target.value.replace(/[^0-9]/g, ''))} 
                            placeholder="0"
                        />
                    </div>
                </div>
                
                <div className="form-row">
                    <div className="form-group-half">
                        <label>Số Lượng Tồn Kho</label>
                        <input 
                            type="number" 
                            min="0" 
                            value={formData.countInStock} 
                            onChange={(e) => handleInputChange('countInStock', e.target.value)} 
                            required 
                            placeholder="0"
                        />
                    </div>
                    <div className="form-group-half">
                        <label>Danh mục</label>
                        <select 
                            value={formData.category} 
                            onChange={(e) => handleInputChange('category', e.target.value)} 
                            required
                        >
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="form-group-full">
                    <label>Kích cỡ (Cách nhau bởi dấu phẩy)</label>
                    <input 
                        type="text" 
                        placeholder="S, M, L, XL" 
                        value={formData.sizes} 
                        onChange={(e) => handleInputChange('sizes', e.target.value)} 
                    />
                </div>
                
                <div className="form-group-full">
                    <label>
                        Hình Ảnh Sản Phẩm 
                        {isEditMode && " (Không hỗ trợ sửa ảnh ở đây)"}
                    </label>
                    
                    <div className="image-preview-container">
                        {imagePreviews.map((src, i) => (
                            <div key={i} className="image-preview-item">
                                <img src={src} alt={`preview-${i}`} />
                                <button 
                                    type="button" 
                                    className="remove-image-btn"
                                    onClick={() => removeImage(i)}
                                    title="Xóa ảnh"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    <div className="upload-section">
                        <label htmlFor="image-upload" className="upload-label">
                            <FaUpload /> Chọn thêm ảnh
                        </label>
                        <input 
                            id="image-upload" 
                            type="file" 
                            onChange={handleImageChange} 
                            multiple 
                            hidden 
                            accept="image/*" 
                        />
                    </div>
                </div>
                
                <div className="form-group-full">
                    <label>Mô Tả</label>
                    <textarea 
                        value={formData.description} 
                        onChange={(e) => handleInputChange('description', e.target.value)} 
                        rows="5" 
                        required
                        placeholder="Nhập mô tả chi tiết về sản phẩm..."
                    />
                </div>
                
                <div className="form-actions">
                    <button 
                        type="submit" 
                        className="submit-btn" 
                        disabled={createStatus === 'loading' || updateStatus === 'loading'}
                    >
                        {(createStatus === 'loading' || updateStatus === 'loading') && (
                            <i className="fas fa-spinner fa-spin" style={{marginRight: '8px'}}></i>
                        )}
                        {isEditMode ? 'Lưu Thay Đổi' : 'Tạo Sản Phẩm'}
                    </button>
                    {isEditMode && (
                        <button type="button" className="cancel-btn" onClick={clearSelection}>
                            Hủy
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

const ProductManagementPage = () => {
    const dispatch = useDispatch();
    const { products, status, error, createStatus, updateStatus, deleteStatus } = useSelector((state) => state.products);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formKey, setFormKey] = useState(0); 
    const formRef = useRef(null);

    useEffect(() => {
        if (status === 'idle') { 
            dispatch(fetchProducts()); 
        }
    }, [status, dispatch]);

    useEffect(() => {
        if (createStatus === 'succeeded') { 
            toast.success('Tạo sản phẩm thành công!'); 
            dispatch(resetCreateStatus()); 
            setSelectedProduct(null);
            setFormKey(prev => prev + 1); 
            dispatch(fetchProducts());
        }
        if (createStatus === 'failed') { 
            toast.error(`Tạo thất bại: ${error}`); 
            dispatch(resetCreateStatus()); 
        }
    }, [createStatus, dispatch, error]);
    
    useEffect(() => {
        if (updateStatus === 'succeeded') { 
            toast.success('Cập nhật thành công!'); 
            dispatch(resetUpdateStatus()); 
            setSelectedProduct(null); 
            dispatch(fetchProducts());
        }
        if (updateStatus === 'failed') { 
            toast.error(`Cập nhật thất bại: ${error}`); 
            dispatch(resetUpdateStatus()); 
        }
    }, [updateStatus, dispatch, error]);

    useEffect(() => {
        if (deleteStatus === 'succeeded') { 
            toast.success('Xóa sản phẩm thành công!'); 
            dispatch(resetDeleteStatus()); 
        }
        if (deleteStatus === 'failed') { 
            toast.error(`Xóa thất bại: ${error}`); 
            dispatch(resetDeleteStatus()); 
        }
    }, [deleteStatus, dispatch, error]);

    const handleDelete = (id, productName) => {
        if (window.confirm(`Bạn chắc chắn muốn xóa sản phẩm "${productName}"?`)) { 
            dispatch(deleteProduct(id)); 
        }
    };
    
    const handleEdit = (product) => {
        setSelectedProduct(product);
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const clearSelection = () => {
        setSelectedProduct(null);
    };

    const handleCreateNew = () => {
        setSelectedProduct(null); 
        setFormKey(prev => prev + 1); 
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <div className="admin-management-page">
            <div className="admin-list-container">
                <div className="admin-list-header">
                    <h1>Danh sách Sản phẩm</h1>
                    <button onClick={handleCreateNew} className="btn-primary">
                        <FaPlus /> Tạo Mới
                    </button>
                </div>
                
                {status === 'loading' && (
                    <div style={{padding: '40px', textAlign: 'center'}}>
                        <Spinner />
                    </div>
                )}
                
                {status === 'failed' && (
                    <div className="error-message">
                        <i className="fas fa-exclamation-triangle"></i>
                        Lỗi: {error}
                    </div>
                )}
                
                {status === 'succeeded' && (
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>TÊN SẢN PHẨM</th>
                                    <th>GIÁ BÁN</th>
                                    <th>TỒN KHO</th>
                                    <th>DANH MỤC</th>
                                    <th>HÀNH ĐỘNG</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr 
                                        key={product._id} 
                                        className={selectedProduct?._id === product._id ? 'selected-row' : ''}
                                    >
                                        <td data-label="ID">{product._id.slice(-6)}</td>
                                        <td data-label="TÊN SẢN PHẨM">{product.name}</td>
                                        <td data-label="GIÁ BÁN">{formatPrice(product.price)}</td>
                                        <td data-label="TỒN KHO">
                                            <span className={`stock-badge ${product.countInStock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                                {product.countInStock}
                                            </span>
                                        </td>
                                        <td data-label="DANH MỤC">
                                            {product.category?.name || 'Chưa phân loại'}
                                        </td>
                                        <td data-label="HÀNH ĐỘNG">
                                            <div className="action-buttons">
                                                <button 
                                                    onClick={() => handleEdit(product)} 
                                                    className="btn-sm btn-edit"
                                                    title="Chỉnh sửa"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(product._id, product.name)} 
                                                    className="btn-sm btn-delete" 
                                                    disabled={deleteStatus === 'loading'}
                                                    title="Xóa"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {products.length === 0 && (
                            <div className="empty-state">
                                <div className="empty-icon">
                                    <i className="fas fa-box-open"></i>
                                </div>
                                <h3>Chưa có sản phẩm nào</h3>
                                <p>Hãy tạo sản phẩm đầu tiên của bạn!</p>
                                <button onClick={handleCreateNew} className="btn-primary">
                                    <FaPlus /> Tạo Sản Phẩm Đầu Tiên
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            <div ref={formRef} className="admin-form-container">
                <ProductForm 
                    key={formKey} 
                    selectedProduct={selectedProduct} 
                    clearSelection={clearSelection} 
                />
            </div>
        </div>
    );
};

export default ProductManagementPage;