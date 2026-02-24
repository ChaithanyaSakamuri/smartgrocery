# Backend Development Guide

## Quick Reference

### Project Architecture

```
MVC Pattern (Model-View-Controller)
├── Models       → Database schemas (User, Product, Cart, Order)
├── Controllers  → Business logic (API handlers)
├── Routes       → API endpoints
└── Middleware   → Authentication & request processing
```

---

## File Organization

### Models (`backend/models/`)
Each model represents a database collection:
- `User.js` - User accounts and authentication
- `Product.js` - Product catalog
- `Cart.js` - Shopping carts
- `Order.js` - Customer orders

### Controllers (`backend/controllers/`)
- `userController.js` - User operations (register, login, profile)
- `productController.js` - Product operations (list, search, add)
- `cartController.js` - Cart operations (add, remove, update)
- `orderController.js` - Order operations (create, track, cancel)

### Routes (`backend/routes/`)
- `userRoutes.js` - Maps `/api/users` endpoints
- `productRoutes.js` - Maps `/api/products` endpoints
- `cartRoutes.js` - Maps `/api/cart` endpoints
- `orderRoutes.js` - Maps `/api/orders` endpoints

---

## Common Workflows

### 1. Adding a New Feature

**Step 1: Create Model** (`models/Feature.js`)
```javascript
import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema({
  name: String,
  // ... fields
});

export default mongoose.model('Feature', featureSchema);
```

**Step 2: Create Controller** (`controllers/featureController.js`)
```javascript
import Feature from '../models/Feature.js';

export const getFeatures = async (req, res) => {
  try {
    const features = await Feature.find();
    res.json(features);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

**Step 3: Create Routes** (`routes/featureRoutes.js`)
```javascript
import express from 'express';
import { getFeatures } from '../controllers/featureController.js';

const router = express.Router();
router.get('/', getFeatures);

export default router;
```

**Step 4: Register Routes** (in `server.js`)
```javascript
import featureRoutes from './routes/featureRoutes.js';
app.use('/api/features', featureRoutes);
```

---

### 2. Adding Authentication to an Endpoint

```javascript
import { authenticateToken } from '../middleware/auth.js';

// Protected route
router.get('/profile', authenticateToken, getProfile);
```

---

### 3. Error Handling Pattern

```javascript
try {
  const data = await Model.findById(id);
  if (!data) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.json(data);
} catch (error) {
  res.status(500).json({ error: error.message });
}
```

---

## Environment Variables

```bash
# .env file
PORT=5000                                          # Server port
MONGODB_URI=mongodb://localhost:27017/smartgrocery # Database
JWT_SECRET=your-secret-key                        # JWT secret
NODE_ENV=development                              # Environment
```

---

## Common Commands

```bash
# Install dependencies
npm install

# Development mode (auto-reload)
npm run dev

# Production mode
npm start

# Seed database
node seedData.js

# Run with Docker
docker-compose up -d
```

---

## Database Queries

### User Model
```javascript
// Find user by email
const user = await User.findOne({ email: 'user@example.com' });

// Create new user
const newUser = await User.create({ name, email, password });

// Update user
const updated = await User.findByIdAndUpdate(id, { name }, { new: true });

// Delete user
await User.findByIdAndDelete(id);
```

### Product Model
```javascript
// Get all products
const products = await Product.find();

// Filter by category
const veggies = await Product.find({ category: 'vegetables' });

// Search by name
const results = await Product.find({
  name: { $regex: 'carrot', $options: 'i' }
});

// Update stock
await Product.updateOne(
  { id: 'v1' },
  { stock: 50 }
);
```

---

## API Response Format

### Success Response
```javascript
res.json({
  message: 'Operation successful',
  data: { /* ... */ }
});
```

### Error Response
```javascript
res.status(400).json({
  error: 'Error message here'
});
```

### Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## Authentication Flow

```
1. User registers/logs in
   ↓
2. Backend generates JWT token
   ↓
3. Frontend stores token in localStorage
   ↓
4. Frontend sends token in Authorization header
   ↓
5. Backend middleware verifies token
   ↓
6. Request proceeds or rejected
```

---

## Password Hashing

Automatically handled by Mongoose `pre('save')` hook:
```javascript
// In User model
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Verify password
const isValid = await user.matchPassword(enteredPassword);
```

---

## Debugging Tips

### View Logs
```bash
# Development mode shows all logs
npm run dev
```

### MongoDB Shell
```bash
mongo smartgrocery
db.users.find()
db.products.find().limit(5)
```

### API Testing
```bash
# Using cURL
curl http://localhost:5000/api/products

# Using Postman
# Set headers: Content-Type: application/json
# Add Authorization: Bearer {token}
```

---

## Performance Tips

1. **Use indexes** for frequently searched fields
2. **Implement pagination** for large datasets
3. **Cache responses** for static data
4. **Use async/await** instead of callbacks
5. **Validate inputs** on backend
6. **Limit API responses** with pagination

---

## Security Checklist

- [x] Passwords hashed with bcrypt
- [x] JWT for authentication
- [x] CORS enabled
- [x] Environment variables for secrets
- [x] Input validation
- [x] Protected routes
- [x] Error handling (no internal details exposed)

---

## Deployment Checklist

Before deploying:
1. Update `JWT_SECRET` with strong value
2. Set `NODE_ENV=production`
3. Use MongoDB Atlas or secure MongoDB instance
4. Enable HTTPS
5. Set proper CORS origins
6. Test all endpoints
7. Set up monitoring/logging
8. Create database backups

---

## Useful Resources

- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [REST API Best Practices](https://restfulapi.net/)

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't connect to MongoDB | Check connection string, ensure MongoDB is running |
| JWT errors | Verify token format, check JWT_SECRET |
| Port already in use | Change PORT in .env |
| Dependency errors | Run `npm install` |
| Database errors | Check MongoDB connection, verify schemas |

---

## Adding Tests

```javascript
// Example: tests/user.test.js
import request from 'supertest';
import app from '../server.js';

describe('User API', () => {
  test('POST /api/users/register', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Test',
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.token).toBeDefined();
  });
});
```

---

## Future Improvements

- [ ] Add input validation with Joi/Yup
- [ ] Implement caching (Redis)
- [ ] Add logging (Winston/Morgan)
- [ ] API rate limiting
- [ ] GraphQL instead of REST
- [ ] Real-time features (WebSockets)
- [ ] Unit & integration tests
- [ ] API versioning
- [ ] Swagger documentation

---

**Happy coding! Refer to this guide for quick reference. 🚀**
