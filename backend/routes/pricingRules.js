const express = require('express');
const router = express.Router();
const {
  getPricingRules,
  getAllPricingRules,
  createPricingRule,
  updatePricingRule,
  togglePricingRuleStatus
} = require('../controllers/pricingRuleController');

// Public routes
router.get('/', getPricingRules);

// Admin routes
router.get('/all', getAllPricingRules);
router.post('/', createPricingRule);
router.put('/:id', updatePricingRule);
router.patch('/:id/toggle', togglePricingRuleStatus);

module.exports = router;
