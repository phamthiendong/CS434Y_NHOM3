import express from 'express';
import {
    addOrderItems,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    getMyOrders,
    getDashboardStats,
    getAvailablePeriods 
} from './order.controller.js';
import { protect, admin } from '../auth/auth.middleware.js';

const router = express.Router();

router.route('/')
    .post(protect, addOrderItems)       
    .get(protect, admin, getAllOrders);   

router.route('/myorders')
    .get(protect, getMyOrders);

router.route('/stats')
    .get(protect, admin, getDashboardStats);

router.route('/available-periods')
    .get(protect, admin, getAvailablePeriods);

router.route('/:id/status')
    .put(protect, admin, updateOrderStatus);

router.route('/:id')
    .get(protect, getOrderById);

export default router;