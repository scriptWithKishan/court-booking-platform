const Booking = require('../models/Booking');
const Court = require('../models/Court');
const Coach = require('../models/Coach');
const { checkMultiResourceAvailability } = require('../utils/availabilityChecker');
const { calculatePrice } = require('../utils/pricingCalculator');

// Get available slots for a specific date
const getAvailability = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Date parameter is required' });
    }

    const selectedDate = new Date(date);
    const courts = await Court.find({ isActive: true });

    // Generate time slots (8 AM to 10 PM, 1-hour slots)
    const timeSlots = [];
    for (let hour = 8; hour < 22; hour++) {
      const startTime = new Date(selectedDate);
      startTime.setHours(hour, 0, 0, 0);

      const endTime = new Date(selectedDate);
      endTime.setHours(hour + 1, 0, 0, 0);

      timeSlots.push({
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        hour: `${hour}:00 - ${hour + 1}:00`
      });
    }

    // Check availability for each court and time slot
    const availability = await Promise.all(
      courts.map(async (court) => {
        const slots = await Promise.all(
          timeSlots.map(async (slot) => {
            const existingBooking = await Booking.findOne({
              court: court._id,
              status: 'confirmed',
              startTime: { $lt: new Date(slot.endTime) },
              endTime: { $gt: new Date(slot.startTime) }
            });

            return {
              ...slot,
              available: !existingBooking
            };
          })
        );

        return {
          court: court,
          slots: slots
        };
      })
    );

    res.json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Calculate price for a booking without creating it
const calculateBookingPrice = async (req, res) => {
  try {
    const { courtId, coachId, resources, startTime, endTime } = req.body;

    const court = await Court.findById(courtId);
    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }

    let coach = null;
    if (coachId) {
      coach = await Coach.findById(coachId);
      if (!coach) {
        return res.status(404).json({ message: 'Coach not found' });
      }
    }

    const resourcesWithCoach = {
      ...resources,
      coach: coach
    };

    const pricing = await calculatePrice(
      court,
      resourcesWithCoach,
      new Date(startTime),
      new Date(endTime)
    );

    res.json(pricing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { courtId, coachId, resources, startTime, endTime } = req.body;
    const userId = req.user._id; // Get from authenticated user

    // Validate required fields
    if (!courtId || !startTime || !endTime) {
      return res.status(400).json({ message: 'Court, start time, and end time are required' });
    }

    const court = await Court.findById(courtId);
    if (!court || !court.isActive) {
      return res.status(404).json({ message: 'Court not found or inactive' });
    }

    let coach = null;
    if (coachId) {
      coach = await Coach.findById(coachId);
      if (!coach || !coach.isActive) {
        return res.status(404).json({ message: 'Coach not found or inactive' });
      }
    }

    // Check multi-resource availability
    const equipmentRequests = {
      racket: resources?.racket || 0,
      shoes: resources?.shoes || 0
    };

    const availabilityCheck = await checkMultiResourceAvailability(
      courtId,
      coachId,
      equipmentRequests,
      new Date(startTime),
      new Date(endTime)
    );

    if (!availabilityCheck.available) {
      return res.status(409).json({ message: availabilityCheck.reason });
    }

    // Calculate pricing
    const resourcesWithCoach = {
      racket: resources?.racket || 0,
      shoes: resources?.shoes || 0,
      coach: coach
    };

    const pricingBreakdown = await calculatePrice(
      court,
      resourcesWithCoach,
      new Date(startTime),
      new Date(endTime)
    );

    // Create booking
    const booking = new Booking({
      user: userId,
      court: courtId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      resources: {
        racket: resources?.racket || 0,
        shoes: resources?.shoes || 0,
        coach: coachId || null
      },
      status: 'confirmed',
      pricingBreakdown: pricingBreakdown,
      version: 0
    });

    const savedBooking = await booking.save();

    // Populate references for response
    await savedBooking.populate('user court resources.coach');

    res.status(201).json(savedBooking);
  } catch (error) {
    // Handle duplicate booking attempts (concurrency)
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Booking conflict. This slot may have just been booked.' });
    }
    res.status(400).json({ message: error.message });
  }
};

// Get user's bookings
const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({ user: userId })
      .populate('court')
      .populate('resources.coach')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings (Admin)
const getAllBookings = async (req, res) => {
  try {
    const { status, date } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (date) {
      const selectedDate = new Date(date);
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);

      query.startTime = {
        $gte: selectedDate,
        $lt: nextDay
      };
    }

    const bookings = await Booking.find(query)
      .populate('user')
      .populate('court')
      .populate('resources.coach')
      .sort({ startTime: 1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel a booking
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAvailability,
  calculateBookingPrice,
  createBooking,
  getUserBookings,
  getAllBookings,
  cancelBooking
};
