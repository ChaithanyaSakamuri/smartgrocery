import express from 'express';
import {
  createPaymentOrder,
  verifyPayment,
  completePaymentForOrder
} from '../controllers/paymentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Payment Routes (all protected with auth)
router.post('/create-order', authenticateToken, createPaymentOrder);
router.post('/verify', authenticateToken, verifyPayment);
router.post('/complete-order', authenticateToken, completePaymentForOrder);

export default router;
