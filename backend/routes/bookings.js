const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAvailability,
  calculateBookingPrice,
  createBooking,
  getUserBookings,
  getAllBookings,
  cancelBooking
} = require('../controllers/bookingController');

// Public routes
router.get('/availability', getAvailability);
router.post('/calculate-price', calculateBookingPrice);

// Protected routes (require authentication)
router.post('/', auth, createBooking);
router.get('/user/:userId', auth, getUserBookings);
router.get('/all', auth, getAllBookings);
router.delete('/:id', auth, cancelBooking);

module.exports = router;
