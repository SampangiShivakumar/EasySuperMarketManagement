const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const Employee = require('./models/Employee');
const User = require('./models/User');
const Product = require('./models/Product');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { sendEmail } = require('./config/email.config');

// Helper function for date range calculations
const getDateRange = (timeRange) => {
  const now = new Date();
  let start = new Date();
  
  switch(timeRange) {
    case 'daily':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'weekly':
      start = new Date(now);
      start.setDate(now.getDate() - 7);
      break;
    case 'monthly':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'yearly':
      start = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  
  return {
    start: start,
    end: now
  };
};

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// Configure CORS with more specific options
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

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

// Initialize after database connection
mongoose.connection.once('connected', () => {
  console.log('Database connected successfully');
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
const Bill = mongoose.model('Bill', BillSchema);

// Debug Routes
app.get('/api/debug/connection', (req, res) => {
  res.json({
    mongodbStatus: mongoose.connection.readyState,
    isConnected,
    serverStatus: 'running',
    port: PORT
  });
});

// Debug endpoint to check sales data
app.get('/api/debug/sales', async (req, res) => {
  try {
    const count = await Sale.countDocuments();
    const samples = await Sale.find().limit(5);
    console.log(`Total sales in DB: ${count}`);
    console.log('Sample sales:', samples);
    res.json({ count, samples });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({ error: error.message });
  }
});

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
      products: currentProducts,
      count: currentCount,
      trend: trend.toFixed(2)
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// Get a single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

// Create a new product
app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

// Update a product
app.put('/api/products/:id', async (req, res) => {
  try {
    // Clean and validate the update data
    const updateData = {
      name: req.body.name,
      productId: req.body.productId,
      category: req.body.category,
      price: parseFloat(req.body.price),
      costPrice: parseFloat(req.body.costPrice),
      stock: parseInt(req.body.stock),
      description: req.body.description,
      expirationDate: req.body.expirationDate,
      lowStockThreshold: parseInt(req.body.lowStockThreshold) || 0
    };

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Emit socket event for real-time updates
    io.emit('productUpdated', {
      type: 'updated',
      product: product
    });

    // Send low stock notification if needed
    const userEmail = getUserEmailFromRequest(req);
    const { checkStockLevels } = require('./utils/notificationHelper');
    await checkStockLevels(product, userEmail);
    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

// Delete a product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
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

// Create new bill with stock updates and alerts
app.post('/api/bills', async (req, res) => {
  try {
    const { products: billProducts, ...billData } = req.body;
    const lowStockAlerts = [];
    const userEmail = getUserEmailFromRequest(req);

    // Update stock for each product
    for (const item of billProducts) {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      // Check if we have enough stock
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
      }

      // Update stock
      const newStock = product.stock - item.quantity;
      product.stock = newStock;
      await product.save();

      // Check if this update triggered low stock condition
      if (newStock <= product.lowStockThreshold) {
        lowStockAlerts.push({
          productName: product.name,
          productId: product.productId,
          currentStock: newStock,
          threshold: product.lowStockThreshold
        });
        // Send notification to both admin and user
        await product.checkNotifications(userEmail);
      }

      // Emit real-time update
      io.emit('productUpdated', {
        type: 'updated',
        product: product.toObject()
      });
    }

    // Create the bill
    const bill = new Bill({
      ...billData,
      products: billProducts.map(p => ({
        productId: p.productId,
        name: p.name,
        quantity: p.quantity,
        price: p.price,
        total: p.price * p.quantity
      })),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await bill.save();

    // Send low stock alerts if any
    if (lowStockAlerts.length > 0) {
      const alertMessage = lowStockAlerts.map(alert => 
        `Product: ${alert.productName} (${alert.productId})\n` +
        `Current Stock: ${alert.currentStock}\n` +
        `Threshold: ${alert.threshold}\n`
      ).join('\n');

      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: 'Low Stock Alert - Multiple Products',
        text: `The following products are running low on stock:\n\n${alertMessage}`
      }).catch(console.error); // Don't let email errors affect the transaction
    }

    // Emit bill created event
    io.emit('billUpdated', {
      type: 'added',
      bill: bill
    });

    res.status(201).json({ 
      message: 'Bill created successfully',
      bill,
      lowStockAlerts: lowStockAlerts.length > 0 ? lowStockAlerts : undefined
    });

  } catch (error) {
    console.error('Error creating bill:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update existing bill with stock adjustment
app.put('/api/bills/:id', async (req, res) => {
  try {
    const oldBill = await Bill.findById(req.params.id);
    if (!oldBill) {
      throw new Error('Bill not found');
    }

    const { products: newProducts, ...billData } = req.body;

    // First, restore the old quantities
    for (const oldItem of oldBill.products) {
      await updateProductStock(oldItem.productId, oldItem.quantity, 'increase');
    }

    // Then, apply the new quantities
    for (const newItem of newProducts) {
      await updateProductStock(newItem.productId, newItem.quantity, 'decrease');
    }

    // Update the bill
    const updatedBill = await Bill.findByIdAndUpdate(
      req.params.id,
      {
        ...billData,
        products: newProducts,
        updatedAt: new Date()
      },
      { new: true }
    );

    // Emit bill updated event
    io.emit('billUpdated', {
      type: 'updated',
      bill: updatedBill
    });

    res.json(updatedBill);
  } catch (error) {
    console.error('Error updating bill:', error);
    res.status(500).json({ message: error.message });
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
    if (!isConnected || mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        error: 'Database connection is not ready',
        connectionState: mongoose.connection.readyState
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const todayStr = today.toISOString().split('T')[0];
    
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    console.log('Fetching sales for dates:', { today: todayStr, yesterday: yesterdayStr });
    
    // Get sales from Sales collection
    const salesData = await Sale.aggregate([
      {
        $addFields: {
          formattedDate: {
            $cond: {
              if: { $eq: [{ $type: "$Date" }, "date"] },
              then: { $dateToString: { format: "%Y-%m-%d", date: "$Date" } },
              else: "$Date"
            }
          }
        }
      },
      {
        $match: {
          formattedDate: {
            $in: [todayStr, yesterdayStr]
          }
        }
      },
      {
        $group: {
          _id: '$formattedDate',
          total: { $sum: { $toDouble: '$Total' } },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get sales from Bills collection for today (paid bills only)
    const todayBills = await Bill.aggregate([
      {
        $match: {
          date: {
            $gte: today,
            $lt: tomorrow
          },
          status: 'paid'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get sales from Bills collection for yesterday (paid bills only)
    const yesterdayBills = await Bill.aggregate([
      {
        $match: {
          date: {
            $gte: yesterday,
            $lt: today
          },
          status: 'paid'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    console.log('Sales data:', salesData);
    console.log('Today bills:', todayBills);
    console.log('Yesterday bills:', yesterdayBills);
    
    const salesTodayData = salesData.find(d => d._id === todayStr) || { total: 0, count: 0 };
    const salesYesterdayData = salesData.find(d => d._id === yesterdayStr) || { total: 0, count: 0 };
    
    const todayTotal = Math.round((
      (parseFloat(salesTodayData.total) || 0) + 
      (todayBills[0]?.total || 0)
    ) * 100) / 100;
    
    const yesterdayTotal = Math.round((
      (parseFloat(salesYesterdayData.total) || 0) + 
      (yesterdayBills[0]?.total || 0)
    ) * 100) / 100;
    
    const trend = yesterdayTotal === 0 
      ? (todayTotal > 0 ? 100 : 0)
      : ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100;
    
    const response = {
      total: todayTotal,
      trend: parseFloat(trend.toFixed(2)),
      details: {
        today: {
          total: todayTotal,
          count: salesTodayData.count + (todayBills[0]?.count || 0)
        },
        yesterday: {
          total: yesterdayTotal,
          count: salesYesterdayData.count + (yesterdayBills[0]?.count || 0)
        },
        date: todayStr
      }
    };
    
    console.log('Sending response:', response);
    res.json(response);
    
  } catch (error) {
    console.error('Error in /api/sales/daily:', error);
    res.status(500).json({ 
      error: 'Failed to fetch daily sales data',
      details: error.message,
      connectionState: mongoose.connection.readyState,
      timestamp: new Date().toISOString()
    });
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
        $addFields: {
          formattedDate: {
            $cond: {
              if: { $eq: [{ $type: "$Date" }, "date"] },
              then: { $dateToString: { format: "%Y-%m-%d", date: "$Date" } },
              else: "$Date"
            }
          }
        }
      },
      {
        $match: {
          formattedDate: {
            $gte: monthStart.toISOString().split('T')[0],
            $lte: monthEnd.toISOString().split('T')[0]
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $toDouble: "$Total" } }
        }
      }
    ]);

    // Get previous month's sales for trend
    const prevMonthStart = new Date(year, month - 2, 1);
    const prevMonthEnd = new Date(year, month - 1, 0);
    
    const previousMonthlySales = await Sale.aggregate([
      {
        $addFields: {
          formattedDate: {
            $cond: {
              if: { $eq: [{ $type: "$Date" }, "date"] },
              then: { $dateToString: { format: "%Y-%m-%d", date: "$Date" } },
              else: "$Date"
            }
          }
        }
      },
      {
        $match: {
          formattedDate: {
            $gte: prevMonthStart.toISOString().split('T')[0],
            $lte: prevMonthEnd.toISOString().split('T')[0]
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $toDouble: "$Total" } }
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

// Google Authentication endpoint
app.post('/api/auth/google', async (req, res) => {
  try {
    console.log('Received Google auth request:', req.body);

    const { email, name, picture, googleId } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      console.log('Creating new user for:', email);
      // Create new user if doesn't exist
      user = new User({
        email,
        name: name || email.split('@')[0],
        picture,
        googleId,
        authMethod: 'google',
      });
      await user.save();
    } else {
      console.log('Updating existing user:', email);
      // Update existing user's Google information
      user.name = name || user.name;
      user.picture = picture || user.picture;
      user.googleId = googleId || user.googleId;
      await user.save();
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        authMethod: 'google'
      },
      process.env.JWT_SECRET || 'your-secret-key', // Make sure to set JWT_SECRET in production
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture
      },
      token
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Authentication failed: ' + error.message 
    });
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

// Sales endpoints for different time ranges
app.get('/api/sales/:timeRange', async (req, res) => {
  try {
    // Check MongoDB connection
    if (!isConnected || mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        error: 'Database connection is not ready',
        connectionState: mongoose.connection.readyState
      });
    }

    const { timeRange } = req.params;
    const now = new Date();
    let startDate = new Date();

    // Validate timeRange parameter
    if (!['daily', 'weekly', 'monthly', 'yearly'].includes(timeRange)) {
      return res.status(400).json({ 
        error: 'Invalid time range. Must be one of: daily, weekly, monthly, yearly' 
      });
    }

    // Set the time range
    switch(timeRange) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'weekly':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'yearly':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    // Format dates to match the database format (YYYY-MM-DD)
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = now.toISOString().split('T')[0];    console.log('Date range:', { formattedStartDate, formattedEndDate });

    // Get sales data using aggregation
    const result = await Sale.aggregate([
      {
        $addFields: {
          formattedDate: {
            $cond: {
              if: { $eq: [{ $type: "$Date" }, "string"] },
              then: "$Date",
              else: {
                $dateToString: {
                  date: "$Date",
                  format: "%Y-%m-%d"
                }
              }
            }
          }
        }
      },
      {
        $match: {
          formattedDate: {
            $gte: formattedStartDate,
            $lte: formattedEndDate
          }
        }
      },
      {
        $group: {
          _id: '$formattedDate',
          salesAmount: { $sum: { $toDouble: '$Total' } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    console.log('Aggregation result:', result);

    // Format the results for the chart
    const sales = result.map(day => ({
      date: day._id,
      salesAmount: Math.round((day.salesAmount || 0) * 100) / 100
    }));

    const totalSales = Math.round(result.reduce((acc, day) => acc + (day.salesAmount || 0), 0) * 100) / 100;

    res.json({
      timeRange,
      sales,
      totalSales,
      startDate: formattedStartDate,
      endDate: formattedEndDate
    });

  } catch (error) {
    console.error('Error in /api/sales/:timeRange:', error);
    res.status(500).json({ 
      error: 'Failed to fetch sales data',
      details: error.message,
      connectionState: mongoose.connection.readyState
    });
  }
});

// Get count of today's bills
app.get('/api/bills/count-today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const count = await Bill.countDocuments({
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });
    
    res.json({ count });
  } catch (error) {
    console.error('Error counting today\'s bills:', error);
    res.status(500).json({ error: error.message });
  }
});

// Email notification endpoints
app.post('/api/notify/admin', async (req, res) => {
  try {
    const { subject, message } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;

    await sendEmail(adminEmail, 'notification', {
      username: 'Admin',
      message: message
    });

    res.json({ success: true, message: 'Notification sent to admin' });
  } catch (error) {
    console.error('Error sending admin notification:', error);
    res.status(500).json({ message: 'Failed to send notification', error: error.message });
  }
});

// Send login credentials
app.post('/api/auth/send-credentials', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    await sendEmail(email, 'loginCredentials', {
      username: username,
      password: password
    });

    res.json({ success: true, message: 'Login credentials sent successfully' });
  } catch (error) {
    console.error('Error sending login credentials:', error);
    res.status(500).json({ message: 'Failed to send login credentials', error: error.message });
  }
});

// Password reset request
app.post('/api/auth/reset-password-request', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    await sendEmail(email, 'resetPassword', {
      username: user.username,
      resetLink: resetLink
    });

    res.json({ success: true, message: 'Password reset instructions sent to your email' });
  } catch (error) {
    console.error('Error in password reset request:', error);
    res.status(500).json({ message: 'Failed to process password reset request', error: error.message });
  }
});

// Get nearly expired products
app.get('/api/products/nearly-expired', async (req, res) => {
  try {
    const daysThreshold = parseInt(req.query.days) || 30;
    const products = await Product.findNearlyExpired(daysThreshold);
    
    // If configured, send email notification to admin about nearly expired products
    if (products.length > 0 && process.env.ADMIN_EMAIL) {
      const productList = products.map(p => 
        `${p.name} (expires in ${p.getRemainingShelfLife()} days)`
      ).join('\n');
      
      await sendEmail(process.env.ADMIN_EMAIL, 'notification', {
        username: 'Admin',
        message: `The following products are nearing expiration:\n\n${productList}`
      });
    }

    res.json(products);
  } catch (error) {
    console.error('Error fetching nearly expired products:', error);
    res.status(500).json({ message: 'Error fetching nearly expired products', error: error.message });
  }
});

// Get expired products
app.get('/api/products/expired', async (req, res) => {
  try {
    const products = await Product.findExpired();
    res.json(products);
  } catch (error) {
    console.error('Error fetching expired products:', error);
    res.status(500).json({ message: 'Error fetching expired products', error: error.message });
  }
});

// Update product expiration details
app.patch('/api/products/:id/expiration', async (req, res) => {
  try {
    const {
      manufacturingDate,
      shelfLife,
      batchNumber,
      isPerishable
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (manufacturingDate) product.manufacturingDate = new Date(manufacturingDate);
    if (shelfLife) product.shelfLife = shelfLife;
    if (batchNumber) product.batchNumber = batchNumber;
    if (typeof isPerishable === 'boolean') product.isPerishable = isPerishable;

    // Expiration date will be automatically calculated in pre-save middleware
    await product.save();

    res.json(product);
  } catch (error) {
    console.error('Error updating product expiration details:', error);
    res.status(500).json({ message: 'Error updating product expiration details', error: error.message });
  }
});

// Update email settings
app.post('/api/settings/email', async (req, res) => {
  try {
    const { smtpEmail, smtpPassword } = req.body;

    // Find admin user
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      return res.status(404).json({ message: 'Admin user not found' });
    }

    // Test the email configuration
    const testTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpEmail,
        pass: smtpPassword
      }
    });

    // Try to verify the connection
    await testTransporter.verify();

    // Update email settings
    admin.emailSettings = {
      smtpEmail,
      smtpPassword,
      isConfigured: true,
      lastTested: new Date()
    };

    await admin.save();

    // Send a test email
    await sendEmail(smtpEmail, 'notification', {
      username: admin.username,
      message: 'This is a test email to confirm your email settings are working correctly.'
    });

    res.json({ 
      message: 'Email settings updated successfully',
      emailConfigured: true
    });
  } catch (error) {
    console.error('Error updating email settings:', error);
    res.status(500).json({ 
      message: 'Failed to update email settings', 
      error: error.message,
      emailConfigured: false
    });
  }
});

// Test email configuration
app.get('/api/test-email', async (req, res) => {
  try {
    // Use the configured email directly without checking for admin
    await sendEmail(process.env.EMAIL_USER, 'notification', {
      username: 'Store Manager',
      message: `This is a test email. Your email configuration is working correctly!
      
      Sending from: ${process.env.EMAIL_USER}
      Time: ${new Date().toLocaleString()}`
    });
    res.json({ 
      success: true, 
      message: 'Test email sent successfully. Please check your inbox.',
      emailUsed: process.env.EMAIL_USER
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send test email', 
      error: error.message 
    });
  }
});

// Debug email configuration
app.get('/api/debug/test-email', async (req, res) => {
  console.log('Starting email test...');
  
  try {
    // Log email configuration (safely)
    console.log('Email configuration:', {
      emailUser: process.env.EMAIL_USER,
      hasPassword: !!process.env.EMAIL_PASSWORD,
      passwordLength: process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.length : 0
    });

    // Create test message with timestamp
    const testMessage = `
      EasyManager Email Test
      Sent at: ${new Date().toLocaleString()}
      
      Configuration:
      - From: ${process.env.EMAIL_USER}
      - To: ${process.env.EMAIL_USER}
      
      If you receive this email, your email configuration is working correctly!
      
      Note: If you don't see this email in your inbox, please check your spam folder.
    `;

    // Attempt to send email
    console.log('Attempting to send email...');
    const result = await sendEmail(
      process.env.EMAIL_USER,
      'notification',
      {
        username: 'Store Manager',
        message: testMessage
      }
    );

    console.log('Email send result:', result);

    // Send success response
    res.json({
      success: true,
      message: 'Email send attempt completed',
      details: {
        sentTo: process.env.EMAIL_USER,
        timestamp: new Date().toISOString(),
        result: result
      }
    });

  } catch (error) {
    // Log detailed error information
    console.error('Email send error:', {
      message: error.message,
      code: error.code,
      command: error.command,
      stack: error.stack
    });

    // Send error response
    res.status(500).json({
      success: false,
      error: error.message,
      details: {
        errorCode: error.code,
        command: error.command
      }
    });
  }
});

// Email Test Endpoint with Steps
app.get('/api/email/test-steps', async (req, res) => {
  const steps = {
    config: { status: 'pending', details: null },
    connection: { status: 'pending', details: null },
    sending: { status: 'pending', details: null }
  };

  try {
    // Step 1: Check Configuration
    steps.config.status = 'testing';
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error('Email configuration missing');
    }
    steps.config.status = 'success';
    steps.config.details = {
      email: process.env.EMAIL_USER,
      passwordSet: !!process.env.EMAIL_PASSWORD
    };

    // Step 2: Test SMTP Connection
    steps.connection.status = 'testing';
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    await transporter.verify();
    steps.connection.status = 'success';
    steps.connection.details = 'SMTP connection successful';

    // Step 3: Send Test Email
    steps.sending.status = 'testing';
    const info = await transporter.sendMail({
      from: `EasyManager <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'EasyManager Email Test',
      text: `This is a test email from EasyManager.
        Time: ${new Date().toLocaleString()}
        
        If you receive this email, your email system is working correctly!`,
      html: `
        <h2>EasyManager Email Test</h2>
        <p>This is a test email from EasyManager.</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <p style="color: green;">If you receive this email, your email system is working correctly!</p>
      `
    });

    steps.sending.status = 'success';
    steps.sending.details = {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected
    };

    // Send Response
    res.json({
      success: true,
      steps: steps,
      message: 'Email test completed successfully. Check your inbox (including spam folder).',
      emailSentTo: process.env.EMAIL_USER
    });

  } catch (error) {
    // Mark the current step as failed
    Object.keys(steps).forEach(key => {
      if (steps[key].status === 'testing') {
        steps[key].status = 'failed';
        steps[key].details = error.message;
      }
    });

    console.error('Email test error:', {
      error: error.message,
      stack: error.stack,
      code: error.code
    });

    res.status(500).json({
      success: false,
      steps: steps,
      error: error.message,
      details: {
        errorCode: error.code,
        command: error.command
      }
    });
  }
});

// Helper to extract user email from request (JWT or body)
function getUserEmailFromRequest(req) {
  // Try JWT (Authorization: Bearer ...)
  const auth = req.headers && req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    try {
      const token = auth.split(' ')[1];
      const decoded = require('jsonwebtoken').decode(token);
      if (decoded && decoded.email) return decoded.email;
    } catch {}
  }
  // Try body
  if (req.body && req.body.userEmail) return req.body.userEmail;
  return null;
}

// Get store report
app.get('/api/reports/store-status', async (req, res) => {
  try {
    // Get total products and their value
    const products = await Product.find();
    const inventoryValue = products.reduce((total, product) => 
      total + (product.price * product.stock), 0
    );
    const totalProducts = products.length;
    
    // Get low stock products
    const lowStockProducts = await Product.findLowStock();
    
    // Get nearly expired products (30 days threshold)
    const nearlyExpiredProducts = await Product.findNearlyExpired(30);
    
    // Get today's sales
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const todaysSales = await Bill.aggregate([
      {
        $match: {
          date: { $gte: today, $lt: tomorrow },
          status: 'paid'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get monthly sales trend
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlySales = await Bill.aggregate([
      {
        $match: {
          date: { $gte: monthStart, $lt: tomorrow },
          status: 'paid'
        }
      },
      {
        $group: {
          _id: { $dayOfMonth: '$date' },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Get category-wise product distribution
    const categoryDistribution = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } }
        }
      }
    ]);

    res.json({
      summary: {
        totalProducts,
        inventoryValue: Math.round(inventoryValue * 100) / 100,
        lowStockCount: lowStockProducts.length,
        nearlyExpiringCount: nearlyExpiredProducts.length,
        todaySales: todaysSales[0]?.total || 0,
        todayTransactions: todaysSales[0]?.count || 0
      },
      details: {
        lowStockProducts,
        nearlyExpiredProducts,
        monthlySalesData: monthlySales,
        categoryDistribution
      }
    });

  } catch (error) {
    console.error('Error generating store report:', error);
    res.status(500).json({ 
      message: 'Error generating store report', 
      error: error.message 
    });
  }
});

// Update product stock
app.put('/api/products/:id/stock', async (req, res) => {
  try {
    const { quantity, operation } = req.body;
    const userEmail = getUserEmailFromRequest(req);
    const product = await Product.findById(req.params.id);
    if (!product) {
      throw new Error('Product not found');
    }

    const result = await product.updateStock(parseFloat(quantity), operation);

    if (result.product.stock <= result.product.lowStockThreshold) {
      // Send low stock notification to both admin and user
      await result.product.checkNotifications(userEmail);
    }

    // Emit real-time update
    io.emit('productUpdated', {
      type: 'updated',
      product: result.product
    });

    res.json({ 
      message: 'Stock updated successfully',
      oldStock: result.oldStock,
      newStock: result.newStock,
      product: result.product
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get low stock products
app.get('/api/products/low-stock', async (req, res) => {
  try {
    const lowStockProducts = await Product.findLowStock();
    res.json(lowStockProducts);
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    res.status(500).json({ message: error.message });
  }
})
