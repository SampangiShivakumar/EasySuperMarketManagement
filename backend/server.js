const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const Employee = require('./models/Employee'); // Updated import path

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

app.use(cors());
app.use(express.json());

let isConnected = false;

// MongoDB connection with enhanced retry logic
const connectWithRetry = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`MongoDB connection attempt ${i + 1}...`);
      await mongoose.connect('mongodb://127.0.0.1:27017/supermarketDB', {
        socketTimeoutMS: 45000,
        connectTimeoutMS: 45000,
        serverSelectionTimeoutMS: 45000,
        heartbeatFrequencyMS: 2000,
        maxPoolSize: 10,
        minPoolSize: 2,
        maxIdleTimeMS: 30000,
        family: 4,
        autoIndex: true
      });
      
      // Verify connection with ping
      await mongoose.connection.db.admin().ping();
      console.log('MongoDB connected successfully');
      isConnected = true;
      return true;
    } catch (err) {
      console.error(`MongoDB connection attempt ${i + 1} failed:`, err.message);
      if (i < retries - 1) {
        console.log('Retrying in 5 seconds...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      } else {
        throw new Error(`Failed to connect after ${retries} attempts`);
      }
    }
  }
};

// Handle MongoDB events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  isConnected = false;
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected! Attempting to reconnect...');
  isConnected = false;
  setTimeout(() => {
    connectWithRetry().catch(console.error);
  }, 5000);
});

// Initialize MongoDB connection
connectWithRetry().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

// Middleware to check database connection
const checkDbConnection = (req, res, next) => {
  if (!isConnected) {
    return res.status(503).json({ 
      message: 'Database connection is not ready',
      connectionState: mongoose.connection.readyState
    });
  }
  next();
};

// Schema definitions
const SaleSchema = new mongoose.Schema({
  InvoiceID: String,
  Date: String,
  CustomerType: String,
  Gender: String,
  ProductLine: String,
  UnitPrice: Number,
  Quantity: Number,
  Tax: Number,
  Total: Number,
  Payment: String,
  City: String,
});

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

const Sale = mongoose.model('Sale', SaleSchema);
const Product = mongoose.model('Product', ProductSchema);
const Bill = mongoose.model('Bill', BillSchema);

