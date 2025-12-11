const express = require('express');
const router = express.Router();
const {
  getEquipment,
  createEquipment,
  updateEquipment
} = require('../controllers/equipmentController');

// Public routes
router.get('/', getEquipment);

// Admin routes
router.post('/', createEquipment);
router.put('/:id', updateEquipment);

module.exports = router;
