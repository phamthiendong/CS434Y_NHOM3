import React, { useState, useEffect } from 'react';
import { FaPlus, FaMapMarkerAlt, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios'; 
import './AddressPage.css';

const MOCK_ADDRESSES = [];

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <span>{message}</span>
      <button onClick={onClose} className="toast-close"><FaTimes /></button>
    </div>
  );
};

const AddressForm = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    initialData || {
      firstName: '',
      lastName: '',
      phone: '',
      address1: '', 
      ward: '',
      district: '',
      city: '',
      isDefault: false,
    }
  );

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get('https://provinces.open-api.vn/api/?depth=1');
        setProvinces(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tỉnh thành:", error);
      }
    };
    fetchProvinces();
  }, []);

  const handleProvinceChange = async (e) => {
    const provinceCode = e.target.value;
    const selectedProvince = provinces.find(p => p.code == provinceCode);
    
    setFormData(prev => ({ ...prev, city: selectedProvince?.name || '', district: '', ward: '' }));
    setDistricts([]);
    setWards([]);

    if (provinceCode) {
      try {
        const response = await axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
        setDistricts(response.data.districts);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách quận huyện:", error);
      }
    }
  };

  const handleDistrictChange = async (e) => {
    const districtCode = e.target.value;
    const selectedDistrict = districts.find(d => d.code == districtCode);

    setFormData(prev => ({ ...prev, district: selectedDistrict?.name || '', ward: '' }));
    setWards([]);

    if (districtCode) {
      try {
        const response = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
        setWards(response.data.wards);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phường xã:", error);
      }
    }
  };
  
  const handleWardChange = (e) => {
    const selectedWard = wards.find(w => w.code == e.target.value);
    setFormData(prev => ({ ...prev, ward: selectedWard?.name || '' }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    onSave(formData);
    setIsSubmitting(false);
  };

  return (
    <div className="address-form-container">
      <div className="form-header">
        <h3>{initialData ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}</h3>
      </div>
      
      <form className="address-form" onSubmit={handleSubmit} noValidate>
        {/* Row 1: Họ và Tên */}
        <label htmlFor="firstName">Họ và Tên <span className="required">*</span></label>
        <div className="form-group-duo">
          <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Họ" disabled={isSubmitting} />
          <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Tên" disabled={isSubmitting} />
        </div>

        {/* Row 2: Số điện thoại */}
        <label htmlFor="phone">Số điện thoại <span className="required">*</span></label>
        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Nhập số điện thoại" disabled={isSubmitting} />
        
        {/* Row 3: Tỉnh/Thành phố */}
        <label htmlFor="city">Tỉnh/Thành phố <span className="required">*</span></label>
        <select id="city" onChange={handleProvinceChange} disabled={isSubmitting || provinces.length === 0}>
          <option value="">-- Chọn Tỉnh/Thành phố --</option>
          {provinces.map(province => <option key={province.code} value={province.code}>{province.name}</option>)}
        </select>
        
        {/* Row 4: Quận/Huyện */}
        <label htmlFor="district">Quận/Huyện <span className="required">*</span></label>
        <select id="district" onChange={handleDistrictChange} disabled={isSubmitting || districts.length === 0}>
          <option value="">-- Chọn Quận/Huyện --</option>
          {districts.map(district => <option key={district.code} value={district.code}>{district.name}</option>)}
        </select>

        {/* Row 5: Phường/Xã */}
        <label htmlFor="ward">Phường/Xã <span className="required">*</span></label>
        <select id="ward" name="ward" onChange={handleWardChange} disabled={isSubmitting || wards.length === 0}>
          <option value="">-- Chọn Phường/Xã --</option>
          {wards.map(ward => <option key={ward.code} value={ward.code}>{ward.name}</option>)}
        </select>

        {/* Row 6: Số nhà, tên đường */}
        <label htmlFor="address1">Số nhà, tên đường <span className="required">*</span></label>
        <input type="text" id="address1" name="address1" value={formData.address1} onChange={handleChange} placeholder="Ví dụ: 123 Võ Nguyên Giáp" disabled={isSubmitting} />
        
        {/* Row 7: Checkbox */}
        <div /> {/* Thẻ rỗng để giữ layout grid */}
        <div className="form-group-checkbox">
          <input type="checkbox" id="isDefault" name="isDefault" checked={formData.isDefault} onChange={handleChange} disabled={isSubmitting} />
          <label htmlFor="isDefault">Đặt làm địa chỉ mặc định</label>
        </div>

        {/* Row 8: Actions */}
        <div /> {/* Thẻ rỗng */}
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            <FaCheck /> {initialData ? 'Cập nhật' : 'Thêm địa chỉ'}
          </button>
          <button type="button" className="btn-secondary" onClick={onCancel} disabled={isSubmitting}>
            <FaTimes /> Hủy
          </button>
        </div>
      </form>
    </div>
  );
};


const AddressPage = () => {
    const [addresses, setAddresses] = useState(MOCK_ADDRESSES);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const handleAddNew = () => {
        setEditingAddress(null);
        setIsFormVisible(true);
    };

    const handleEdit = (address) => {
        setEditingAddress(address);
        setIsFormVisible(true);
    };

    const handleSave = (addressData) => {
        if (addressData.isDefault) {
            setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: false })));
        }

        if (editingAddress) {
            setAddresses(prev => prev.map(addr => addr._id === editingAddress._id ? { ...addressData, _id: editingAddress._id } : addr));
            showToast('Địa chỉ đã được cập nhật thành công!');
        } else {
            const newAddress = { ...addressData, _id: Date.now().toString() };
            setAddresses(prev => [...prev, newAddress]);
            showToast('Địa chỉ mới đã được thêm thành công!');
        }
        setIsFormVisible(false);
        setEditingAddress(null);
    };

    const handleDelete = (addressId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
            setAddresses(prev => prev.filter(addr => addr._id !== addressId));
            showToast('Địa chỉ đã được xóa thành công!');
        }
    };

    const handleCancel = () => {
        setIsFormVisible(false);
        setEditingAddress(null);
    };

    return (
        <div className="address-page-container">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="address-header">
                <h2><FaMapMarkerAlt /> Sổ địa chỉ</h2>
                {!isFormVisible && (
                    <button className="add-new-btn" onClick={handleAddNew}><FaPlus /> Thêm địa chỉ mới</button>
                )}
            </div>

            {isFormVisible ? (
                <AddressForm initialData={editingAddress} onSave={handleSave} onCancel={handleCancel} />
            ) : (
                <div className="address-list">
                    {addresses.length > 0 ? (
                        addresses.map((addr) => (
                            <div key={addr._id} className="address-card">
                                <div className="address-card-body">
                                    <h4>{addr.firstName} {addr.lastName} {addr.isDefault && <span className="default-badge">Mặc định</span>}</h4>
                                    <p className="address-line">{addr.address1}, {addr.ward}, {addr.district}, {addr.city}</p>
                                    <p className="phone">📞 {addr.phone}</p>
                                </div>
                                <div className="address-card-actions">
                                    <button className="btn-edit" onClick={() => handleEdit(addr)} title="Chỉnh sửa"><FaEdit /> Sửa</button>
                                    <button className="btn-delete" onClick={() => handleDelete(addr._id)} title="Xóa"><FaTrash /> Xóa</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <FaMapMarkerAlt className="empty-icon" />
                            <h3>Chưa có địa chỉ nào</h3>
                            <p>Hãy thêm địa chỉ đầu tiên để việc mua sắm dễ dàng hơn!</p>
                            <button className="btn-primary" onClick={handleAddNew}><FaPlus /> Thêm địa chỉ</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AddressPage;