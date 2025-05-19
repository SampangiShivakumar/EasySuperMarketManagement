const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  costPrice: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', ProductSchema);

mongoose.connect('mongodb://localhost:27017/easymanager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

const productsData = [
  {
    productId: 'PRD0001',
    name: 'Smart LED TV',
    category: 'Electronics',
    price: 45999.99,
    costPrice: 38000.00,
    stock: 15,
    description: '55-inch 4K Smart LED TV'
  },
  {
    productId: 'PRD0002',
    name: 'Premium Coffee',
    category: 'Food & Beverages',
    price: 499.99,
    costPrice: 300.00,
    stock: 50,
    description: 'Premium Arabica Coffee Beans 500g'
  },
  {
    productId: 'PRD0003',
    name: 'Designer Watch',
    category: 'Fashion',
    price: 2999.99,
    costPrice: 1800.00,
    stock: 25,
    description: 'Luxury Analog Watch'
  },
  {
    productId: 'PRD0004',
    name: 'Air Purifier',
    category: 'Home & Lifestyle',
    price: 15999.99,
    costPrice: 12000.00,
    stock: 10,
    description: 'HEPA Air Purifier with IoT'
  },
  {
    productId: 'PRD0005',
    name: 'Face Serum',
    category: 'Health & Beauty',
    price: 999.99,
    costPrice: 500.00,
    stock: 30,
    description: 'Vitamin C Face Serum 30ml'
  },
  {
    productId: 'PRD0006',
    name: 'Wireless Earbuds',
    category: 'Electronics',
    price: 1999.99,
    costPrice: 1200.00,
    stock: 40,
    description: 'TWS Bluetooth Earbuds'
  }
];

const insertProducts = async () => {
  try {
    // Clear existing products
    await Product.deleteMany({});
    // Insert new products
    await Product.insertMany(productsData);
    console.log('Products data inserted successfully');
  } catch (error) {
    console.error('Error inserting products:', error);
  } finally {
    mongoose.connection.close();
  }
};

insertProducts();