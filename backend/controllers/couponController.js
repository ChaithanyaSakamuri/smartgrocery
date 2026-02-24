import Coupon from '../models/Coupon.js';

// create a new coupon (admin only)
export const createCoupon = async (req, res) => {
    try {
        const {
            code,
            discountType = 'percentage',
            discountValue,
            minPurchase = 0,
            expiryDate
        } = req.body;

        if (!code || !discountValue || !expiryDate) {
            return res.status(400).json({ error: 'code, discountValue and expiryDate required' });
        }

        const coupon = new Coupon({
            code,
            discountType,
            discountValue,
            minPurchase,
            expiryDate: new Date(expiryDate)
        });

        await coupon.save();
        res.status(201).json(coupon);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Coupon code already exists' });
        }
        res.status(500).json({ error: error.message });
    }
};

// optional: list all coupons (admin)
export const listCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
