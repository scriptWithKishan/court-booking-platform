const PricingRule = require('../models/PricingRule');

// Get all active pricing rules
const getPricingRules = async (req, res) => {
  try {
    const rules = await PricingRule.find({ isActive: true }).sort({ priority: 1 });
    res.json(rules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all pricing rules (including inactive) - Admin
const getAllPricingRules = async (req, res) => {
  try {
    const rules = await PricingRule.find().sort({ priority: 1 });
    res.json(rules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new pricing rule (Admin)
const createPricingRule = async (req, res) => {
  try {
    const { name, type, conditions, modifierType, modifierValue, priority } = req.body;

    const rule = new PricingRule({
      name,
      type,
      conditions,
      modifierType,
      modifierValue,
      priority: priority || 0
    });

    const savedRule = await rule.save();
    res.status(201).json(savedRule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a pricing rule (Admin)
const updatePricingRule = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const rule = await PricingRule.findByIdAndUpdate(id, updates, { new: true });

    if (!rule) {
      return res.status(404).json({ message: 'Pricing rule not found' });
    }

    res.json(rule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Toggle pricing rule active status (Admin)
const togglePricingRuleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const rule = await PricingRule.findById(id);

    if (!rule) {
      return res.status(404).json({ message: 'Pricing rule not found' });
    }

    rule.isActive = !rule.isActive;
    await rule.save();

    res.json(rule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getPricingRules,
  getAllPricingRules,
  createPricingRule,
  updatePricingRule,
  togglePricingRuleStatus
};
