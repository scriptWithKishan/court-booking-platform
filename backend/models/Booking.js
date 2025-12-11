const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  court: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Court',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  resources: {
    racket: {
      type: Number,
      default: 0,
      min: 0
    },
    shoes: {
      type: Number,
      default: 0,
      min: 0
    },
    coach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coach',
      default: null
    }
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  },
  pricingBreakdown: {
    basePrice: {
      type: Number,
      required: true
    },
    peakHourFee: {
      type: Number,
      default: 0
    },
    weekendFee: {
      type: Number,
      default: 0
    },
    courtTypeFee: {
      type: Number,
      default: 0
    },
    equipmentFee: {
      type: Number,
      default: 0
    },
    coachFee: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  },
  version: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound index for efficient overlap queries
bookingSchema.index({ court: 1, startTime: 1, endTime: 1, status: 1 });
bookingSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
