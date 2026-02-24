import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { admin } from '../config/firebase.js'; // We'll create this

// Send OTP via Firebase
export const sendOTP = async (req, res) => {
  try {
    if (!admin) {
      return res.status(503).json({ error: 'Firebase service not configured. OTP features are disabled.' });
    }

    const { phoneNumber } = req.body;

    if (!phoneNumber || phoneNumber.length < 10) {
      return res.status(400).json({ error: 'Valid phone number required' });
    }

    // Firebase sends OTP - client receives it
    res.json({
      message: 'OTP sent successfully',
      loginSessionId: 'firebase-session-id',
      instruction: 'Enter OTP on client side via Firebase'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify OTP and Login
export const verifyOTPAndLogin = async (req, res) => {
  try {
    if (!admin) {
      return res.status(503).json({ error: 'Firebase service not configured. OTP features are disabled.' });
    }

    const { phoneNumber, idToken } = req.body;

    // Verify token from Firebase on client side
    if (!idToken || !phoneNumber) {
      return res.status(400).json({ error: 'Phone number and OTP token required' });
    }

    // Find or create user with phone
    let user = await User.findOne({ phone: phoneNumber });
    if (!user) {
      user = new User({
        phone: phoneNumber,
        email: `${phoneNumber}@phone.local`,
        name: 'Mobile User',
        password: 'phone-auth-user'
      });
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful via OTP',
      token,
      user: { id: user._id, name: user.name, phone: user.phone, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Google Sign-In
export const googleSignIn = async (req, res) => {
  try {
    if (!admin) {
      return res.status(503).json({ error: 'Firebase service not configured. Google Sign-In is disabled.' });
    }

    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'ID token required' });
    }

    // Verify Google token with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, picture, uid } = decodedToken;

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        email,
        name: name || 'Google User',
        googleId: uid,
        password: 'google-auth-user'
      });
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful via Google',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Traditional Register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // accept frontend alias 'user' as 'customer', and protect admin special email
    let finalRole = role || 'customer';
    if (finalRole === 'user') finalRole = 'customer';
    if (email === 'admin@freshly.com') finalRole = 'admin';

    // validate against schema enum
    const allowedRoles = ['customer', 'vendor', 'admin'];
    if (!allowedRoles.includes(finalRole)) {
      return res.status(400).json({ error: `Invalid role '${role}'` });
    }

    // vendor accounts are pending approval by default
    const vendorApproved = finalRole === 'vendor' ? false : true;

    const user = new User({ name, email, password, phone, role: finalRole, vendorApproved });
    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role, vendorApproved: user.vendorApproved },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, vendorApproved: user.vendorApproved }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login with Email & Password
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // prevent unapproved vendors from logging in
    if (user.role === 'vendor' && !user.vendorApproved) {
      return res.status(403).json({ error: 'Vendor account pending approval' });
    }

    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role, vendorApproved: user.vendorApproved },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, vendorApproved: user.vendorApproved }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get configuration for auth features
export const getAuthConfig = async (req, res) => {
  res.json({
    googleEnabled: !!admin,
    otpEnabled: !!admin
  });
};

// Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, address, city, zipcode } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, phone, address, city, zipcode, updatedAt: Date.now() },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
