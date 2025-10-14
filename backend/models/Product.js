const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor añade un nombre de producto'],
    trim: true,
    maxlength: [100, 'El nombre no puede tener más de 100 caracteres']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Por favor añade una descripción'],
    maxlength: [2000, 'La descripción no puede tener más de 2000 caracteres']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'La descripción corta no puede tener más de 200 caracteres']
  },
  price: {
    type: Number,
    required: [true, 'Por favor añade un precio'],
    min: [0, 'El precio no puede ser negativo']
  },
  category: {
    type: String,
    required: [true, 'Por favor añade una categoría'],
    enum: ['cookies', 'brownies', 'brookies', 'cakes', 'other']
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: Boolean
  }],
  ingredients: [{
    type: String
  }],
  allergens: [{
    type: String,
    enum: ['gluten', 'lacteos', 'huevo', 'frutos-secos', 'soja', 'otro']
  }],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number
  },
  weight: {
    value: Number,
    unit: {
      type: String,
      enum: ['g', 'kg'],
      default: 'g'
    }
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'El stock no puede ser negativo']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number, // in hours
    default: 48
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ isAvailable: 1, isDeleted: 1 });
ProductSchema.index({ name: 'text', description: 'text' });

// Generate slug before saving
ProductSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Don't return deleted products by default
ProductSchema.pre(/^find/, function(next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: false });
  }
  next();
});

module.exports = mongoose.model('Product', ProductSchema);
