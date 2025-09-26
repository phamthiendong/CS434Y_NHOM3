import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: { 
        type: String, 
        required: [true, 'Tên sản phẩm là bắt buộc'], 
        unique: true 
    },
    sku: { 
        type: String, 
        required: [true, 'SKU là bắt buộc'], 
        unique: true 
    },
    images: { 
        type: [String], 
        required: [true, 'Sản phẩm phải có ít nhất một hình ảnh'],
        validate: [v => Array.isArray(v) && v.length > 0, 'Sản phẩm phải có ít nhất một hình ảnh']
    },
    description: { 
        type: String, 
        required: [true, 'Mô tả sản phẩm là bắt buộc']
    },
    price: { 
        type: Number, 
        required: [true, 'Giá sản phẩm là bắt buộc'], 
        default: 0 
    },
    priceBeforeDiscount: { 
        type: Number, 
        default: 0 
    },
    countInStock: { 
        type: Number, 
        required: [true, 'Số lượng tồn kho là bắt buộc'], 
        default: 0 
    },
    rating: { 
        type: Number, 
        default: 0 
    },
    numReviews: { 
        type: Number, 
        default: 0 
    },
    sizes: [String],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', 
        required: [true, 'Danh mục là bắt buộc'],
    },
}, { timestamps: true });

productSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        const value = error.keyValue[field];
        next(new Error(`Giá trị '${value}' của trường '${field}' đã tồn tại.`));
    } else {
        next(error);
    }
});


const Product = mongoose.model('Product', productSchema);
export default Product;