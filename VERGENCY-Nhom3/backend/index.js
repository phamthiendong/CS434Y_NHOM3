import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path'; 
import { fileURLToPath } from 'url';

import connectDB from './src/config/database.js';
import authRoutes from './src/features/auth/auth.routes.js';
import categoryRoutes from './src/features/category/category.routes.js';
import orderRoutes from './src/features/order/order.routes.js';
import productRoutes from './src/features/product/product.routes.js';
import userRoutes from './src/features/user/user.routes.js';
import uploadRoutes from './src/features/upload/upload.routes.js'; 
import { notFound, errorHandler } from './src/middleware/error.middleware.js';

dotenv.config({ path: './.env' });

console.log('1. Attempting to connect to DB...');
connectDB();

const app = express();

app.use(cors());          
app.use(express.json());  

app.get('/api/v1', (req, res) => {
  res.send('API v1 is running...');
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoryRoutes); 
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/upload', uploadRoutes); 


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/images', express.static(path.join(__dirname, 'public/images')));


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy ở cổng ${PORT} trong môi trường ${process.env.NODE_ENV}`);
});