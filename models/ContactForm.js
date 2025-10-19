const mongoose = require('mongoose');

const contactFormSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    maxlength: [20, 'Phone number cannot exceed 20 characters']
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
    maxlength: [50, 'Country name cannot exceed 50 characters']
  },
  program: {
    type: String,
    trim: true,
    maxlength: [100, 'Program name cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['new', 'in_progress', 'responded', 'closed'],
    default: 'new'
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: [500, 'Admin notes cannot exceed 500 characters']
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for efficient queries
contactFormSchema.index({ email: 1, createdAt: -1 });
contactFormSchema.index({ status: 1, createdAt: -1 });

// Virtual for full name
contactFormSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Pre-save middleware
contactFormSchema.pre('save', function(next) {
  // Remove extra whitespace
  Object.keys(this.schema.paths).forEach(key => {
    if (this[key] && typeof this[key] === 'string') {
      this[key] = this[key].trim();
    }
  });
  next();
});

module.exports = mongoose.model('ContactForm', contactFormSchema);

