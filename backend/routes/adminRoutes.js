import express from 'express';
import { adminOnly, protect } from '../middleware/auth.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { createCoupon, listCoupons } from '../controllers/couponController.js';
import { updateOrderStatus } from '../controllers/orderController.js';

const router = express.Router();

// Get Global Sales Overview + basic analytics
router.get('/sales-overview', protect, adminOnly, async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const orders = await Order.find();

        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const totalVendors = await User.countDocuments({ role: 'vendor', vendorApproved: true });
        const totalCustomers = await User.countDocuments({ role: 'customer' });

        // daily sales (last 7 days)
        const today = new Date();
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 6);
        const daily = [];
        for (let d = new Date(lastWeek); d <= today; d.setDate(d.getDate() + 1)) {
            const start = new Date(d);
            start.setHours(0,0,0,0);
            const end = new Date(d);
            end.setHours(23,59,59,999);
            const dayOrders = orders.filter(o => o.createdAt >= start && o.createdAt <= end);
            daily.push({ date: start.toISOString().slice(0,10), revenue: dayOrders.reduce((s,o)=>s+o.totalAmount,0) });
        }

        // category-wise sales
        const cats = {};
        orders.forEach(o=>{
            o.items.forEach(i=>{
                cats[i.category] = (cats[i.category]||0) + i.price*i.qty;
            });
        });

        res.json({
            metrics: [
                { label: 'Total Sales', value: `₹${totalRevenue.toLocaleString()}`, icon: '💰' },
                { label: 'Total Orders', value: totalOrders, icon: '📦' },
                { label: 'Active Vendors', value: totalVendors, icon: '🏪' },
                { label: 'New Customers', value: totalCustomers, icon: '👤' }
            ],
            recentOrders: orders.slice(-5).reverse(),
            analytics: { daily, categorySales: cats }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// list all orders
router.get('/orders', protect, adminOnly, async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// update order status via central route
router.put('/orders/:id/status', protect, adminOnly, updateOrderStatus);

// Manage Users (Admin)
router.get('/users', protect, adminOnly, async (req, res) => {
    try {
        // include vendorApproved field so frontend can know pending vendors
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Approve a pending vendor account
router.patch('/users/:id/approve', protect, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        user.vendorApproved = true;
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update User Role (e.g., approve a vendor)
router.patch('/users/:id/role', protect, adminOnly, async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a user
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// coupon management
router.post('/coupons', protect, adminOnly, createCoupon);
router.get('/coupons', protect, adminOnly, listCoupons);

export default router;
