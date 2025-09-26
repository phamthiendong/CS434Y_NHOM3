import asyncHandler from 'express-async-handler';
import Order from './order.model.js';
import Product from '../product/product.model.js';
import User from '../user/user.model.js';

const transformOrderImagePaths = (order) => {
    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) {
        return order.toObject ? order.toObject() : { ...order };
    }

    const orderObj = order.toObject ? order.toObject() : { ...order };

    if (orderObj.orderItems && Array.isArray(orderObj.orderItems)) {
        orderObj.orderItems = orderObj.orderItems.map(item => {
            if (item.image && !item.image.startsWith('http')) {
                item.image = `${backendUrl}${item.image.startsWith('/') ? '' : '/'}${item.image}`;
            }
            return item;
        });
    }
    return orderObj;
};

const addOrderItems = asyncHandler(async (req, res) => {
    const { 
        orderItems, 
        shippingAddress, 
        paymentMethod, 
        itemsPrice, 
        shippingPrice, 
        totalPrice 
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('Không có sản phẩm trong đơn hàng');
    } else {
        const order = new Order({
            user: req.user._id,
            orderItems: orderItems.map(item => ({
                name: item.name,
                qty: item.qty,
                image: item.image, 
                price: item.price,
                size: item.size,
                product: item._id, 
            })),
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();
        
        const transformedOrder = transformOrderImagePaths(createdOrder);
        res.status(201).json(transformedOrder);
    }
});

const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).sort({ createdAt: -1 }).populate('user', 'id name email');
    
    const transformedOrders = orders.map(order => transformOrderImagePaths(order));
    res.json(transformedOrders);
});

const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name email')
        .populate('orderItems.product', 'name image');

    if (order) {
        if(req.user.isAdmin || order.user._id.equals(req.user._id)) {
            const transformedOrder = transformOrderImagePaths(order);
            res.json(transformedOrder);
        } else {
            res.status(403);
            throw new Error('Không được phép truy cập đơn hàng này');
        }
    } else {
        res.status(404);
        throw new Error('Không tìm thấy đơn hàng');
    }
});

const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    
    const transformedOrders = orders.map(order => transformOrderImagePaths(order));
    res.json(transformedOrders);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = req.body.status || order.status;

        if (req.body.status === 'Đã giao') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        } else {
            order.isDelivered = false;
            order.deliveredAt = null;
        }

        const updatedOrder = await order.save();
        
        const transformedOrder = transformOrderImagePaths(updatedOrder);
        res.json(transformedOrder);
    } else {
        res.status(404);
        throw new Error('Không tìm thấy đơn hàng');
    }
});

const getDashboardStats = asyncHandler(async (req, res) => {
    const totalProducts = await Product.countDocuments();
    const totalOrdersAllTime = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'user' });
    const totalRevenueAllTimeData = await Order.aggregate([
        { $match: { status: 'Đã giao' } },
        { $group: { _id: null, total: { $sum: '$itemsPrice' } } }
    ]);
    const totalRevenueAllTime = totalRevenueAllTimeData.length > 0 ? totalRevenueAllTimeData[0].total : 0;

    const today = new Date();
    const firstDayCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    const currentMonthRevenueData = await Order.aggregate([
        { $match: { status: 'Đã giao', createdAt: { $gte: firstDayCurrentMonth } } },
        { $group: { _id: null, total: { $sum: '$itemsPrice' } } }
    ]);
    const currentMonthRevenue = currentMonthRevenueData.length > 0 ? currentMonthRevenueData[0].total : 0;
    
    const lastMonthRevenueData = await Order.aggregate([
        { $match: { status: 'Đã giao', createdAt: { $gte: firstDayLastMonth, $lt: firstDayCurrentMonth } } },
        { $group: { _id: null, total: { $sum: '$itemsPrice' } } }
    ]);
    const lastMonthRevenue = lastMonthRevenueData.length > 0 ? lastMonthRevenueData[0].total : 0;

    const totalOrdersThisMonth = await Order.countDocuments({ createdAt: { $gte: firstDayCurrentMonth } });

    const revenueByCategory = await Order.aggregate([
        { $match: { status: 'Đã giao', createdAt: { $gte: firstDayCurrentMonth } } },
        { $unwind: '$orderItems' },
        { $lookup: { from: 'products', localField: 'orderItems.product', foreignField: '_id', as: 'productDetails' } },
        { $unwind: '$productDetails' },
        { $lookup: { from: 'categories', localField: 'productDetails.category', foreignField: '_id', as: 'categoryDetails' } },
        { $unwind: '$categoryDetails' },
        { $group: { _id: '$categoryDetails.name', revenue: { $sum: { $multiply: ['$orderItems.qty', '$orderItems.price'] } } } },
        { $sort: { revenue: -1 } }
    ]);

    const monthlySales = await Order.aggregate([
        { $match: { status: 'Đã giao' } },
        { $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            totalRevenue: { $sum: '$itemsPrice' }
        }},
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 6 }
    ]);

    res.json({
        overview: {
            totalProducts,
            totalOrders: totalOrdersAllTime,
            totalCustomers,
            totalRevenue: totalRevenueAllTime
        },
        monthlyReport: {
            currentMonthRevenue,
            lastMonthRevenue,
            totalOrdersThisMonth,
            revenueByCategory,
            monthlySales
        }
    });
});

const getAvailablePeriods = asyncHandler(async (req, res) => {
    const year = parseInt(req.query.year);

    if (!year || isNaN(year)) {
        res.status(400);
        throw new Error('Vui lòng cung cấp một năm hợp lệ.');
    }

    try {
        const availableMonths = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                        $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: { date: "$createdAt", timezone: "Asia/Ho_Chi_Minh" } }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const monthNumbers = availableMonths.map(item => item._id);
        
        res.json({
            months: monthNumbers,
            weeks: [] 
        });

    } catch (error) {
        res.status(500);
        throw new Error('Không thể lấy dữ liệu các kỳ có sẵn.');
    }
});

export { 
    addOrderItems, 
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    getMyOrders,
    getDashboardStats,
    getAvailablePeriods 
};