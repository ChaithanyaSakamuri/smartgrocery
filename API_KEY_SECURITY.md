# 🔐 SECURE API KEY MANAGEMENT - CRITICAL INFORMATION

## ⚠️ YOUR API KEY WAS EXPOSED!

The API key you shared in the chat:
```
AIzaSyDLjPGS4GxQW-k0XU_PqKcS-ixyuF416kk
```

**ACTION REQUIRED NOW:**
1. ✅ **IMMEDIATELY** go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. ✅ Find and **DELETE** this API key
3. ✅ **Generate a NEW API key**
4. ✅ Never share API keys in chats again

---

## 📋 Environment Variables Template

Create `.env` in `backend/` folder with these variables:

```bash
# ============================================
# CORE CONFIGURATION
# ============================================
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/smartgrocery

# JWT Secret - Use a STRONG random string
# Generate: openssl rand -hex 32
JWT_SECRET=your_super_secret_jwt_key_with_random_characters_12345

# ============================================
# FIREBASE (for OTP & Google Sign-In)
# Download service account JSON from Firebase Console
# ============================================
FIREBASE_PROJECT_ID=smart-grocery-store-f29e8
FIREBASE_PRIVATE_KEY_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=chaitumuo@gmail.com
FIREBASE_CLIENT_ID=
FIREBASE_CLIENT_X509_CERT_URL=
FIREBASE_API_KEY=AIzaSyAPCTHlhmOwqCi-YdgiVSG2-WpfZs7jaTU
FIREBASE_AUTH_DOMAIN=smart-grocery-store-f29e8.firebaseapp.com

# ============================================
# RAZORPAY (for Payments - India)
# Get from: https://dashboard.razorpay.com/
# ============================================
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ============================================
# STRIPE (for International Payments - Optional)
# Get from: https://dashboard.stripe.com/
# ============================================
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx

# ============================================
# SMS/OTP PROVIDER (Optional - Twilio)
# Get from: https://www.twilio.com/
# ============================================
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890
```

**Copy above template to `backend/.env`**

---

## 🔑 How to Get Each Key

### 1. Firebase Setup
```
Where: https://console.firebase.google.com/
Steps:
  1. Create new project
  2. Go to Project Settings ⚙️
  3. Service Accounts tab
  4. Generate New Private Key
  5. Copy values from downloaded JSON
```

### 2. Razorpay Setup
```
Where: https://dashboard.razorpay.com/
Steps:
  1. Sign up with email
  2. Go to Settings → API Keys
  3. Copy Key ID and Key Secret
  4. Paste into .env
```

### 3. Stripe Setup
```
Where: https://dashboard.stripe.com/
Steps:
  1. Sign up
  2. Go to Developers → API Keys
  3. Copy Publishable Key and Secret Key
  4. Paste into .env
```

### 4. JWT Secret
```
Generate random string:
openssl rand -hex 32
OR
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## ✅ Security Rules

### ✅ DO:
- ✅ Store `.env` locally only
- ✅ Add `.env` to `.gitignore`
- ✅ Use different keys for dev/production
- ✅ Rotate keys every 3 months
- ✅ Use environment variables in code
- ✅ Keep Firebase JSON file secure
- ✅ Log security events
- ✅ Review API usage regularly

### ❌ DON'T:
- ❌ Never share API keys in chat/email
- ❌ Never commit `.env` to git
- ❌ Never hardcode keys in files
- ❌ Never share screenshots with keys
- ❌ Never use same key for dev/prod
- ❌ Never disable authentication
- ❌ Never log sensitive data
- ❌ Never ignore security warnings

---

## 🔄 How Keys Are Used in Code

### Firebase
```javascript
// In backend/config/firebase.js
// Keys are read from .env automatically
const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY,
  // ...
};
```

### Razorpay
```javascript
// In backend/controllers/paymentController.js
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
```

### Frontend
```javascript
// In .env (frontend)
REACT_APP_RAZORPAY_KEY_ID=your_public_key

// In src/services/authService.js
key: process.env.REACT_APP_RAZORPAY_KEY_ID
```

---

## 🆘 If API Key is Compromised

**Immediate Actions:**
1. Delete the compromised key immediately
2. Generate new key
3. Update in `.env`
4. Restart backend
5. Check activity logs for unauthorized access
6. Rotate all related credentials
7. Notify team members
8. Document incident

---

## 🧪 Verify Keys Work

### Test Firebase
```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+919876543210"}'
```

### Test Razorpay
```bash
curl -X POST http://localhost:5000/api/payments/create-order \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount": 500, "shippingAddress": "Test", "city": "Mumbai", "zipcode": "400001"}'
```

---

## 📝 .gitignore Check

Make sure `backend/.gitignore` contains:
```
node_modules/
.env
.env.local
.env.*.local
```

Verify:
```bash
git check-ignore -v backend/.env
# Should show: backend/.env    .gitignore
```

---

## 🔐 Production Checklist

Before deploying to production:

- [ ] All keys are different from development
- [ ] `.env` is NOT in git repository
- [ ] HTTPS is enabled
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Logging is set up
- [ ] Backups are configured
- [ ] Monitoring is enabled
- [ ] Team knows where keys are stored
- [ ] Key rotation schedule is set

---

## 🚨 Common Mistakes

### ❌ WRONG:
```javascript
const API_KEY = "AIzaSyDLjPGS4GxQW-k0XU_PqKcS-ixyuF416kk"; // EXPOSED!
```

### ✅ CORRECT:
```javascript
const API_KEY = process.env.FIREBASE_API_KEY; // Safe!
```

### ❌ WRONG:
```git
git add -A
git commit -m "Added .env file"
```

### ✅ CORRECT:
```git
echo "backend/.env" >> .gitignore
git add .gitignore backend/.env.example
git commit -m "Added env template"
```

---

## 📞 If You Have Questions

1. Check [Firebase Docs](https://firebase.google.com/docs)
2. Check [Razorpay Docs](https://razorpay.com/docs)
3. Review AUTH_PAYMENT_SETUP.md
4. Check backend logs: `npm run dev`

---

**Remember: API keys are like passwords. Treat them with respect! 🔒**

**Your exposed key should be revoked immediately if you created it recently.**
