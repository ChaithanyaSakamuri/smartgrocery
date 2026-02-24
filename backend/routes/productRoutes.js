import express from 'express';
import { 
  getAllProducts, 
  getProductById, 
  getProductsByCategory, 
  addProduct, 
  updateProductStock,
  deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);
router.post('/', addProduct);
router.put('/:id/stock', updateProductStock);
router.delete('/:id', deleteProduct);

export default router;
