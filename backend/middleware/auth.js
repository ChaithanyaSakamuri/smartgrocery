import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

export const authenticateToken = protect;

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied: Admin only' });
  }
};

export const vendorOnly = async (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ error: 'Access denied: Vendor only' });
  }

  if (req.user.role === 'admin') {
    return next(); // admins are allowed everywhere
  }

  if (req.user.role === 'vendor') {
    // make sure vendor is approved in database
    try {
      const User = require('../models/User.js').default; // require to avoid circular
      const user = await User.findById(req.user.userId);
      if (!user) return res.status(403).json({ error: 'Access denied: Vendor only' });
      if (!user.vendorApproved) {
        return res.status(403).json({ error: 'Vendor account not approved' });
      }
      return next();
    } catch (err) {
      return res.status(500).json({ error: 'Server error' });
    }
  }

  res.status(403).json({ error: 'Access denied: Vendor only' });
};
