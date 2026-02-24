import Cart from '../models/Cart.js';

// Get User Cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) {
      return res.json({ items: [] });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add to Cart
export const addToCart = async (req, res) => {
  try {
    const { productId, name, price, qty, image } = req.body;
    let cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) {
      cart = new Cart({ userId: req.user.userId, items: [] });
    }

    const itemExists = cart.items.find(item => item.productId === productId);
    if (itemExists) {
      itemExists.qty += qty || 1;
    } else {
      cart.items.push({ productId, name, price, qty: qty || 1, image });
    }

    cart.updatedAt = Date.now();
    await cart.save();

    res.json({ message: 'Added to cart', cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove from Cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.productId !== productId);
    cart.updatedAt = Date.now();
    await cart.save();

    res.json({ message: 'Removed from cart', cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Cart Item Quantity
export const updateCartItemQty = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    const cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const item = cart.items.find(item => item.productId === productId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    if (qty <= 0) {
      cart.items = cart.items.filter(item => item.productId !== productId);
    } else {
      item.qty = qty;
    }

    cart.updatedAt = Date.now();
    await cart.save();

    res.json({ message: 'Cart updated', cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Clear Cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = [];
    cart.updatedAt = Date.now();
    await cart.save();

    res.json({ message: 'Cart cleared', cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
