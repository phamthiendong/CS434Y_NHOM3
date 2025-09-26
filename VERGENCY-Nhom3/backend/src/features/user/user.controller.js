import asyncHandler from 'express-async-handler';
import User from './user.model.js';

/**
 * @desc   
 * @route   
 * @access  
 */
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({ isAdmin: false }).select('-password');
    
    res.status(200).json(users);
});

export {
    getAllUsers,
};