const mongoose = require('mongoose');

const newsletterSubscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  status: {
    type: String,
    enum: ['active', 'unsubscribed', 'bounced'],
    default: 'active'
  },
  source: {
    type: String,
    enum: ['homepage', 'contact_page', 'apply_page', 'other'],
    default: 'homepage'
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  },
  unsubscribedAt: {
    type: Date
  },
  lastEmailSent: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for efficient queries
newsletterSubscriptionSchema.index({ email: 1 });
newsletterSubscriptionSchema.index({ status: 1, createdAt: -1 });

// Pre-save middleware
newsletterSubscriptionSchema.pre('save', function(next) {
  if (this.email) {
    this.email = this.email.trim().toLowerCase();
  }
  
  // Set unsubscribedAt when status changes to unsubscribed
  if (this.isModified('status') && this.status === 'unsubscribed' && !this.unsubscribedAt) {
    this.unsubscribedAt = new Date();
  }
  
  next();
});

// Static method to check if email exists
newsletterSubscriptionSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.trim().toLowerCase() });
};

// Instance method to unsubscribe
newsletterSubscriptionSchema.methods.unsubscribe = function() {
  this.status = 'unsubscribed';
  this.unsubscribedAt = new Date();
  return this.save();
};

module.exports = mongoose.model('NewsletterSubscription', newsletterSubscriptionSchema);

