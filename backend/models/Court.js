const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['indoor', 'outdoor'],
    required: true
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient filtering
courtSchema.index({ type: 1, isActive: 1 });

module.exports = mongoose.model('Court', courtSchema);
