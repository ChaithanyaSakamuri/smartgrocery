# Smart Grocery - REST API Examples

## Base URL
```
http://localhost:5000/api
```

---

## Authentication Endpoints

### 1. Register User
```
POST /users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "phone": "9876543210"
}

Response: 200 OK
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 2. Login User
```
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}

Response: 200 OK
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210"
  }
}
```

### 3. Get User Profile
```
GET /users/profile
Authorization: Bearer {token}

Response: 200 OK
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "123 Main St",
  "city": "New York",
  "zipcode": "10001",
  "createdAt": "2024-01-01T10:00:00Z"
}
```

### 4. Update User Profile
```
PUT /users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Jane Doe",
  "phone": "9876543210",
  "address": "456 Oak Ave",
  "city": "Chicago",
  "zipcode": "60601"
}

Response: 200 OK
{
  "message": "Profile updated",
  "user": { ... }
}
```

---

## Product Endpoints

### 1. Get All Products
```
GET /products

Response: 200 OK
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "id": "v1",
    "name": "Carrot",
    "price": 33,
    "image": "url",
    "stock": 45,
    "category": "vegetables",
    "rating": 4.5
  },
  ...
]
```

### 2. Get Products with Filters
```
GET /products?category=vegetables

GET /products?search=carrot

GET /products?category=fruits&search=apple

Response: 200 OK
[...]
```

### 3. Get Product by ID
```
GET /products/v1

Response: 200 OK
{
  "_id": "507f1f77bcf86cd799439011",
  "id": "v1",
  "name": "Carrot",
  "price": 33,
  "image": "url",
  "stock": 45,
  "category": "vegetables"
}
```

### 4. Get Products by Category
```
GET /products/category/vegetables

GET /products/category/fruits

GET /products/category/dairy

Response: 200 OK
[
  { ... },
  { ... }
]
```

### 5. Add Product (Admin)
```
POST /products
Content-Type: application/json

{
  "id": "new_product_1",
  "name": "Organic Tomato",
  "price": 50,
  "image": "url",
  "stock": 100,
  "category": "vegetables",
  "description": "Fresh organic tomatoes"
}

Response: 201 Created
{
  "message": "Product added",
  "product": { ... }
}
```

### 6. Update Product Stock
```
PUT /products/v1/stock
Content-Type: application/json

{
  "stock": 25
}

Response: 200 OK
{
  "message": "Stock updated",
  "product": { ... }
}
```

---

## Cart Endpoints

### 1. Get Cart
```
GET /cart
Authorization: Bearer {token}

Response: 200 OK
{
  "_id": "507f1f77bcf86cd799439011",
  "userId": "507f1f77bcf86cd799439012",
  "items": [
    {
      "productId": "v1",
      "name": "Carrot",
      "price": 33,
      "qty": 2,
      "image": "url"
    }
  ],
  "createdAt": "2024-01-01T10:00:00Z"
}
```

### 2. Add to Cart
```
POST /cart/add
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": "v1",
  "name": "Carrot",
  "price": 33,
  "qty": 2,
  "image": "url"
}

Response: 200 OK
{
  "message": "Added to cart",
  "cart": { ... }
}
```

### 3. Remove from Cart
```
POST /cart/remove
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": "v1"
}

Response: 200 OK
{
  "message": "Removed from cart",
  "cart": { ... }
}
```

### 4. Update Cart Item Quantity
```
PUT /cart/update
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": "v1",
  "qty": 5
}

Response: 200 OK
{
  "message": "Cart updated",
  "cart": { ... }
}
```

### 5. Clear Cart
```
POST /cart/clear
Authorization: Bearer {token}

Response: 200 OK
{
  "message": "Cart cleared",
  "cart": {
    "items": []
  }
}
```

---

## Order Endpoints

### 1. Create Order
```
POST /orders/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "shippingAddress": "123 Main St",
  "city": "New York",
  "zipcode": "10001",
  "paymentMethod": "card"
}

Response: 201 Created
{
  "message": "Order created",
  "order": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "items": [...],
    "totalAmount": 150,
    "status": "pending",
    "createdAt": "2024-01-01T10:00:00Z"
  }
}
```

### 2. Get User Orders
```
GET /orders
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "items": [...],
    "totalAmount": 150,
    "status": "pending",
    "createdAt": "2024-01-01T10:00:00Z"
  },
  ...
]
```

### 3. Get Order by ID
```
GET /orders/507f1f77bcf86cd799439011
Authorization: Bearer {token}

Response: 200 OK
{
  "_id": "507f1f77bcf86cd799439011",
  "userId": "507f1f77bcf86cd799439012",
  "items": [...],
  "totalAmount": 150,
  "shippingAddress": "123 Main St",
  "status": "pending",
  "createdAt": "2024-01-01T10:00:00Z"
}
```

### 4. Update Order Status (Admin)
```
PUT /orders/507f1f77bcf86cd799439011/status
Content-Type: application/json

{
  "status": "shipped"
}

Response: 200 OK
{
  "message": "Order status updated",
  "order": { ... }
}
```

### 5. Cancel Order
```
PUT /orders/507f1f77bcf86cd799439011/cancel
Authorization: Bearer {token}

Response: 200 OK
{
  "message": "Order cancelled",
  "order": {
    "status": "cancelled",
    ...
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Name, email, and password required"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid email or password"
}
```

### 403 Forbidden
```json
{
  "error": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "error": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Something went wrong!"
}
```

---

## Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/users/register \
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
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

### Get Products
```bash
curl http://localhost:5000/api/products
```

### Add to Cart (with token)
```bash
curl -X POST http://localhost:5000/api/cart/add \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "v1",
    "name": "Carrot",
    "price": 33,
    "qty": 2,
    "image": "url"
  }'
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid credentials |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal error |

---

## Notes

- All timestamp responses are in ISO 8601 format
- JWT tokens expire after 7 days
- Product IDs in requests are strings (e.g., "v1", "f1", "d1")
- Order status values: pending, confirmed, shipped, delivered, cancelled
- Categories: vegetables, fruits, dairy
- Payment methods: card, upi, netbanking, wallet
