# 🚀 Quick Reference - Authentication & Payment APIs

## 🔗 API Base URL
```
http://localhost:5000/api
```

---

## 🔐 Authentication Endpoints

### Send OTP
```http
POST /auth/send-otp
Content-Type: application/json

{
  "phoneNumber": "+919876543210"
}

Response 200:
{
  "message": "OTP sent successfully",
  "loginSessionId": "..."
}
```

### Verify OTP & Login
```http
POST /auth/verify-otp
Content-Type: application/json

{
  "phoneNumber": "+919876543210",
  "idToken": "firebase_id_token"
}

Response 200:
{
  "message": "Login successful via OTP",
  "token": "jwt_token",
  "user": { "id": "...", "name": "...", "phone": "..." }
}
```

### Google Sign-In
```http
POST /auth/google-signin
Content-Type: application/json

{
  "idToken": "google_id_token_from_frontend"
}

Response 200:
{
  "message": "Login successful via Google",
  "token": "jwt_token",
  "user": { "id": "...", "name": "...", "email": "..." }
}
```

### Register (Email/Password)
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "phone": "9876543210"
}

Response 201:
{
  "message": "User registered successfully",
  "token": "jwt_token",
  "user": { "id": "...", "name": "...", "email": "..." }
}
```

### Login (Email/Password)
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response 200:
{
  "message": "Login successful",
  "token": "jwt_token",
  "user": { "id": "...", "name": "...", "email": "..." }
}
```

### Get Profile
```http
GET /auth/profile
Authorization: Bearer {jwt_token}

Response 200:
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "...",
  "city": "...",
  "zipcode": "..."
}
```

### Update Profile
```http
PUT /auth/profile
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "Jane Doe",
  "phone": "9876543210",
  "address": "123 New St",
  "city": "Mumbai",
  "zipcode": "400001"
}

Response 200:
{
  "message": "Profile updated",
  "user": { ... }
}
```

---

## 💳 Payment Endpoints

### Create Payment Order
```http
POST /payments/create-order
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "amount": 500,
  "shippingAddress": "123 Main St",
  "city": "Mumbai",
  "zipcode": "400001",
  "description": "Grocery Order"
}

Response 200:
{
  "message": "Payment order created",
  "orderId": "order_1A2B3C",
  "amount": 50000,
  "currency": "INR"
}
```

### Verify Payment
```http
POST /payments/verify
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "razorpay_order_id": "order_1A2B3C",
  "razorpay_payment_id": "pay_1A2B3C",
  "razorpay_signature": "signature_hash"
}

Response 200:
{
  "message": "Payment verified successfully",
  "paymentId": "pay_1A2B3C",
  "orderId": "order_1A2B3C"
}
```

### Complete Payment Order
```http
POST /payments/complete-order
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "razorpay_payment_id": "pay_1A2B3C",
  "shippingAddress": "123 Main St",
  "city": "Mumbai",
  "zipcode": "400001"
}

Response 201:
{
  "message": "Order completed successfully",
  "orderId": "...",
  "paymentStatus": "completed"
}
```

---

## 🔌 Frontend Service Functions

### Import
```javascript
import {
  sendOTP,
  verifyOTPAndLogin,
  googleSignIn,
  register,
  login,
  createPaymentOrder,
  verifyPayment,
  completePaymentOrder,
  openRazorpayPayment,
  logout,
  isLoggedIn
} from '../services/authService.js';
```

### Usage Examples

**Send OTP**
```javascript
try {
  const result = await sendOTP('+919876543210');
  console.log(result.message);
} catch (error) {
  console.error(error.message);
}
```

**Register**
```javascript
const result = await register('John', 'john@email.com', 'pass123', '9876543210');
// Token auto-saved to localStorage
```

**Login**
```javascript
const result = await login('john@email.com', 'pass123');
// Token auto-saved to localStorage
```

**Google Sign-In**
```javascript
const result = await googleSignIn(googleIdToken);
// Token auto-saved to localStorage
```

