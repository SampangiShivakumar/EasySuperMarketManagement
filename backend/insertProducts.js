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
    productId: '101', name: 'Milk (1L)', category: 'Dairy', price: 60, costPrice: 52, stock: 15, lowStockThreshold: 10, expirationDate: new Date('2025-07-25')
  },
  {
    productId: '102', name: 'Bread (500g)', category: 'Bakery', price: 48, costPrice: 40, stock: 8, lowStockThreshold: 20, expirationDate: new Date('2025-07-20')
  },
  {
    productId: '103', name: 'Eggs (6 pack)', category: 'Poultry', price: 45, costPrice: 36, stock: 22, lowStockThreshold: 15, expirationDate: new Date('2025-07-30')
  },
  {
    productId: '104', name: 'Rice (5kg)', category: 'Grains', price: 320, costPrice: 280, stock: 12, lowStockThreshold: 5, expirationDate: new Date('2026-03-01')
  },
  {
    productId: '105', name: 'Sugar (1kg)', category: 'Grocery', price: 55, costPrice: 48, stock: 25, lowStockThreshold: 10, expirationDate: new Date('2026-02-20')
  },
  {
    productId: '106', name: 'Salt (1kg)', category: 'Grocery', price: 25, costPrice: 20, stock: 40, lowStockThreshold: 8, expirationDate: new Date('2027-05-01')
  },
  {
    productId: '107', name: 'Toothpaste (150g)', category: 'Personal Care', price: 95, costPrice: 75, stock: 6, lowStockThreshold: 10, expirationDate: new Date('2026-12-01')
  },
  {
    productId: '108', name: 'Shampoo (200ml)', category: 'Personal Care', price: 150, costPrice: 120, stock: 10, lowStockThreshold: 5, expirationDate: new Date('2026-11-15')
  },
  {
    productId: '109', name: 'Maggi (4 pack)', category: 'Instant Foods', price: 60, costPrice: 50, stock: 28, lowStockThreshold: 30, expirationDate: new Date('2025-10-10')
  },
  {
    productId: '110', name: 'Soap (pack of 3)', category: 'Personal Care', price: 110, costPrice: 90, stock: 14, lowStockThreshold: 15, expirationDate: new Date('2027-01-10')
  },
  {
    productId: '111', name: 'Tea Powder (250g)', category: 'Beverages', price: 95, costPrice: 85, stock: 9, lowStockThreshold: 10, expirationDate: new Date('2026-07-01')
  },
  {
    productId: '112', name: 'Oil (1L)', category: 'Grocery', price: 165, costPrice: 145, stock: 18, lowStockThreshold: 12, expirationDate: new Date('2025-12-01')
  },
  {
    productId: '113', name: 'Detergent (1kg)', category: 'Cleaning', price: 120, costPrice: 105, stock: 5, lowStockThreshold: 7, expirationDate: new Date('2026-09-09')
  },
  {
    productId: '114', name: 'Biscuits (pack)', category: 'Snacks', price: 30, costPrice: 25, stock: 30, lowStockThreshold: 25, expirationDate: new Date('2025-08-05')
  },
  {
    productId: '115', name: 'Cold Drink (500ml)', category: 'Beverages', price: 45, costPrice: 35, stock: 50, lowStockThreshold: 20, expirationDate: new Date('2025-09-15')
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