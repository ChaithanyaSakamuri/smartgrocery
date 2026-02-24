import mongoose from 'mongoose';
import Product from '../models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Add or update products without removing existing ones
    // using upsert ensures only new or changed items are saved
    const products = [
      // Vegetables
      { id: 'v1', name: 'Amaranth Leaves', price: 23, image: 'https://specialtyproduce.com/sppics/12831.png?w=600', stock: 30, category: 'vegetables' },
      { id: 'v2', name: 'Ash Gourd', price: 26, image: 'https://mandai.in/admin/assets/admin/images/mandai_online/product/Ashgourd_b.jpg?w=600', stock: 20, category: 'vegetables' },
      { id: 'v3', name: 'Bitter Gourd', price: 63, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqxMVnVCNiKbuXMceQcAxYpty2YYQcqzufeQ&s?w=600', stock: 20, category: 'vegetables' },
      { id: 'v4', name: 'Bottle Gourd', price: 47, image: 'https://mandai.in/admin/assets/admin/images/mandai_online/product/bottle_gourd_3.jpg?w=600', stock: 25, category: 'vegetables' },
      { id: 'v5', name: 'Brinjal', price: 45, image: 'https://malafarms.com/wp-content/uploads/2024/01/Frame-36-630x630.png?w=600', stock: 30, category: 'vegetables' },
      { id: 'v6', name: 'Cabbage', price: 38, image: 'https://organicmandya.com/cdn/shop/files/Cabbage.jpg?v=1757077973&width=1000?w=600', stock: 35, category: 'vegetables' },
      { id: 'v7', name: 'Capsicum', price: 72, image: 'https://images.unsplash.com/photo-1563114773-84221bd62daa?w=600', stock: 25, category: 'vegetables' },
      { id: 'v8', name: 'Carrot', price: 33, image: 'https://5.imimg.com/data5/DH/BS/UG/SELLER-52971039/fresh-carrot-5-kg.jpg?w=600', stock: 45, category: 'vegetables' },
      { id: 'v9', name: 'Cauliflower', price: 45, image: 'https://organicmandya.com/cdn/shop/files/Cauliflower.jpg?v=1757078756&width=1000?w=600', stock: 25, category: 'vegetables' },
      { id: 'v10', name: 'Cluster Beans', price: 60, image: 'https://im.pluckk.in/unsafe/1200x0/product_thumbnail/111713134AL/cluster_beans.jpg?w=600', stock: 20, category: 'vegetables' },
      // additional vegetables
      { id: 'v26', name: 'Zucchini', price: 80, image: 'https://via.placeholder.com/600?text=Zucchini', stock: 20, category: 'vegetables' },
      { id: 'v27', name: 'Lettuce', price: 70, image: 'https://via.placeholder.com/600?text=Lettuce', stock: 25, category: 'vegetables' },
      { id: 'v28', name: 'Red Cabbage', price: 60, image: 'https://via.placeholder.com/600?text=Red+Cabbage', stock: 30, category: 'vegetables' },
      { id: 'v29', name: 'Baby Corn', price: 60, image: 'https://via.placeholder.com/600?text=Baby+Corn', stock: 20, category: 'vegetables' },
      { id: 'v30', name: 'Green Peas', price: 90, image: 'https://via.placeholder.com/600?text=Green+Peas', stock: 40, category: 'vegetables' },
      { id: 'v31', name: 'Raw Papaya', price: 35, image: 'https://via.placeholder.com/600?text=Raw+Papaya', stock: 30, category: 'vegetables' },
      { id: 'v32', name: 'Colocasia (Arbi)', price: 70, image: 'https://via.placeholder.com/600?text=Colocasia', stock: 25, category: 'vegetables' },
      { id: 'v33', name: 'Yam (Suran)', price: 65, image: 'https://via.placeholder.com/600?text=Yam', stock: 20, category: 'vegetables' },
      { id: 'v34', name: 'Ash Gourd (Big)', price: 30, image: 'https://via.placeholder.com/600?text=Ash+Gourd+Big', stock: 15, category: 'vegetables' },
      { id: 'v35', name: 'Drumstick Leaves', price: 25, image: 'https://via.placeholder.com/600?text=Drumstick+Leaves', stock: 50, category: 'vegetables' },
      { id: 'v36', name: 'Parsley', price: 40, image: 'https://via.placeholder.com/600?text=Parsley', stock: 45, category: 'vegetables' },
      { id: 'v37', name: 'Leek', price: 80, image: 'https://via.placeholder.com/600?text=Leek', stock: 20, category: 'vegetables' },
      
      // Fruits
      { id: 'f1', name: 'Apple', price: 3.00, image: 'https://organicmandya.com/cdn/shop/files/Apples_bf998dd2-0ee8-4880-9726-0723c6fbcff3.jpg?v=1757075827&width=1000?w=600', stock: 40, category: 'fruits' },
      { id: 'f2', name: 'Banana', price: 0.80, image: 'https://m.media-amazon.com/images/I/51ebZJ+DR4L.jpg?w=600', stock: 100, category: 'fruits' },
      { id: 'f3', name: 'Black Grapes', price: 2.50, image: 'https://5.imimg.com/data5/VE/BQ/MY-36411182/fresh-black-grapes.jpg?w=600', stock: 35, category: 'fruits' },
      { id: 'f4', name: 'Chikoo', price: 2.20, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNml9jiOp5_QFkeWJ-kyQDHKbiSFBkHUXWjw&s?w=600', stock: 25, category: 'fruits' },
      { id: 'f5', name: 'Coconut', price: 1.50, image: 'https://malabardirect.com/cdn/shop/products/coconut.jpg?v=1601986403?w=600', stock: 30, category: 'fruits' },
      // additional fruits
      { id: 'f26', name: 'Imported Apple', price: 220, image: 'https://via.placeholder.com/600?text=Imported+Apple', stock: 20, category: 'fruits' },
      { id: 'f27', name: 'Green Apple', price: 180, image: 'https://via.placeholder.com/600?text=Green+Apple', stock: 25, category: 'fruits' },
      { id: 'f28', name: 'Thai Guava', price: 90, image: 'https://via.placeholder.com/600?text=Thai+Guava', stock: 30, category: 'fruits' },
      { id: 'f29', name: 'Anjeer Fresh', price: 200, image: 'https://via.placeholder.com/600?text=Anjeer+Fresh', stock: 15, category: 'fruits' },
      { id: 'f30', name: 'Mandarin Orange', price: 120, image: 'https://via.placeholder.com/600?text=Mandarin+Orange', stock: 40, category: 'fruits' },
      { id: 'f31', name: 'Kesar Mango', price: 150, image: 'https://via.placeholder.com/600?text=Kesar+Mango', stock: 30, category: 'fruits' },
      { id: 'f32', name: 'Alphonso Mango', price: 300, image: 'https://via.placeholder.com/600?text=Alphonso+Mango', stock: 20, category: 'fruits' },
      { id: 'f33', name: 'Cherries', price: 250, image: 'https://via.placeholder.com/600?text=Cherries', stock: 18, category: 'fruits' },
      { id: 'f34', name: 'Mulberry', price: 180, image: 'https://via.placeholder.com/600?text=Mulberry', stock: 22, category: 'fruits' },
      { id: 'f35', name: 'Kiwi (Imported)', price: 220, image: 'https://via.placeholder.com/600?text=Kiwi+Imported', stock: 24, category: 'fruits' },
      { id: 'f36', name: 'Dry Dates', price: 140, image: 'https://via.placeholder.com/600?text=Dry+Dates', stock: 35, category: 'fruits' },
      
      // Dairy
      { id: 'd1', name: 'Butter', price: 4.00, image: 'https://images.unsplash.com/photo-1589987607627-3b1a6a5c45e5?w=600', stock: 25, category: 'dairy' },
      { id: 'd2', name: 'Buttermilk', price: 1.50, image: 'https://images.unsplash.com/photo-1604908176997-125f7b2a8d28?w=600', stock: 40, category: 'dairy' },
      { id: 'd3', name: 'Cheese Cubes', price: 5.50, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600', stock: 20, category: 'dairy' },
      { id: 'd4', name: 'Curd (Dahi)', price: 2.00, image: 'https://thewaywewere.in/cdn/shop/files/100-fresh-good-source-of-calcium-vitamins-a-d-probiotics-pure-natural-curd-328.jpg?v=1717585736?w=600', stock: 35, category: 'dairy' },
      { id: 'd5', name: 'Full Cream Milk', price: 3.50, image: 'https://images.unsplash.com/photo-1563636619-e9107da5a76a?w=600', stock: 40, category: 'dairy' },
      // additional dairy
      { id: 'd20', name: 'Amul Milk 1L', price: 62, image: 'https://via.placeholder.com/600?text=Amul+Milk+1L', stock: 40, category: 'dairy' },
      { id: 'd21', name: 'Full Cream Milk', price: 65, image: 'https://via.placeholder.com/600?text=Full+Cream+Milk', stock: 50, category: 'dairy' },
      { id: 'd22', name: 'Low Fat Milk', price: 52, image: 'https://via.placeholder.com/600?text=Low+Fat+Milk', stock: 45, category: 'dairy' },
      { id: 'd23', name: 'Paneer Block 500g', price: 240, image: 'https://via.placeholder.com/600?text=Paneer+Block+500g', stock: 20, category: 'dairy' },
      { id: 'd24', name: 'Butter 500g', price: 260, image: 'https://via.placeholder.com/600?text=Butter+500g', stock: 25, category: 'dairy' },
      { id: 'd25', name: 'Cheddar Cheese', price: 120, image: 'https://via.placeholder.com/600?text=Cheddar+Cheese', stock: 18, category: 'dairy' },
      { id: 'd26', name: 'Pizza Cheese', price: 140, image: 'https://via.placeholder.com/600?text=Pizza+Cheese', stock: 18, category: 'dairy' },
      { id: 'd27', name: 'Fresh Cream 500ml', price: 150, image: 'https://via.placeholder.com/600?text=Fresh+Cream+500ml', stock: 22, category: 'dairy' },
      { id: 'd28', name: 'Milkshake Bottle', price: 35, image: 'https://via.placeholder.com/600?text=Milkshake+Bottle', stock: 60, category: 'dairy' },
      { id: 'd29', name: 'Kulfi', price: 30, image: 'https://via.placeholder.com/600?text=Kulfi', stock: 40, category: 'dairy' },
      { id: 'd30', name: 'Frozen Yogurt', price: 60, image: 'https://via.placeholder.com/600?text=Frozen+Yogurt', stock: 30, category: 'dairy' }
    ];

    // upsert each product so we don’t wipe the collection
    for (const p of products) {
      await Product.updateOne({ id: p.id }, p, { upsert: true });
    }
    // add items for the new categories too (dry fruits, grains, beverages)
    const extra = [
      { id: 'df1', name: 'Almonds', price: 800, image: 'https://via.placeholder.com/600?text=Almonds', stock: 20, category: 'dryFruits' },
      { id: 'df2', name: 'Cashew', price: 900, image: 'https://via.placeholder.com/600?text=Cashew', stock: 20, category: 'dryFruits' },
      { id: 'df3', name: 'Pistachio', price: 1100, image: 'https://via.placeholder.com/600?text=Pistachio', stock: 15, category: 'dryFruits' },
      { id: 'df4', name: 'Walnuts', price: 700, image: 'https://via.placeholder.com/600?text=Walnuts', stock: 25, category: 'dryFruits' },
      { id: 'df5', name: 'Raisins', price: 300, image: 'https://via.placeholder.com/600?text=Raisins', stock: 30, category: 'dryFruits' },
      { id: 'g1', name: 'Basmati Rice', price: 120, image: 'https://via.placeholder.com/600?text=Basmati+Rice', stock: 50, category: 'grains' },
      { id: 'g2', name: 'Sona Masoori', price: 60, image: 'https://via.placeholder.com/600?text=Sona+Masoori', stock: 60, category: 'grains' },
      { id: 'g3', name: 'Wheat Flour', price: 45, image: 'https://via.placeholder.com/600?text=Wheat+Flour', stock: 70, category: 'grains' },
      { id: 'g4', name: 'Ragi', price: 55, image: 'https://via.placeholder.com/600?text=Ragi', stock: 40, category: 'grains' },
      { id: 'g5', name: 'Jowar', price: 50, image: 'https://via.placeholder.com/600?text=Jowar', stock: 45, category: 'grains' },
      { id: 'b1', name: 'Coca Cola', price: 40, image: 'https://via.placeholder.com/600?text=Coca+Cola', stock: 100, category: 'beverages' },
      { id: 'b2', name: 'Pepsi', price: 40, image: 'https://via.placeholder.com/600?text=Pepsi', stock: 100, category: 'beverages' },
      { id: 'b3', name: 'Maaza', price: 35, image: 'https://via.placeholder.com/600?text=Maaza', stock: 80, category: 'beverages' },
      { id: 'b4', name: 'Sprite', price: 40, image: 'https://via.placeholder.com/600?text=Sprite', stock: 90, category: 'beverages' },
      { id: 'b5', name: 'Fruit Juice', price: 30, image: 'https://via.placeholder.com/600?text=Fruit+Juice', stock: 120, category: 'beverages' }
    ];
    for (const p of extra) {
      await Product.updateOne({ id: p.id }, p, { upsert: true });
    }
    console.log('Products added/updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
