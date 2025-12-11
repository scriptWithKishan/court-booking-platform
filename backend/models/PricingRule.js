const mongoose = require('mongoose');

const pricingRuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['peak_hour', 'weekend', 'court_type'],
    required: true
  },
  conditions: {
    // For peak_hour: { startHour: 18, endHour: 21 }
    // For weekend: {} (applies to Sat/Sun)
    // For court_type: { courtType: 'indoor' }
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  modifierType: {
    type: String,
    enum: ['multiplier', 'fixed'],
    required: true
  },
  modifierValue: {
    type: Number,
    required: true,
    min: 0
  },
  priority: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient querying of active rules
pricingRuleSchema.index({ isActive: 1, priority: 1 });

module.exports = mongoose.model('PricingRule', pricingRuleSchema);
