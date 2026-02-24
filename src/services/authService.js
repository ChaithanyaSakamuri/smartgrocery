// src/services/authService.js
// Frontend authentication and payment service

const API_BASE = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

// ===== OTP Authentication =====
export const sendOTP = async (phoneNumber) => {
  try {
    const response = await fetch(`${API_BASE}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber })
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const verifyOTPAndLogin = async (phoneNumber, idToken) => {
  try {
    const response = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, idToken })
    });
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  } catch (error) {
    throw error;
  }
};

// ===== Google Sign-In =====
export const googleSignIn = async (idToken) => {
  try {
    const response = await fetch(`${API_BASE}/auth/google-signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken })
    });
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  } catch (error) {
    throw error;
  }
};

// ===== Traditional Email/Password =====
export const register = async (name, email, password, phone) => {
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone })
    });
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  } catch (error) {
    throw error;
  }
};

// ===== Google Login Helper =====
export const loginWithGoogle = async (idToken) => {
  // this function simply delegates to googleSignIn but returns the raw data
  return await googleSignIn(idToken);
};

// ===== Payment Integration =====
export const createPaymentOrder = async (amount, shippingAddress, city, zipcode, description) => {
  try {
    const response = await fetch(`${API_BASE}/payments/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ amount, shippingAddress, city, zipcode, description })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const verifyPayment = async (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
  try {
    const response = await fetch(`${API_BASE}/payments/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ razorpay_order_id, razorpay_payment_id, razorpay_signature })
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const completePaymentOrder = async (razorpay_payment_id, shippingAddress, city, zipcode) => {
  try {
    const response = await fetch(`${API_BASE}/payments/complete-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ razorpay_payment_id, shippingAddress, city, zipcode })
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// ===== Razorpay Payment Handler =====
export const openRazorpayPayment = (orderId, amount, userEmail, userName) => {
  return new Promise((resolve, reject) => {
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID, // From .env
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      order_id: orderId,
      name: 'Smart Grocery',
      description: 'Order Payment',
      image: 'https://yourlogo.png',
      prefill: {
        email: userEmail,
        name: userName
      },
      theme: {
        color: '#10b981'
      },
      handler: async function (response) {
        try {
          const verified = await verifyPayment(
            orderId,
            response.razorpay_payment_id,
            response.razorpay_signature
          );

          if (verified.message === 'Payment verified successfully') {
            resolve({ success: true, paymentId: response.razorpay_payment_id });
          } else {
            resolve({ success: false });
          }
        } catch (err) {
          reject(err);
        }
      },
      modal: {
        ondismiss: function () {
          resolve({ success: false, dismissed: true });
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  });
};

// ===== Logout =====
export const logout = () => {
  localStorage.removeItem('token');
};

// ===== Check if logged in =====
export const isLoggedIn = () => !!getToken();
