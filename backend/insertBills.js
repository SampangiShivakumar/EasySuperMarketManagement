const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
  billNo: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    required: true
  },
  customer: {
    type: String,
    required: true
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    price: Number,
    quantity: Number,
    total: Number
  }],
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'online'],
    required: true
  },
  status: {
    type: String,
    enum: ['paid', 'pending', 'overdue'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const ProductSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  category: String,
  price: Number,
  costPrice: Number,
  stock: Number,
  description: String
});

const Bill = mongoose.model('Bill', BillSchema);
const Product = mongoose.model('Product', ProductSchema);

mongoose.connect('mongodb://localhost:27017/easymanager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

const insertBills = async () => {
  try {
    // First get some products to reference
    const products = await Product.find();
    if (products.length === 0) {
      console.error('No products found in database. Please run insertProducts.js first.');
      return;
    }

    // Clear existing bills
    await Bill.deleteMany({});

    const billsData = [
      {
        billNo: 'BILL-250416-001',
        date: new Date('2025-04-16T10:30:00'),
        customer: 'John Doe',
        products: [
          {
            productId: products[0]._id,
            name: products[0].name,
            price: products[0].price,
            quantity: 2,
            total: products[0].price * 2
          },
          {
            productId: products[1]._id,
            name: products[1].name,
            price: products[1].price,
            quantity: 1,
            total: products[1].price
          }
        ],
        amount: (products[0].price * 2) + products[1].price,
        paymentMethod: 'card',
        status: 'paid'
      },
      {
        billNo: 'BILL-250416-002',
        date: new Date('2025-04-16T14:45:00'),
        customer: 'Jane Smith',
        products: [
          {
            productId: products[2]._id,
            name: products[2].name,
            price: products[2].price,
            quantity: 1,
            total: products[2].price
          }
        ],
        amount: products[2].price,
        paymentMethod: 'cash',
        status: 'paid'
      },
      {
        billNo: 'BILL-250416-003',
        date: new Date('2025-04-16T16:20:00'),
        customer: 'Mike Johnson',
        products: [
          {
            productId: products[3]._id,
            name: products[3].name,
            price: products[3].price,
            quantity: 1,
            total: products[3].price
          },
          {
            productId: products[4]._id,
            name: products[4].name,
            price: products[4].price,
            quantity: 3,
            total: products[4].price * 3
          }
        ],
        amount: products[3].price + (products[4].price * 3),
        paymentMethod: 'online',
        status: 'pending'
      }
    ];

    await Bill.insertMany(billsData);
    console.log('Sample bills inserted successfully');
  } catch (error) {
    console.error('Error inserting bills:', error);
  } finally {
    mongoose.connection.close();
  }
};

insertBills();