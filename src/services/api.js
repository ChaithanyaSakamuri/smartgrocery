// src/services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get token from localStorage
const getToken = () => localStorage.getItem('token');

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add token if available and not a register/login request
  if (getToken() && !endpoint.includes('/login') && !endpoint.includes('/register')) {
    headers['Authorization'] = `Bearer ${getToken()}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API Error');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// **User APIs**
export const registerUser = (userData) =>
  apiCall('/users/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

export const loginUser = (credentials) =>
  apiCall('/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

export const getUserProfile = () =>
  apiCall('/users/profile', { method: 'GET' });

export const updateUserProfile = (profileData) =>
  apiCall('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });

// **Product APIs**
export const getAllProducts = (filters = {}) => {
  const params = new URLSearchParams(filters);
  return apiCall(`/products?${params}`, { method: 'GET' });
};

export const getProductById = (id) =>
  apiCall(`/products/${id}`, { method: 'GET' });

export const getProductsByCategory = (category) =>
  apiCall(`/products/category/${category}`, { method: 'GET' });

export const addProduct = (productData) =>
  apiCall('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });

export const updateProductStock = (id, stock) =>
  apiCall(`/products/${id}/stock`, {
    method: 'PUT',
    body: JSON.stringify({ stock }),
  });

// **Cart APIs**
export const getCart = () =>
  apiCall('/cart', { method: 'GET' });

export const addToCart = (item) =>
  apiCall('/cart/add', {
    method: 'POST',
    body: JSON.stringify(item),
  });

export const removeFromCart = (productId) =>
  apiCall('/cart/remove', {
    method: 'POST',
    body: JSON.stringify({ productId }),
  });

export const updateCartItem = (productId, qty) =>
  apiCall('/cart/update', {
    method: 'PUT',
    body: JSON.stringify({ productId, qty }),
  });

export const clearCart = () =>
  apiCall('/cart/clear', {
    method: 'POST',
  });

// **Order APIs**
export const createOrder = (orderData) =>
  apiCall('/orders/create', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });

export const getUserOrders = () =>
  apiCall('/orders', { method: 'GET' });

export const getOrderById = (id) =>
  apiCall(`/orders/${id}`, { method: 'GET' });

export const updateOrderStatus = (id, status) =>
  apiCall(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });

export const cancelOrder = (id) =>
  apiCall(`/orders/${id}/cancel`, {
    method: 'PUT',
  });
