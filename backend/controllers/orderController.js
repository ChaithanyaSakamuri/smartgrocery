import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

// Create Order
export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, city, zipcode, paymentMethod, items } = req.body;

    if (!req.user || !req.user.userId) {
      console.error('[OrderController] Error: req.user or userId missing');
      return res.status(401).json({ error: 'User authenticated but identity missing' });
    }

    console.log(`[OrderController] Creating order for user: ${req.user.userId}, method: ${paymentMethod}`);

    let orderItems = [];
    let totalAmount = 0;

    // If items provided in request (from COD checkout), use them
    if (items && items.length > 0) {
      orderItems = items;
      totalAmount = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
      console.log(`[OrderController] Using ${items.length} items from request body`);

      // Still try to clear the DB cart for this user since they just checked out
      try {
        await Cart.findOneAndUpdate({ userId: req.user.userId }, { items: [] });
      } catch (cartErr) {
        console.warn('[OrderController] Failed to clear DB cart, but continuing order:', cartErr.message);
      }
    } else {
      // Otherwise try to fetch from database cart
      const cart = await Cart.findOne({ userId: req.user.userId });
      if (!cart || cart.items.length === 0) {
        console.warn(`[OrderController] Cart empty for user: ${req.user.userId}`);
        return res.status(400).json({ error: 'Cart is empty' });
      }
      orderItems = cart.items.map(item => ({
        productId: item.productId,
        vendorId: item.vendorId || 'local',
        name: item.name,
        price: item.price,
        qty: item.qty,
        image: item.image,
        category: item.category || 'Grocery'
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
    console.log(`[OrderController] Success: Order ${order._id} created`);

    res.status(201).json({ message: 'Order created', orderId: order._id, order });
  } catch (error) {
    console.error('[OrderController] Exception:', error);
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
