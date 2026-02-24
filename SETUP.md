# Smart Grocery - Complete Setup Guide

This is a full-stack e-commerce application for grocery shopping with a React frontend and Node.js/Express backend.

## Project Structure

```
smart-grocery/
├── src/                          # Frontend React app
│   ├── components/               # React components
│   ├── services/
│   │   └── api.js               # API service for backend communication
│   ├── App.js                   # Main App component
│   └── index.js
├── public/                       # Static files
├── backend/                      # Node.js/Express backend
│   ├── models/                  # Mongoose schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── controllers/             # Route controllers
│   ├── routes/                  # API routes
│   ├── middleware/              # Auth middleware
│   ├── server.js                # Entry point
│   ├── seedData.js              # Database seeding script
│   └── package.json
├── package.json                 # Frontend dependencies
├── docker-compose.yml           # Docker compose for backend + MongoDB
└── README.md
```

## Prerequisites

- Node.js v14+ and npm
- MongoDB (local installation or MongoDB Atlas)
- Docker & Docker Compose (optional, for containerized setup)
- Git

## Installation & Setup

### Option 1: Local Setup (Without Docker)

#### Step 1: Install Frontend Dependencies
```bash
cd smart-grocery
npm install
```

#### Step 2: Install MongoDB
**Windows/Mac:**
- Download from https://www.mongodb.com/try/download/community
- Follow installation instructions
- MongoDB will run on `localhost:27017`

**Using MongoDB Atlas (Cloud):**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `.env` in backend folder

#### Step 3: Setup Backend

```bash
cd backend
npm install
```

#### Step 4: Configure Environment Variables

Create `.env` file in the `backend/` folder:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smartgrocery
JWT_SECRET=your_super_secret_jwt_key_12345
NODE_ENV=development
```

#### Step 5: Seed Database (Optional)
Populate MongoDB with sample products:
```bash
cd backend
node seedData.js
```

#### Step 6: Start Backend Server
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

#### Step 7: Start Frontend (in another terminal)
```bash
cd smart-grocery
npm start
```
Frontend will run on `http://localhost:3000`

---

### Option 2: Docker Setup (Recommended for Production)

#### Step 1: Install Docker
- Download from https://www.docker.com/products/docker-desktop
- Install and start Docker Desktop

#### Step 2: Build and Run with Docker Compose
```bash
cd smart-grocery
docker-compose up -d
```

This will:
- Start MongoDB container
- Build and start backend container
- Backend available at `http://localhost:5000`

#### Step 3: Start Frontend
```bash
npm install
npm start
```

---

## Features Implemented

### Frontend (React)
- ✅ User Authentication (Login/Register)
- ✅ Product Browsing
- ✅ Product Categories (Vegetables, Fruits, Dairy)
- ✅ Shopping Cart
- ✅ Quantity Management
- ✅ Responsive Design with animations
- ✅ User Profile

### Backend (Node.js/Express)
- ✅ User authentication with JWT
- ✅ Password hashing with bcryptjs
- ✅ Product management API
- ✅ Cart management
- ✅ Order management
- ✅ MongoDB integration
- ✅ Error handling
- ✅ CORS enabled

---

## API Documentation

### Base URL
`http://localhost:5000/api`

### Authentication
Most endpoints require JWT token in Authorization header:
```
Authorization: Bearer {token}
```

### User Endpoints

**Register**
```
POST /users/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210"
}
```

**Login**
```
POST /users/login
{
  "email": "john@example.com",
  "password": "password123"
}
Response: { token, user }
```

**Get Profile**
```
GET /users/profile
Authorization: Bearer {token}
```

**Update Profile**
```
PUT /users/profile
Authorization: Bearer {token}
{
  "name": "Jane Doe",
  "phone": "9876543210",
  "address": "123 Main St",
  "city": "New York",
  "zipcode": "10001"
}
```

### Product Endpoints

**Get All Products**
```
GET /products
GET /products?category=vegetables
GET /products?search=carrot
```

**Get Product by ID**
```
GET /products/{id}
```

**Get Products by Category**
```
GET /products/category/vegetables
```

### Cart Endpoints

**Get Cart**
```
GET /cart
Authorization: Bearer {token}
```

**Add to Cart**
```
POST /cart/add
Authorization: Bearer {token}
{
  "productId": "v1",
  "name": "Carrot",
  "price": 33,
  "qty": 2,
  "image": "url"
}
```

**Remove from Cart**
```
POST /cart/remove
Authorization: Bearer {token}
{ "productId": "v1" }
```

**Update Item Quantity**
```
PUT /cart/update
Authorization: Bearer {token}
{ "productId": "v1", "qty": 5 }
```

**Clear Cart**
```
POST /cart/clear
Authorization: Bearer {token}
```

### Order Endpoints

**Create Order**
```
POST /orders/create
Authorization: Bearer {token}
{
  "shippingAddress": "123 Main St",
  "city": "New York",
  "zipcode": "10001",
  "paymentMethod": "card"
}
```

