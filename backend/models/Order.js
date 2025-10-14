const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String, // Store name in case product is deleted
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    },
    subtotal: Number
  }],
  shippingAddress: {
    fullName: String,
    phone: String,
    address: String,
    city: String,
    postalCode: String,
    province: String,
    country: {
      type: String,
      default: 'España'
    }
  },
  paymentInfo: {
    method: {
      type: String,
      enum: ['card', 'paypal', 'bizum', 'transfer'],
      required: true
    },
    transactionId: String,
    stripePaymentIntentId: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    paidAt: Date
  },
  pricing: {
    subtotal: {
      type: Number,
      required: true
    },
    tax: {
      type: Number,
      required: true
    },
    shipping: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    date: Date,
    note: String
  }],
  deliveryMethod: {
    type: String,
    enum: ['pickup', 'delivery'],
    required: true
  },
  deliveryDate: Date,
  notes: String,
  invoice: {
    number: String,
    url: String,
    generatedAt: Date
  },
  // GDPR - Customer can request order data
  gdprExportRequested: {
    type: Boolean,
    default: false
  },
  gdprExportDate: Date
}, {
  timestamps: true
});

// Indexes
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ 'paymentInfo.status': 1 });

// Generate order number before saving
OrderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD-${year}${month}-${String(count + 1).padStart(5, '0')}`;
  }
  
  // Calculate subtotals
  this.items.forEach(item => {
    item.subtotal = item.price * item.quantity;
  });
  
  next();
});

// Add status to history when changed
OrderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      date: new Date()
    });
  }
  next();
});

module.exports = mongoose.model('Order', OrderSchema);
