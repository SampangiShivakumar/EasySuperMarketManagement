const mongoose = require('mongoose');
const Employee = require('./models/Employee'); // Updated path to use backend model

// Disable Mongoose buffering
mongoose.set('bufferCommands', false);

const employees = [
  {
    empId: "EMP001",
    name: "Rahul Sharma",
    age: 28,
    gender: "Male",
    role: "Cashier",
    department: "Billing",
    salary: 18500,
    phone: "9876543210",
    city: "Hyderabad",
    shift: "Morning",
    joinDate: new Date("2021-03-15")
  },
  {
    empId: "EMP002",
    name: "Priya Desai",
    age: 25,
    gender: "Female",
    role: "Inventory Manager",
    department: "Stock",
    salary: 24000,
    phone: "9867312456",
    city: "Hyderabad",
    shift: "Day",
    joinDate: new Date("2022-01-10")
  },
  {
    empId: "EMP003",
    name: "Vikram Reddy",
    age: 32,
    gender: "Male",
    role: "Supervisor",
    department: "Operations",
    salary: 30000,
    phone: "9934567812",
    city: "Hyderabad",
    shift: "Day",
    joinDate: new Date("2020-09-12")
  },
  {
    empId: "EMP004",
    name: "Anita Joshi",
    age: 29,
    gender: "Female",
    role: "Sales Assistant",
    department: "Sales",
    salary: 16500,
    phone: "9845098765",
    city: "Hyderabad",
    shift: "Evening",
    joinDate: new Date("2023-04-01")
  },
  {
    empId: "EMP005",
    name: "Manish Verma",
    age: 35,
    gender: "Male",
    role: "Warehouse Incharge",
    department: "Logistics",
    salary: 27000,
    phone: "9988776655",
    city: "Hyderabad",
    shift: "Night",
    joinDate: new Date("2019-07-20")
  },
  {
    empId: "EMP006",
    name: "Kavya Nair",
    age: 26,
    gender: "Female",
    role: "Customer Executive",
    department: "Front Desk",
    salary: 19000,
    phone: "9786543210",
    city: "Hyderabad",
    shift: "Morning",
    joinDate: new Date("2021-10-18")
  },
  {
    empId: "EMP007",
    name: "Arjun Mehta",
    age: 31,
    gender: "Male",
    role: "Security Officer",
    department: "Security",
    salary: 21500,
    phone: "9753108642",
    city: "Hyderabad",
    shift: "Night",
    joinDate: new Date("2020-06-02")
  },
  {
    empId: "EMP008",
    name: "Sneha Patil",
    age: 24,
    gender: "Female",
    role: "Data Entry Clerk",
    department: "Admin",
    salary: 17500,
    phone: "9832147856",
    city: "Hyderabad",
    shift: "Day",
    joinDate: new Date("2022-11-25")
  },
  {
    empId: "EMP009",
    name: "Faizan Ahmed",
    age: 27,
    gender: "Male",
    role: "Delivery Handler",
    department: "Dispatch",
    salary: 18000,
    phone: "9765432198",
    city: "Hyderabad",
    shift: "Evening",
    joinDate: new Date("2023-02-14")
  },
  {
    empId: "EMP010",
    name: "Ritu Saxena",
    age: 30,
    gender: "Female",
    role: "HR Coordinator",
    department: "HR",
    salary: 26000,
    phone: "9647851230",
    city: "Hyderabad",
    shift: "Morning",
    joinDate: new Date("2021-08-01")
  },
  {
    empId: "EMP011",
    name: "Mahesh Kumar",
    age: 38,
    gender: "Male",
    role: "Maintenance Head",
    department: "Maintenance",
    salary: 28000,
    phone: "9789604321",
    city: "Hyderabad",
    shift: "Day",
    joinDate: new Date("2018-12-05")
  },
  {
    empId: "EMP012",
    name: "Divya Rajput",
    age: 22,
    gender: "Female",
    role: "Billing Assistant",
    department: "Billing",
    salary: 15500,
    phone: "9745316820",
    city: "Hyderabad",
    shift: "Evening",
    joinDate: new Date("2023-05-17")
  }
];

async function waitForConnection(timeoutMs = 30000) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    if (mongoose.connection.readyState === 1) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Waiting for connection... State:', mongoose.connection.readyState);
  }
  throw new Error('Connection timeout');
}

async function insertEmployees() {
  let isConnected = false;
  try {
    console.log('Connecting to MongoDB supermarketDB...');
    
    // Connect with explicit options
    await mongoose.connect('mongodb://127.0.0.1:27017/supermarketDB', {
      bufferCommands: false,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 45000,
      serverSelectionTimeoutMS: 45000,
      maxPoolSize: 10,
      family: 4
    });

    // Wait for connection to be ready
    console.log('Waiting for connection to be established...');
    await waitForConnection();
    isConnected = true;
    console.log('MongoDB connected successfully');

    // Verify connection with a ping
    await mongoose.connection.db.admin().ping();
    console.log('Database connection verified with ping');

    // Clear existing data with explicit writeConcern
    console.log('Clearing existing employee data...');
    const deleteResult = await Employee.deleteMany({}, { 
      maxTimeMS: 30000,
      writeConcern: { w: 1, wtimeout: 30000 }
    });
    console.log('Cleared existing employee data:', deleteResult);

    // Insert new data with explicit writeConcern
    console.log('Inserting new employee data...');
    const result = await Employee.insertMany(employees, { 
      timeout: false,
      writeConcern: { w: 1, wtimeout: 30000 }
    });
    console.log('Successfully inserted', result.length, 'employees');
    console.log('First employee inserted:', result[0].name);
    
    return result;
  } catch (error) {
    console.error('Error in employee operation:', error);
    if (error.name === 'MongoServerSelectionError') {
      console.error('Could not connect to MongoDB. Please ensure MongoDB is running.');
    }
    throw error;
  } finally {
    if (isConnected) {
      try {
        await mongoose.disconnect();
        console.log('MongoDB disconnected');
      } catch (err) {
        console.error('Error during disconnect:', err);
      }
    }
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error during forced disconnect:', err);
    process.exit(1);
  }
});

// Run the insertion with proper error handling
insertEmployees()
  .then(() => {
    console.log('Employee insertion completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('Failed to insert employees:', error);
    process.exit(1);
  });
