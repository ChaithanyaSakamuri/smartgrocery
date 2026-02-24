import express from 'express';
import {
  sendOTP,
  verifyOTPAndLogin,
  googleSignIn,
  getAuthConfig,
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// OTP Authentication (Phone)
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTPAndLogin);

// Google Sign-In
router.post('/google-signin', googleSignIn);

// feature configuration
router.get('/config', getAuthConfig);

// Traditional Email/Password
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected Routes
router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateUserProfile);

export default router;
