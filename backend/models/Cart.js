import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: {
    type: String, // Supporting String IDs for Firebase and local fallbacks
    required: true,
  },
  items: [
    {
      productId: {
        type: String,
        required: true,
      },
      name: String,
      price: Number,
      qty: {
        type: Number,
        required: true,
        default: 1,
      },
      image: String,
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('Cart', cartSchema);
