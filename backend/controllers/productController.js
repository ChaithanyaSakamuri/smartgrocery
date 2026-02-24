import Product from '../models/Product.js';

// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Products by Category
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add Product (Admin)
export const addProduct = async (req, res) => {
  try {
    const { id, name, price, image, stock, category, description } = req.body;

    const productExists = await Product.findOne({ id });
    if (productExists) {
      return res.status(400).json({ error: 'Product already exists' });
    }

    const product = new Product({ id, name, price, image, stock, category, description });
    await product.save();

    res.status(201).json({ message: 'Product added', product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Product Stock
export const updateProductStock = async (req, res) => {
  try {
    const { stock } = req.body;
    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      { stock },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Stock updated', product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete product (admin)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
