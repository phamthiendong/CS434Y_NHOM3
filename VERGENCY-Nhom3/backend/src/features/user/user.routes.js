import express from 'express';
import { getAllUsers } from './user.controller.js';
import { protect, admin } from '../auth/auth.middleware.js';

const router = express.Router();

router.route('/').get(protect, admin, getAllUsers);

export default router;