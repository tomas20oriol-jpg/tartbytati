const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor añade un nombre'],
    trim: true,
    maxlength: [50, 'El nombre no puede tener más de 50 caracteres']
  },
  email: {
    type: String,
    required: [true, 'Por favor añade un email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor añade un email válido'
    ]
  },
  password: {
    type: String,
    required: [true, 'Por favor añade una contraseña'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false // No devolver password en queries por defecto
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/, 'Número de teléfono inválido']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  subscription: {
    isActive: {
      type: Boolean,
      default: false
    },
    plan: {
      type: String,
      enum: ['monthly', 'annual', null],
      default: null
    },
    startDate: Date,
    endDate: Date,
    stripeCustomerId: String,
    stripeSubscriptionId: String
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  // GDPR Compliance
  gdprConsent: {
    marketing: {
      type: Boolean,
      default: false
    },
    analytics: {
      type: Boolean,
      default: false
    },
    consentDate: Date
  },
  dataProcessingConsent: {
    type: Boolean,
    required: true,
    default: true
  },
  // Security
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  lastLogin: Date,
  ipAddresses: [{
    ip: String,
    date: Date
  }],
  // Soft delete for GDPR (right to be forgotten)
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
}, {
  timestamps: true
});

// Indexes for performance
UserSchema.index({ email: 1 });
UserSchema.index({ isDeleted: 1 });

// Virtual for account lock
UserSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Encrypt password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Increment login attempts
UserSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000; // 2 hours
  
  // Lock account after max attempts
  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }
  
  return this.updateOne(updates);
};

// Reset login attempts
UserSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $set: { loginAttempts: 0, lastLogin: Date.now() },
    $unset: { lockUntil: 1 }
  });
};

// Anonymize user data (GDPR right to be forgotten)
UserSchema.methods.anonymize = async function() {
  this.name = 'Usuario Eliminado';
  this.email = `deleted_${this._id}@deleted.com`;
  this.phone = null;
  this.isDeleted = true;
  this.deletedAt = Date.now();
  await this.save();
};

// Don't return deleted users by default
UserSchema.pre(/^find/, function(next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: false });
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);