**Get User Orders**
```
GET /orders
Authorization: Bearer {token}
```

**Get Order by ID**
```
GET /orders/{id}
Authorization: Bearer {token}
```

**Cancel Order**
```
PUT /orders/{id}/cancel
Authorization: Bearer {token}
```

---

## Database Schema

### User
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  address: String,
  city: String,
  zipcode: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Product
```javascript
{
  id: String (unique; auto-generated if not supplied),
  name: String,
  price: Number,
  image: String,
  stock: Number,
  category: String (vegetables/fruits/dairy),
  description: String,
  rating: Number,
  createdAt: Date
}
```
> **Tip**: If you previously inserted documents or ran earlier versions of the app,
> MongoDB may still have a unique index on `id` that allows only a single `null`
> value. To avoid `E11000 duplicate key { id: null }` errors when adding products,
> either drop that index in the mongo shell:
>
> ```js
> db.products.dropIndex('id_1')
> ```
>
> or restart the server after adding the auto-generated `id` field above; new
> documents will then receive a non‑null `id` automatically.

### Cart
```javascript
{
  userId: ObjectId (ref: User),
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      qty: Number,
      image: String
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Order
```javascript
{
  userId: ObjectId (ref: User),
  items: Array,
  totalAmount: Number,
  shippingAddress: String,
  city: String,
  zipcode: String,
  status: String (pending/confirmed/shipped/delivered/cancelled),
  paymentMethod: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smartgrocery
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### Frontend (.env) - Optional
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Common Issues & Solutions

### Issue: MongoDB Connection Error
**Solution:** 
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify MongoDB port (default: 27017)

### Issue: Backend request fails from frontend
**Solution:**
- Ensure backend is running on port 5000
- Check proxy setting in package.json
- Clear browser cache and restart dev server

### Issue: Port already in use
**Solution:**
```bash
# Find process using port 5000
lsof -i :5000
# Kill process
kill -9 <PID>
```

### Issue: JWT token invalid
**Solution:**
- Tokens expire after 7 days
- Clear localStorage and login again
- Verify JWT_SECRET matches between frontend and backend

---

## Testing the Application

1. **Register a new user**
   - Click "Get Started"
   - Create New Account
   - Enter details

2. **Browse Products**
   - Products load from MongoDB
   - Filter by category
   - Search functionality

3. **Add to Cart**
   - Click "Add to Cart"
   - View cart from button
   - Modify quantities

4. **Checkout**
   - Click Checkout
   - (frontend) make sure you have added `REACT_APP_RAZORPAY_KEY_ID` to your `.env` file with your Razorpay key. Without it, the payment popup will not load.
   - Enter shipping details
   - Complete order

5. **View Orders**
   - Logged-in users can view past orders
   - Check order status

---

## Deployment

### Deploy Backend to Heroku
```bash
cd backend
heroku create smart-grocery-backend
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

### Deploy Frontend to Vercel
```bash
cd smart-grocery
npm install -g vercel
vercel
```

Update frontend API URL in `.env`:
```
REACT_APP_API_URL=https://your-backend.herokuapp.com/api
```

---

## Development Workflow

1. **Start MongoDB** (if local):
   ```bash
   mongod
   ```

2. **Start Backend**:
   ```bash
   cd backend
   npm run dev
   ```

3. **Start Frontend**:
   ```bash
   npm start
   ```

4. **Make Changes**: Both frontend and backend auto-reload on changes

---

## Technologies Used

**Frontend:**
- React 19.2
- React Router DOM 7.13
- Framer Motion (animations)
- Lucide React (icons)
- Fetch API for HTTP calls

**Backend:**
- Express.js 4.18
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled
- Nodemon for development

**Database:**
- MongoDB (NoSQL)
- Cloud: MongoDB Atlas

---

## Security Best Practices

1. **Change JWT_SECRET** in production
2. **Use HTTPS** in production
3. **Validate all inputs** on backend
4. **Implement rate limiting**
5. **Hash passwords** (already implemented)
6. **Use environment variables** for sensitive data
7. **CORS enabled** only for trusted origins

---

## Future Enhancements

- [ ] Payment gateway integration (Stripe/Razorpay)
- [ ] Email notifications
- [ ] Real-time order tracking
- [ ] Product reviews and ratings
- [ ] Wishlist feature
- [ ] Admin dashboard
- [ ] Inventory management
- [ ] Push notifications
- [ ] Mobile app

---

## Support & Debugging

Check backend logs:
```bash
cd backend
npm run dev
```

Check frontend console:
- Open Developer Tools (F12)
- Check Console and Network tabs

Check MongoDB:
```bash
mongo
use smartgrocery
db.users.find()
db.products.find()
```

---

## License

This project is open-source and available under MIT License.

---

**Happy Coding! 🚀**
