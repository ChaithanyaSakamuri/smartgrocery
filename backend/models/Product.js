import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  // a human-readable unique identifier (separate from Mongo _id)
  id: {
    type: String,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['vegetables', 'fruits', 'dairy', 'bakery', 'snacks', 'beverages', 'dryFruits', 'grains'],
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Innovative feature: Expiry Date
  expiryDate: {
    type: Date,
  },
  // Innovative feature: Nutrition Score
  nutritionInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    healthScore: { type: Number, min: 1, max: 100 }
  },
  // Innovative feature: Group Buying Support
  groupBuyPrice: {
    type: Number,
  },
  minGroupSize: {
    type: Number,
    default: 5
  },
  ratings: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  averageRating: {
    type: Number,
    default: 0
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

// Calculate average rating before save
productSchema.pre('save', function (next) {
  if (this.ratings && this.ratings.length > 0) {
    const sum = this.ratings.reduce((acc, r) => acc + r.rating, 0);
    this.averageRating = sum / this.ratings.length;
  }
  next();
});

export default mongoose.model('Product', productSchema);
