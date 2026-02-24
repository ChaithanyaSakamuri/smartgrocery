import express from 'express';
import { 
  getCart, 
  addToCart, 
  removeFromCart, 
  updateCartItemQty, 
  clearCart 
} from '../controllers/cartController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getCart);
router.post('/add', authenticateToken, addToCart);
router.post('/remove', authenticateToken, removeFromCart);
router.put('/update', authenticateToken, updateCartItemQty);
router.post('/clear', authenticateToken, clearCart);

export default router;
