import Category from './category.model.js';
import asyncHandler from 'express-async-handler';

const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({}).sort({ sortOrder: 'asc' });
    res.json(categories);
});

export { getCategories };