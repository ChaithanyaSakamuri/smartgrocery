# Authentication & Payment Integration Guide

## ⚠️ SECURITY FIRST

**NEVER SHARE YOUR API KEYS!**
- Store all keys in `.env` file
- Add `.env` to `.gitignore` 
- Use environment variables only
- Rotate keys regularly

---

## 🔐 Firebase Setup (Google Sign-In & OTP)

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name (e.g., "smart-grocery")
4. Accept terms → Create project

### Step 2: Enable Authentication Methods

**In Firebase Console:**
1. Go to **Authentication** → **Sign-in method**
2. Enable:
   - ✅ Google
   - ✅ Phone (for OTP)
   - ✅ Email/Password

### Step 3: Get Service Account Key

1. Go to **Project Settings** ⚙️
2. Click **Service Accounts** tab
3. Click **Generate New Private Key**
4. A JSON file downloads - **KEEP IT SAFE**

Extract these values from JSON:
```
FIREBASE_PROJECT_ID=xxx
FIREBASE_PRIVATE_KEY_ID=xxx
FIREBASE_PRIVATE_KEY=xxx
FIREBASE_CLIENT_EMAIL=xxx
FIREBASE_CLIENT_ID=xxx
FIREBASE_CLIENT_X509_CERT_URL=xxx
FIREBASE_API_KEY=xxx
FIREBASE_AUTH_DOMAIN=xxx
```

### Step 4: Update `.env`
```env
# example values taken from your Firebase screenshot
FIREBASE_PROJECT_ID=smart-grocery-store-f29e8
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n... (keep this secret, don’t paste in git) 
FIREBASE_CLIENT_EMAIL=chaitumuo@gmail.com
FIREBASE_PRIVATE_KEY_ID=<value from JSON>
FIREBASE_CLIENT_ID=<value from JSON>
FIREBASE_CLIENT_X509_CERT_URL=<value from JSON>
FIREBASE_API_KEY=AIzaSyAPCTHlhmOwqCi-YdgiVSG2-WpfZs7jaTU
FIREBASE_AUTH_DOMAIN=smart-grocery-store-f29e8.firebaseapp.com
```

---

## 💳 Razorpay Setup (Payments - India)

### Step 1: Create Razorpay Account
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)

> **Important:** make sure you also include the Razorpay checkout script in your React app. Add the following line to `public/index.html` just after the `<div id="root"></div>`:
>
> ```html
> <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
> ```
> 
> Without this, `window.Razorpay` will be undefined and the frontend will immediately throw an error when attempting payment ("There was an error processing your payment").
2. Sign up with email
3. Verify email

### Step 2: Get API Keys

1. Go to **Settings** → **API Keys**
2. Copy **Key ID** (public)
3. Copy **Key Secret** (confidential - keep safe!)

### Step 3: Update `.env`
```env
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxx

> **Backend:** ensure these values are present in your server environment (e.g. a `.env` file or your process manager). If they are missing or invalid, order creation will fail and the frontend will display an error message. Check backend logs for details.
```

### Step 4: Test Mode vs Live Mode
- **Test Mode**: Use test cards (Razorpay provides test cards)
- **Live Mode**: Real payments (requires bank verification)

**Test Card:**
```
Card Number: 4111 1111 1111 1111
Expiry: Any future date
CVV: Any 3 digits
```

---

## 🌍 Stripe Setup (International Payments)

### Step 1: Create Stripe Account
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Sign up with email
3. Verify business details

### Step 2: Get API Keys

1. Go to **Developers** → **API Keys**
2. Copy **Publishable Key** (safe to expose to frontend)
3. Copy **Secret Key** (KEEP PRIVATE!)

### Step 3: Update `.env`
```env
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLIC_KEY=pk_test_xxxxx
```

### Step 4: Test Payment
**Test Card:**
```
Card: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
```

---

## 📱 Frontend Integration

### Google Sign-In Button
```html
<!-- In public/index.html or component -->
<script src="https://accounts.google.com/gsi/client" async defer></script>

<div id="g_id_onload"
     data-client_id="YOUR_GOOGLE_CLIENT_ID"
     data-callback="handleCredentialResponse">
</div>
<div class="g_id_signin" data-type="standard"></div>
```

**Send token to backend:**
```javascript
// When user signs in
const response = { credential: idToken };
fetch('/api/auth/google-signin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ idToken })
});
```

### OTP Verification (Firebase)
```javascript
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const auth = getAuth();
new RecaptchaVerifier('sign-in-button', {}, auth);

signInWithPhoneNumber(auth, phoneNumber, appVerifier)
  .then(confirmationResult => {
    // OTP sent, ask user to enter it
    const code = prompt('Enter OTP');
    confirmationResult.confirm(code)
      .then(result => {
        const idToken = result.user.getIdToken();
        // Send to backend
      });
  });
```

### Payment with Razorpay
```javascript
const options = {
  key: process.env.REACT_APP_RAZORPAY_KEY_ID,
  amount: totalAmount * 100,
  currency: "INR",
  name: "Smart Grocery",
  order_id: razorpayOrderId,
  handler: function(response) {
    // Verify payment on backend
    fetch('/api/payments/verify', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature
      })
    });
  }
};

const rzp = new window.Razorpay(options);
rzp.open();
```

---

## 🔌 Backend API Endpoints

