import express from 'express';
import { getCategories } from './category.controller.js';

const router = express.Router();
router.route('/').get(getCategories);
export default router;