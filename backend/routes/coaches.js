const express = require('express');
const router = express.Router();
const {
  getCoaches,
  createCoach,
  updateCoach
} = require('../controllers/coachController');

// Public routes
router.get('/', getCoaches);

// Admin routes
router.post('/', createCoach);
router.put('/:id', updateCoach);

module.exports = router;
