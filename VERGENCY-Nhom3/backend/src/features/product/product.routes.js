import express from 'express';
import { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    getRelatedProducts 
} from './product.controller.js';
import { protect, admin } from '../auth/auth.middleware.js';
import upload from '../../config/multer.config.js'; 

const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(protect, admin, upload.array('images', 10), createProduct);

router.route('/:productId/related').get(getRelatedProducts);

router.route('/:productId')
    .get(getProductById)
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct); 

export default router;