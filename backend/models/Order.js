import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: String, // Changed from ObjectId to String to support local/fallback IDs
    required: true,
  },
  items: [
    {
      productId: String,
      vendorId: String,
      name: String,
      price: Number,
      qty: Number,
      image: String,
    }
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    type: String,
    required: true,
  },
  city: String,
  zipcode: String,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'wallet', 'cod'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('Order', orderSchema);
