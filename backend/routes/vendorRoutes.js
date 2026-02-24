import express from 'express';
import { adminOnly, vendorOnly, protect } from '../middleware/auth.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const router = express.Router();

// Get vendor specific products
router.get('/my-products', protect, vendorOnly, async (req, res) => {
    try {
        const products = await Product.find({ vendorId: req.user.userId });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new product (Vendor)
router.post('/add-product', protect, vendorOnly, async (req, res) => {
    try {
        // strip any incoming `id` field to avoid null duplicates
        const { id, ...payload } = req.body;
        const { name, price, image, category, stock, description, expiryDate } = payload;

        const product = new Product({
            name,
            price,
            image,
            category,
            stock,
            description,
            expiryDate,
            vendorId: req.user.userId
        });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error('Error adding product for vendor', error.message, error);
        if (error.code === 11000) {
            // duplicate key, possibly from an old `id` index
            return res.status(400).json({
                error: 'Duplicate field value detected. Remove any manual id field or drop the id index on products.'
            });
        }
        res.status(500).json({ error: error.message });
    }
});

// Vendor Sales Report
router.get('/sales-report', protect, vendorOnly, async (req, res) => {
    try {
        const orders = await Order.find({ 'items.vendorId': req.user.userId });

        // Calculate vendor specific total
        const totalSales = orders.reduce((sum, order) => {
            const vendorItems = order.items.filter(item => item.vendorId.toString() === req.user.userId);
            return sum + vendorItems.reduce((s, i) => s + (i.price * i.qty), 0);
        }, 0);

        res.json({
            orderCount: orders.length,
            totalSales,
            recentOrders: orders.slice(0, 5)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