// Product APIs
app.get('/api/products', async (req, res) => {
  try {
    const currentProducts = await Product.find();
    
    // Get products count from a week ago for trend
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const previousProducts = await Product.find({
      createdAt: { $lte: weekAgo }
    });

    const currentCount = currentProducts.length;
    const prevCount = previousProducts.length;
    
    const trend = prevCount ? ((currentCount - prevCount) / prevCount) * 100 : 0;

    res.json({
      total: currentCount,
      trend: Math.round(trend * 100) / 100,
      products: currentProducts
    });

  } catch (error) {
    console.error('Error in /api/products:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    io.emit('productUpdated', { type: 'added', product: saved });
    res.json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    io.emit('productUpdated', { type: 'updated', product: updated });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    io.emit('productUpdated', { type: 'deleted', productId: req.params.id });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Billing APIs
app.get('/api/bills', async (req, res) => {
  try {
    const bills = await Bill.find().sort({ date: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/bills', async (req, res) => {
  try {
    const bill = new Bill(req.body);
    const saved = await bill.save();

    // Update product stock
    for (const product of req.body.products) {
      await Product.findByIdAndUpdate(
        product.productId,
        { $inc: { stock: -product.quantity } }
      );
    }

    // Create a sale record from the bill
    const sale = new Sale({
      InvoiceID: bill.billNo,
      Date: new Date(bill.date).toISOString().split('T')[0],
      CustomerType: 'Normal',
      Gender: 'Unknown',
      ProductLine: bill.products[0]?.category || 'General',
      UnitPrice: bill.amount / bill.products.reduce((sum, p) => sum + p.quantity, 0),
      Quantity: bill.products.reduce((sum, p) => sum + p.quantity, 0),
      Tax: bill.amount * 0.05, // 5% tax
      Total: bill.amount,
      Payment: bill.paymentMethod,
      City: 'Hyderabad'
    });
    const savedSale = await sale.save();

    // Get updated daily total
    const today = new Date().toISOString().split('T')[0];
    const todaySales = await Sale.aggregate([
      {
        $match: { Date: today }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$Total" }
        }
      }
    ]);

    const dailyTotal = todaySales[0]?.total || 0;
    const saleWithTotal = { ...savedSale.toObject(), dailyTotal };

    // Get updated monthly total
    const currentDate = new Date();
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const monthlyTotal = await Sale.aggregate([
      {
        $match: {
          Date: {
            $gte: monthStart.toISOString().split('T')[0],
            $lte: monthEnd.toISOString().split('T')[0]
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$Total" }
        }
      }
    ]);

    const prevMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const prevMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    
    const prevMonthTotal = await Sale.aggregate([
      {
        $match: {
          Date: {
            $gte: prevMonthStart.toISOString().split('T')[0],
            $lte: prevMonthEnd.toISOString().split('T')[0]
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$Total" }
        }
      }
    ]);

    const currentMonthTotal = monthlyTotal[0]?.total || 0;
    const previousMonthTotal = prevMonthTotal[0]?.total || 0;
    const monthlyTrend = previousMonthTotal ? ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100 : 0;

    // Emit all necessary updates
    io.emit('billUpdated', { type: 'added', bill: saved });
    io.emit('newSale', saleWithTotal);
    io.emit('salesUpdated', { type: 'added', sale: savedSale, dailyTotal });
    io.emit('monthlyRevenueUpdated', { total: currentMonthTotal, trend: monthlyTrend });

    res.json(saved);
  } catch (error) {
    console.error('Error in POST /api/bills:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/bills/:id', async (req, res) => {
  try {
    // Get the old bill to restore stock
    const oldBill = await Bill.findById(req.params.id);
    if (oldBill) {
      for (const product of oldBill.products) {
        await Product.findByIdAndUpdate(
          product.productId,
          { $inc: { stock: product.quantity } }
        );
      }
    }

    const updated = await Bill.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    // Update stock with new quantities
    for (const product of req.body.products) {
      await Product.findByIdAndUpdate(
        product.productId,
        { $inc: { stock: -product.quantity } }
      );
    }

    io.emit('billUpdated', { type: 'updated', bill: updated });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/bills/:id', async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (bill) {
      // Restore stock for deleted bill
      for (const product of bill.products) {
        await Product.findByIdAndUpdate(
          product.productId,
          { $inc: { stock: product.quantity } }
        );
      }
      await bill.remove();
    }
    io.emit('billUpdated', { type: 'deleted', billId: req.params.id });
    res.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to get all sales
app.get('/api/sales', async (req, res) => {
  try {
    const data = await Sale.find();
    console.log('All sales:', data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching all sales:', error);
    res.status(500).json({ error: error.message });
  }
});

// API to get daily sales with trend
app.get('/api/sales/daily', async (req, res) => {
  try {
    const date = req.query.date;
    console.log('Fetching sales for date:', date);
    
    // Get today's total sales
    const todaySales = await Sale.aggregate([
      {
        $match: { Date: date }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$Total" }
        }
      }
    ]);

    console.log('Today\'s sales aggregation result:', todaySales);

    // Get previous day's total sales for trend calculation
    const previousDay = new Date(date);
    previousDay.setDate(previousDay.getDate() - 1);
    const prevDateStr = previousDay.toISOString().split('T')[0];
    
    const previousSales = await Sale.aggregate([
      {
        $match: { Date: prevDateStr }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$Total" }
        }
      }
    ]);

    console.log('Previous day sales aggregation result:', previousSales);

    const todayTotal = todaySales[0]?.total || 0;
    const prevTotal = previousSales[0]?.total || 0;
    
    // Calculate trend percentage
    const trend = prevTotal === 0 ? 0 : ((todayTotal - prevTotal) / prevTotal) * 100;

    console.log('Sending response:', { total: todayTotal, trend: trend });
    res.json({
      total: todayTotal,
      trend: trend
    });
  } catch (error) {
    console.error('Error in /api/sales/daily:', error);
    res.status(500).json({ error: error.message });
  }
});

// API to get monthly sales revenue
app.get('/api/sales/monthly', async (req, res) => {
  try {
    const { month, year } = req.query;
    console.log('Fetching monthly sales for:', month, year);
    
    // Get current month's sales
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0);
    
    const monthlySales = await Sale.aggregate([
      {
        $match: {
          Date: {
            $gte: monthStart.toISOString().split('T')[0],
            $lte: monthEnd.toISOString().split('T')[0]
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$Total" }
        }
      }
    ]);

    // Get previous month's sales for trend
    const prevMonthStart = new Date(year, month - 2, 1);
    const prevMonthEnd = new Date(year, month - 1, 0);
    
    const previousMonthlySales = await Sale.aggregate([
      {
        $match: {
          Date: {
            $gte: prevMonthStart.toISOString().split('T')[0],
            $lte: prevMonthEnd.toISOString().split('T')[0]
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$Total" }
        }
      }
    ]);

    const currentTotal = monthlySales[0]?.total || 0;
    const previousTotal = previousMonthlySales[0]?.total || 0;
    
    // Calculate trend percentage
    const trend = previousTotal === 0 ? 0 : ((currentTotal - previousTotal) / previousTotal) * 100;

    res.json({
      total: currentTotal,
      trend: trend
    });
  } catch (error) {
    console.error('Error in /api/sales/monthly:', error);
    res.status(500).json({ error: error.message });
  }
});

// API to add a sale
app.post('/api/sales', async (req, res) => {
  const newSale = new Sale(req.body);
  try {
    const saved = await newSale.save();
    console.log('New sale saved:', saved);
    
    // Get updated daily total after adding new sale
    const date = saved.Date;
    const updatedDaily = await Sale.aggregate([
      {
        $match: { Date: date }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$Total" }
        }
      }
    ]);

    const responseData = {
      ...saved.toObject(),
      dailyTotal: updatedDaily[0]?.total || 0
    };

    // Emit both the new sale and updated daily total
    io.emit('newSale', responseData);
    console.log('Emitted newSale event:', responseData);
    
    res.json(saved);
  } catch (error) {
    console.error('Error in POST /api/sales:', error);
    res.status(500).json({ error: error.message });
  }
});

// Employee Routes with enhanced error handling and logging
app.get('/api/employees', checkDbConnection, async (req, res) => {
  try {
    console.log('Fetching employees...');
    const employees = await Employee.find({})
      .lean()
      .maxTimeMS(30000)
      .exec();
    
    console.log(`Found ${employees.length} employees`);
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ 
      message: error.message,
      connectionState: mongoose.connection.readyState
    });
  }
});

app.post('/api/employees', async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(400).json({ message: error.message });
  }
});

io.on('connection', (socket) => {
  console.log('Client connected');
  
  socket.on('billUpdate', (data) => {
    io.emit('billUpdated', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5002;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('MongoDB connection status:', mongoose.connection.readyState);
});
