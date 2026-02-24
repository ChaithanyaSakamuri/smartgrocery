# Quick Start Guide

## ⚡ Quick Setup (5 minutes)

### 1. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
npm install
cd ..
```

### 2. Start MongoDB
Make sure MongoDB is running (local or Atlas)

### 3. Configure Backend
Edit `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smartgrocery
JWT_SECRET=dev-secret-key-123
NODE_ENV=development
```

### 4. Seed Database (Optional)
```bash
cd backend
node seedData.js
cd ..
```

### 5. Start Services

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm start
```

### 6. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- MongoDB: localhost:27017

---

## 🧪 Test the Application

1. **Create Account**: Click "Get Started" → "Create New Account"
2. **Browse Products**: Products load from MongoDB
3. **Add to Cart**: Click "Add to Cart" on any product
4. **Checkout**: Enter shipping details and create order
5. **View Orders**: Check order history from account

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Ensure MongoDB is running on port 27017 |
| Backend API not responding | Check if backend is running on port 5000 |
| Can't login | Clear localStorage and try again |
| Port in use | Change PORT in `.env` |

---

## 📚 Full Documentation

For detailed setup and API documentation, see [SETUP.md](./SETUP.md)

---

## 📦 Project Structure

```
smart-grocery/
├── backend/              # Node.js/Express API
│   ├── models/         # MongoDB schemas
│   ├── controllers/    # Route handlers
│   ├── routes/         # API endpoints
│   ├── middleware/     # Auth, etc
│   └── server.js       # Entry point
├── src/                # React frontend
│   ├── components/    # React components
│   └── services/      # API client
└── docker-compose.yml # Docker setup
```

---

## 🎯 Key Features

✅ User Authentication (JWT)  
✅ Product Catalog  
✅ Shopping Cart  
✅ Order Management  
✅ Responsive UI  
✅ Real-time Updates  

---

## 🚀 Deployment

**Backend**: Heroku, Railway, Render  
**Frontend**: Vercel, Netlify  
**Database**: MongoDB Atlas

---

**Ready to code? Start with the quick setup above!**
