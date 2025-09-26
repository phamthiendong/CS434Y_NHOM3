import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Product from './product.model.js';
import Category from '../category/category.model.js';

const transformProductImagePaths = (product) => {
    const backendUrl = process.env.BACKEND_URL;
    
    if (!backendUrl) {
        return product.toObject ? product.toObject() : { ...product };
    }

    const productObj = product.toObject ? product.toObject() : { ...product };

    if (productObj.images && Array.isArray(productObj.images)) {
        productObj.images = productObj.images.map(imagePath => {
            if (imagePath.startsWith('http')) {
                return imagePath;
            }
            return `${backendUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
        });
    }
    return productObj;
};

const getProducts = asyncHandler(async (req, res) => {
    const { category, sortBy } = req.query;
    const filter = {};

    if (category) {
        let categoryObject = null;
        if (mongoose.Types.ObjectId.isValid(category)) {
            categoryObject = await Category.findById(category);
        }
        if (!categoryObject) {
            const categoryRegex = new RegExp(`^${category}$`, 'i');
            categoryObject = await Category.findOne({ name: categoryRegex });
        }
        if (categoryObject) {
            filter.category = categoryObject._id;
        } else {
            return res.json([]);
        }
    }

    let sortOptions = {};
    switch (sortBy) {
        case 'price-asc': sortOptions = { price: 1 }; break;
        case 'price-desc': sortOptions = { price: -1 }; break;
        case 'oldest': sortOptions = { createdAt: 1 }; break;
        case 'newest': default: sortOptions = { createdAt: -1 }; break;
    }

    const products = await Product.find(filter)
                                    .populate('category', 'name')
                                    .sort(sortOptions);

    const transformedProducts = products.map(product => transformProductImagePaths(product));
    
    res.json(transformedProducts);
});

const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.productId).populate('category', 'name');
    if (product) {
        const transformedProduct = transformProductImagePaths(product);
        res.json(transformedProduct);
    } else {
        res.status(404);
        throw new Error('Không tìm thấy sản phẩm');
    }
});

const createProduct = asyncHandler(async (req, res) => {
    console.log('==================== NEW REQUEST ====================');
    console.log('--- BODY NHẬN ĐƯỢC ---:', req.body);
    console.log('--- FILES NHẬN ĐƯỢC ---:', req.files);
    console.log('=====================================================');

    const { name, price, priceBeforeDiscount, sku, category, countInStock, description } = req.body;
    
    if (!req.files || req.files.length === 0) {
        res.status(400);
        throw new Error('Vui lòng tải lên ít nhất một hình ảnh cho sản phẩm.');
    }
    const images = req.files.map(file => `/images/${file.filename}`);

    let sizesArray = [];
    if (req.body.sizes && typeof req.body.sizes === 'string') {
        sizesArray = req.body.sizes.split(',').map(s => s.trim()).filter(s => s);
    }

    const product = new Product({
        user: req.user._id,
        name,
        price,
        priceBeforeDiscount,
        sku,
        category,
        countInStock,
        description,
        images,
        sizes: sizesArray,
    });

    const createdProduct = await product.save();
    const transformedProduct = transformProductImagePaths(createdProduct);
    res.status(201).json(transformedProduct);
});

const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, priceBeforeDiscount, sku, category, countInStock, description } = req.body;
    const product = await Product.findById(req.params.productId);

    if (product) {
        product.name = name || product.name;
        product.price = price !== undefined ? price : product.price;
        product.priceBeforeDiscount = priceBeforeDiscount !== undefined ? priceBeforeDiscount : product.priceBeforeDiscount;
        product.sku = sku || product.sku;
        product.category = category || product.category;
        product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
        product.description = description || product.description;

        if (req.body.sizes !== undefined) {
             if (typeof req.body.sizes === 'string') {
                product.sizes = req.body.sizes.split(',').map(s => s.trim()).filter(s => s);
            } else {
                product.sizes = req.body.sizes;
            }
        }
        
        const updatedProduct = await product.save();
        const populatedProduct = await Product.findById(updatedProduct._id).populate('category', 'name');
        
        const transformedProduct = transformProductImagePaths(populatedProduct);
        res.json(transformedProduct);
    } else {
        res.status(404);
        throw new Error('Không tìm thấy sản phẩm');
    }
});

const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.productId);
    if (product) {
        await product.deleteOne();
        res.json({ message: 'Sản phẩm đã được xóa' });
    } else {
        res.status(404);
        throw new Error('Không tìm thấy sản phẩm');
    }
});

const getRelatedProducts = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.productId);
    if (!product) {
        res.status(404);
        throw new Error('Sản phẩm không tồn tại');
    }
    const relatedProducts = await Product.find({
        category: product.category,
        _id: { $ne: product._id }
    }).limit(3).populate('category', 'name');

    const transformedProducts = relatedProducts.map(p => transformProductImagePaths(p));
    res.json(transformedProducts);
});

export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getRelatedProducts,
};