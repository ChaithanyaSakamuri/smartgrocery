import express from 'express';
import { 
  createOrder, 
  getUserOrders, 
  getOrderById, 
  updateOrderStatus, 
  cancelOrder 
} from '../controllers/orderController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/create', authenticateToken, createOrder);
router.get('/', authenticateToken, getUserOrders);
router.get('/:id', authenticateToken, getOrderById);
router.put('/:id/status', updateOrderStatus);
router.put('/:id/cancel', authenticateToken, cancelOrder);

export default router;
