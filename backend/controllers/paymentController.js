import Order from '../models/Order.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
export const createPaymentOrder = async (req, res) => {
  try {
    const { amount, shippingAddress, city, zipcode, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount required' });
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Convert to paise (smallest unit)
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      description: description || 'Smart Grocery Order',
      notes: {
        userId: req.user.userId,
        shippingAddress,
        city,
        zipcode
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      message: 'Payment order created',
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify Payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify payment signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isValidSignature = expectedSignature === razorpay_signature;

    if (!isValidSignature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    res.json({
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Complete Order After Payment
export const completePaymentForOrder = async (req, res) => {
  try {
    const { razorpay_payment_id, shippingAddress, city, zipcode } = req.body;

    if (!razorpay_payment_id) {
      return res.status(400).json({ error: 'Payment ID required' });
    }

    // Get order details and total from cart
    const order = new Order({
      userId: req.user.userId,
      shippingAddress,
      city,
      zipcode,
      paymentMethod: 'razorpay',
      paymentId: razorpay_payment_id,
      status: 'confirmed'
    });

    await order.save();

    res.status(201).json({
      message: 'Order completed successfully',
      orderId: order._id,
      paymentStatus: 'completed'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
