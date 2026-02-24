# Smart Grocery Backend API

Backend API for the Smart Grocery application built with Express.js and MongoDB.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create or edit `.env` file:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/smartgrocery
   JWT_SECRET=your_jwt_secret_key_change_in_production
   NODE_ENV=development
   ```

3. **Seed Database** (optional - populate with initial products):
   ```bash
   node seedData.js
   ```

### Running the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (requires auth)
- `PUT /api/users/profile` - Update user profile (requires auth)

### Products
- `GET /api/products` - Get all products (supports `?category=vegetables` and `?search=carrot`)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category
- `POST /api/products` - Add new product (Admin)
- `PUT /api/products/:id/stock` - Update product stock (Admin)

### Cart
- `GET /api/cart` - Get user's cart (requires auth)
- `POST /api/cart/add` - Add item to cart (requires auth)
- `POST /api/cart/remove` - Remove item from cart (requires auth)
- `PUT /api/cart/update` - Update item quantity (requires auth)
- `POST /api/cart/clear` - Clear cart (requires auth)

### Orders
- `POST /api/orders/create` - Create order from cart (requires auth)
- `GET /api/orders` - Get user's orders (requires auth)
- `GET /api/orders/:id` - Get order by ID (requires auth)
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `PUT /api/orders/:id/cancel` - Cancel order (requires auth)

## Request/Response Examples

### Register User
```bash
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210"
}
```

### Login
```bash
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210"
  }
}
```

### Add to Cart
```bash
POST /api/cart/add
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": "v1",
  "name": "Carrot",
  "price": 33,
  "qty": 2,
  "image": "..."
}
```

### Create Order
```bash
POST /api/orders/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "shippingAddress": "123 Main St",
  "city": "New York",
  "zipcode": "10001",
  "paymentMethod": "card"
}
```

## Database Schema

### User
- `name` - User's full name
- `email` - Unique email address
- `phone` - Phone number
- `password` - Hashed password
- `address` - Shipping address
- `city` - City
- `zipcode` - Postal code

### Product
- `id` - Unique product ID
- `name` - Product name
- `price` - Product price
- `image` - Image URL
- `stock` - Available quantity
- `category` - Category (vegetables, fruits, dairy)
- `description` - Product description
- `rating` - Average rating

### Cart
- `userId` - Reference to user
- `items` - Array of cart items
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Order
- `userId` - Reference to user
- `items` - Order items
- `totalAmount` - Total price
- `shippingAddress` - Delivery address
- `city` - City
- `zipcode` - Postal code
- `status` - pending, confirmed, shipped, delivered, cancelled
- `paymentMethod` - Payment method used
- `createdAt` - Order creation timestamp
- `updatedAt` - Last update timestamp

## Authentication

All protected endpoints require an `Authorization` header with a Bearer token:
```
Authorization: Bearer {jwt_token}
```

Tokens are issued on login/register and expire after 7 days.

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

Error responses include an `error` field with details.

## Development Notes

- Use `bcryptjs` for password hashing
- JWT tokens expire in 7 days
- MongoDB indexing is set up for `email` in User model
- CORS is enabled for frontend communication

## Security Considerations

- Change `JWT_SECRET` in production
- Use environment variables for sensitive data
- Implement rate limiting (recommended)
- Use HTTPS in production
- Validate all inputs on the backend
- Implement admin authentication for sensitive operations

## Future Enhancements

- Payment gateway integration (Stripe, Razorpay)
- Email notifications
- Order tracking with real-time updates
- Review and rating system
- Wishlist functionality
- Admin dashboard
- Inventory management
- User notifications

## Support

For issues or questions, please contact the development team.
