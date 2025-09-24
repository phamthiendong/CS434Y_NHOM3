import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './src/config/database.js';

import categories from './data/categories.js'; 
import productsData from './data/products.js'; 

// Models
import Category from './src/features/category/category.model.js'; 
import Product from './src/features/product/product.model.js';
import User from './src/features/user/user.model.js'; 

dotenv.config({ path: './.env' });
connectDB();

const importData = async () => {
    try {
        await Product.deleteMany();
        await Category.deleteMany();
        await User.deleteMany();

        console.log('🚮 Dữ liệu cũ đã được xóa...');

        const createdCategories = await Category.insertMany(categories);

        console.log('✅ Danh mục đầy đủ đã được import!');

        const categoryMap = createdCategories.reduce((map, category) => {
            map[category.name] = category._id;
            return map;
        }, {});

        const productsToCreate = productsData.map(product => {
            if (categoryMap[product.category]) {
                return {
                    ...product,
                    category: categoryMap[product.category] 
                };
            }
            console.warn(`⚠️  Cảnh báo: Sản phẩm "${product.name}" có danh mục "${product.category}" không tồn tại và sẽ được bỏ qua.`);
            return null;
        }).filter(p => p !== null); 

        await Product.insertMany(productsToCreate);
        console.log('✅ Sản phẩm đã được import!');
        
        console.log('🎉 --- HOÀN TẤT ---');
        process.exit();
    } catch (error) {
        console.error(`❌ Lỗi khi import dữ liệu: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Product.deleteMany();
        await Category.deleteMany();
        await User.deleteMany();

        console.log('✅ Toàn bộ dữ liệu đã được XÓA!');
        process.exit();
    } catch (error) {
        console.error(`❌ Lỗi khi xóa dữ liệu: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}