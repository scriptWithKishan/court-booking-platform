const express = require('express');
const router = express.Router();
const {
  getCourts,
  createCourt,
  updateCourt,
  toggleCourtStatus
} = require('../controllers/courtController');

// Public routes
router.get('/', getCourts);

// Admin routes
router.post('/', createCourt);
router.put('/:id', updateCourt);
router.patch('/:id/toggle', toggleCourtStatus);

module.exports = router;
