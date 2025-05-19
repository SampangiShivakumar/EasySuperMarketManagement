const mongoose = require('mongoose');
const Sale = mongoose.model('Sale', new mongoose.Schema({
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
}));

mongoose.connect('mongodb://localhost:27017/easymanager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

const salesData = [
  {
    InvoiceID: "100-01-001",
    Date: "2025-04-01",
    CustomerType: "Member",
    Gender: "Male",
    ProductLine: "Health & Beauty",
    UnitPrice: 74.69,
    Quantity: 7,
    Tax: 26.14,
    Total: 548.97,
    Payment: "Credit",
    City: "Hyderabad"
  },
  {
    InvoiceID: "100-01-002",
    Date: "2025-04-01",
    CustomerType: "Normal",
    Gender: "Female",
    ProductLine: "Food & Beverages",
    UnitPrice: 15.28,
    Quantity: 5,
    Tax: 3.82,
    Total: 80.22,
    Payment: "Cash",
    City: "Bengaluru"
  },
  {
    InvoiceID: "100-01-003",
    Date: "2025-04-02",
    CustomerType: "Member",
    Gender: "Male",
    ProductLine: "Electronics",
    UnitPrice: 58.22,
    Quantity: 2,
    Tax: 5.82,
    Total: 122.22,
    Payment: "E-wallet",
    City: "Hyderabad"
  },
  {
    InvoiceID: "100-01-004",
    Date: "2025-04-02",
    CustomerType: "Normal",
    Gender: "Female",
    ProductLine: "Fashion accessories",
    UnitPrice: 90.10,
    Quantity: 1,
    Tax: 4.50,
    Total: 94.60,
    Payment: "Credit",
    City: "Mumbai"
  },
  {
    InvoiceID: "100-01-005",
    Date: "2025-04-03",
    CustomerType: "Member",
    Gender: "Male",
    ProductLine: "Home & Lifestyle",
    UnitPrice: 40.50,
    Quantity: 4,
    Tax: 8.10,
    Total: 170.10,
    Payment: "Cash",
    City: "Hyderabad"
  },
  {
    InvoiceID: "100-01-006",
    Date: "2025-04-03",
    CustomerType: "Normal",
    Gender: "Female",
    ProductLine: "Food & Beverages",
    UnitPrice: 33.20,
    Quantity: 3,
    Tax: 4.98,
    Total: 104.58,
    Payment: "E-wallet",
    City: "Mumbai"
  },
  {
    InvoiceID: "100-01-007",
    Date: "2025-04-16",
    CustomerType: "Member",
    Gender: "Female",
    ProductLine: "Electronics",
    UnitPrice: 199.99,
    Quantity: 2,
    Tax: 20.00,
    Total: 419.98,
    Payment: "Credit",
    City: "Mumbai"
  },
  {
    InvoiceID: "100-01-008",
    Date: "2025-04-16",
    CustomerType: "Normal",
    Gender: "Male",
    ProductLine: "Food & Beverages",
    UnitPrice: 45.50,
    Quantity: 3,
    Tax: 6.83,
    Total: 143.33,
    Payment: "Cash",
    City: "Hyderabad"
  }
];

const insertSales = async () => {
  try {
    await Sale.deleteMany({});
    await Sale.insertMany(salesData);
    console.log('Sales data inserted successfully');
  } catch (error) {
    console.error('Error inserting sales:', error);
  } finally {
    mongoose.connection.close();
  }
};

insertSales();