### Authentication Routes
```
POST   /api/auth/send-otp              Send OTP to phone
POST   /api/auth/verify-otp            Verify OTP & Login
POST   /api/auth/google-signin         Google Sign-In
POST   /api/auth/register              Email/Password Register
POST   /api/auth/login                 Email/Password Login
GET    /api/auth/profile               Get Profile (auth required)
PUT    /api/auth/profile               Update Profile (auth required)
```

### Payment Routes
```
POST   /api/payments/create-order      Create Razorpay Order
POST   /api/payments/verify            Verify Payment
POST   /api/payments/complete-order    Complete Order After Payment
```

---

## 📦 Install Dependencies

```bash
cd backend
npm install firebase-admin razorpay
```

---

## 🧪 Testing

### Test Firebase Auth
```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+919876543210"}'
```

### Test Create Payment Order
```bash
curl -X POST http://localhost:5000/api/payments/create-order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "amount": 500,
    "shippingAddress": "123 Main St",
    "city": "Mumbai",
    "zipcode": "400001",
    "description": "Grocery Order"
  }'
```

### Test Payment Verification
```bash
curl -X POST http://localhost:5000/api/payments/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "razorpay_order_id": "order_xyz",
    "razorpay_payment_id": "pay_xyz",
    "razorpay_signature": "sig_xyz"
  }'
```

---

## 🔄 Complete Flow

### Google Sign-In Flow
```
User clicks "Sign in with Google"
    ↓
Google OAuth window opens
    ↓
User authorizes app
    ↓
Google returns ID token
    ↓
Send token to /api/auth/google-signin
    ↓
Backend verifies with Firebase
    ↓
Create/find user in database
    ↓
Generate JWT token
    ↓
Frontend stores JWT in localStorage
    ↓
User logged in ✅
```

### OTP Flow
```
User enters phone number
    ↓
Click "Send OTP"
    ↓
Firebase sends SMS with OTP
    ↓
User enters OTP
    ↓
Firebase verifies OTP client-side
    ↓
Get ID token from Firebase
    ↓
Send to /api/auth/verify-otp
    ↓
Backend creates JWT
    ↓
User logged in ✅
```

### Payment Flow
```
User adds items to cart
    ↓
Click "Checkout"
    ↓
Send cart amount to /api/payments/create-order
    ↓
Backend creates Razorpay order
    ↓
Frontend opens Razorpay payment form
    ↓
User enters payment details
    ↓
Razorpay processes payment
    ↓
Send payment ID to /api/payments/verify
    ↓
Backend verifies signature
    ↓
Payment confirmed ✅
    ↓
Create order in database
    ↓
Clear cart
    ↓
Show order confirmation
```

---

## 🚨 Error Handling

### Common Errors

**Firebase: "Invalid ID Token"**
- Token expired
- Wrong secret key
- Token not from Firebase

**Solution:**
```javascript
try {
  const decodedToken = await admin.auth().verifyIdToken(idToken);
} catch (error) {
  if (error.code === 'auth/id-token-expired') {
    return res.status(401).json({ error: 'Token expired, please login again' });
  }
}
```

**Razorpay: "Invalid Signature"**
- Order ID/Payment ID mismatch
- Wrong secret key
- Signature tampering

**Solution:**
```javascript
const expectedSignature = crypto
  .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
  .update(body.toString())
  .digest('hex');

if (expectedSignature !== razorpay_signature) {
  return res.status(400).json({ error: 'Payment verification failed' });
}
```

---

## 📊 Environment Variables Checklist

- [ ] `MONGODB_URI` - MongoDB connection
- [ ] `JWT_SECRET` - JWT signing secret
- [ ] `FIREBASE_PROJECT_ID` - Firebase project ID
- [ ] `FIREBASE_PRIVATE_KEY` - Firebase private key
- [ ] `FIREBASE_CLIENT_EMAIL` - Firebase service account email
- [ ] `RAZORPAY_KEY_ID` - Razorpay public key
- [ ] `RAZORPAY_KEY_SECRET` - Razorpay secret key
- [ ] `STRIPE_SECRET_KEY` - Stripe secret (if using Stripe)
- [ ] `STRIPE_PUBLIC_KEY` - Stripe public (if using Stripe)

---

## 🔐 Security Best Practices

✅ Never commit `.env` file  
✅ Rotate keys regularly  
✅ Use environment variables for all secrets  
✅ Verify all tokens server-side  
✅ Implement rate limiting  
✅ Log payment events  
✅ Use HTTPS in production  
✅ Enable CORS properly  
✅ Validate user permissions  

---

## 📚 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Razorpay Integration Guide](https://razorpay.com/docs/api/)
- [Stripe Documentation](https://stripe.com/docs/api)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Firebase Phone Auth](https://firebase.google.com/docs/auth/web/phone-auth)

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Firebase connection error | Check credentials in .env |
| Razorpay order creation fails | Verify API keys and amount format |
| Google Sign-In button not showing | Check script tag and client ID |
| OTP not sending | Enable Phone Auth in Firebase |
| Payment verification fails | Check signature generation |

---

**Setup complete! Your app now has:**
- ✅ Google Sign-In
- ✅ OTP Authentication  
- ✅ Email/Password Login
- ✅ Razorpay Payments
- ✅ Secure token handling
- ✅ Complete error handling

**Happy building! 🚀**
