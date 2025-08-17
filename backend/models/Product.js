const mongoose = require('mongoose');
const { checkStockLevels, checkExpirationStatus } = require('../utils/notificationHelper');

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  costPrice: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    trim: true
  },

  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    required: true,
    min: 0,
    default: 10,
    description: 'Alert will be triggered when stock falls below this number'
  },
  expirationDate: {
    type: Date
  },
  supplier: {
    type: String,
    trim: true
  },
  lastRestocked: {
    type: Date,
    default: Date.now
  },
  manufacturingDate: {
    type: Date
  },
  batchNumber: {
    type: String,
    trim: true
  },
  shelfLife: {
    value: {
      type: Number,
      min: 0
    },
    unit: {
      type: String,
      enum: ['days', 'months', 'years'],
      default: 'days'
    }
  },
  isPerishable: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
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

// Update the updatedAt timestamp before saving
productSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Calculate remaining shelf life in days
productSchema.methods.getRemainingShelfLife = function() {
  if (!this.expirationDate) return null;
  const now = new Date();
  const diff = this.expirationDate.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
};

// Check if product is expired
productSchema.methods.isExpired = function() {
  if (!this.expirationDate) return false;
  return new Date() > this.expirationDate;
};

// Calculate expiration date based on manufacturing date and shelf life
productSchema.methods.calculateExpirationDate = function() {
  if (!this.manufacturingDate || !this.shelfLife.value) return null;
  
  const date = new Date(this.manufacturingDate);
  switch(this.shelfLife.unit) {
    case 'days':
      date.setDate(date.getDate() + this.shelfLife.value);
      break;
    case 'months':
      date.setMonth(date.getMonth() + this.shelfLife.value);
      break;
    case 'years':
      date.setFullYear(date.getFullYear() + this.shelfLife.value);
      break;
  }
  return date;
};

// Pre-save middleware to automatically calculate expiration date
productSchema.pre('save', function(next) {
  if (this.manufacturingDate && this.shelfLife.value) {
    this.expirationDate = this.calculateExpirationDate();
  }
  this.updatedAt = new Date();
  next();
});

// Create indexes for frequently queried fields
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ barcode: 1 });
productSchema.index({ expirationDate: 1 });

// Static method to find nearly expired products
productSchema.statics.findNearlyExpired = async function(daysThreshold = 30) {
  const dateThreshold = new Date();
  dateThreshold.setDate(dateThreshold.getDate() + daysThreshold);
  
  return this.find({
    expirationDate: {
      $exists: true,
      $ne: null,
      $gt: new Date(),
      $lte: dateThreshold
    }
  }).sort({ expirationDate: 1 });
};

// Static method to find expired products
productSchema.statics.findExpired = async function() {
  return this.find({
    expirationDate: {
      $exists: true,
      $ne: null,
      $lte: new Date()
    }
  }).sort({ expirationDate: 1 });
};


// Check stock levels and expiration status after saving
productSchema.post('save', async function(doc, next) {
  // Always check stock levels after save (admin only, as user context is not available here)
  await require('../utils/notificationHelper').checkStockLevels(doc);
  // Check expiration status
  await require('../utils/notificationHelper').checkExpirationStatus(doc);
  if (next) next();
});

// Always check stock after updateStock
productSchema.methods.updateStock = async function(quantity, operation = 'decrease', userEmail) {
  const oldStock = this.stock;
  switch(operation) {
    case 'decrease':
      if (this.stock < quantity) {
        throw new Error(`Insufficient stock for ${this.name}. Available: ${this.stock}`);
      }
      this.stock -= quantity;
      break;
    case 'increase':
      this.stock += quantity;
      break;
    case 'set':
      this.stock = quantity;
      break;
    default:
      throw new Error('Invalid stock operation');
  }
  await this.save();
  // Always check for low stock after update
  await require('../utils/notificationHelper').checkStockLevels(this, userEmail);
  return {
    oldStock,
    newStock: this.stock,
    product: this
  };
};

// Static method to find products with low stock
productSchema.statics.findLowStock = function() {
  return this.find({
    $expr: {
      $lte: ['$stock', '$lowStockThreshold']
    }
  });
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