**Create Payment**
```javascript
const payment = await createPaymentOrder(
  500,          // amount
  '123 Main',   // address
  'Mumbai',     // city
  '400001',     // zipcode
  'Order Desc'  // description
);
console.log(payment.orderId);
```

**Open Razorpay**
```javascript
openRazorpayPayment(
  'order_1A2B3C',      // order ID
  500,                 // amount
  'john@email.com',    // email
  'John Doe'           // name
);
```

**Check if Logged In**
```javascript
if (isLoggedIn()) {
  // User is authenticated
} else {
  // Redirect to login
}
```

**Logout**
```javascript
logout();
// Token removed from localStorage
```

---

## HTTP Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful request |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Access denied |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal error |

---

## Error Response Format

```json
{
  "error": "Human readable error message"
}
```

---

## 🔑 Environment Variables Required

```bash
# Core
PORT=5000
MONGODB_URI=mongodb://...
JWT_SECRET=your_secret_key

# Firebase (OTP & Google Auth)
FIREBASE_PROJECT_ID=...
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...

# Razorpay (Payments)
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
```

---

## 🧪 Test with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123",
    "phone": "9876543210"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

### Get Profile (with token)
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Payment Order
```bash
curl -X POST http://localhost:5000/api/payments/create-order \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 500,
    "shippingAddress": "123 Main St",
    "city": "Mumbai",
    "zipcode": "400001",
    "description": "Order"
  }'
```

---

## 🔐 Token Format

JWT tokens have 3 parts separated by dots:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJ1c2VySWQiOiI2MWFlN2IwMjAwZjQxOTAwMTU4YjM4MjAiLCJlbWFpbCI6IndicatedEmailHere.
signature_hash_here
```

**Expiration:** 7 days

**Verification:** Server-side using JWT_SECRET

---

## 📱 Frontend Integration Minimal Example

```jsx
import React, { useState } from 'react';
import { login, openRazorpayPayment, logout, isLoggedIn } from './services/authService';

function App() {
  const [token, setToken] = useState(isLoggedIn());

  const handleLogin = async () => {
    try {
      const result = await login('user@example.com', 'password123');
      setToken(true);
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  const handlePayment = async () => {
    try {
      const orderResponse = await createPaymentOrder(500, '123 Main', 'Mumbai', '400001');
      openRazorpayPayment(orderResponse.orderId, 500, 'email@example.com', 'John');
    } catch (error) {
      alert('Payment failed: ' + error.message);
    }
  };

  const handleLogout = () => {
    logout();
    setToken(false);
  };

  return (
    <div>
      {!token ? (
        <button onClick={handleLogin}>Login</button>
      ) : (
        <>
          <button onClick={handlePayment}>Pay ₹500</button>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </div>
  );
}

export default App;
```

---

## 🎯 Common Flow: Register → Pay

```javascript
// 1. User registers
const result = await register('John', 'john@email.com', 'pass123', '9876543210');
// Token auto-saved

// 2. User adds items and clicks checkout
const payment = await createPaymentOrder(500, '123 Main', 'Mumbai', '400001');

// 3. Open Razorpay payment
openRazorpayPayment(
  payment.orderId,
  500,
  'john@email.com',
  'John'
);

// 4. User pays and app automatically:
//    - Verifies signature
//    - Completes order
//    - Shows confirmation
```

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Token invalid" | Login again, get new token |
| "Firebase error" | Check FIREBASE_* keys in .env |
| "Razorpay order failed" | Check RAZORPAY_* keys in .env |
| "CORS error" | Ensure backend is running |
| "Connection refused" | Backend not running on port 5000 |

---

## 📚 Related Documentation

- Detailed setup: **AUTH_PAYMENT_SETUP.md**
- Architecture: **AUTH_PAYMENT_INTEGRATION_SUMMARY.md**
- Security: **API_KEY_SECURITY.md**
- Development: **DEVELOPER_GUIDE.md**

---

**Print this page for quick reference! 🔖**
