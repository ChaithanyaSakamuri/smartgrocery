import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

// Create Order
export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, city, zipcode, paymentMethod, items } = req.body;

    let orderItems;
    let totalAmount;

    // If items provided in request (from COD checkout), use them
    if (items && items.length > 0) {
      orderItems = items;
      totalAmount = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    } else {
      // Otherwise try to fetch from database cart
      const cart = await Cart.findOne({ userId: req.user.userId });
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
      }
      orderItems = cart.items.map(item => ({
        productId: item.productId,
        vendorId: item.vendorId,
        name: item.name,
        price: item.price,
        qty: item.qty,
        image: item.image,
        category: item.category
      }));
      totalAmount = cart.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
      
      // Clear cart after order
      await Cart.findOneAndUpdate({ userId: req.user.userId }, { items: [] });
    }

    const order = new Order({
      userId: req.user.userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      city,
      zipcode,
      paymentMethod: paymentMethod || 'upi',
      status: 'pending'
    });

    await order.save();

    res.status(201).json({ message: 'Order created', orderId: order._id, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get User Orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if order belongs to user
    if (order.userId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Order Status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel Order
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.userId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ error: 'Cannot cancel this order' });
    }

    order.status = 'cancelled';
    order.updatedAt = Date.now();
    await order.save();

    res.json({ message: 'Order cancelled', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
