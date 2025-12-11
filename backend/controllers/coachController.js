const Coach = require('../models/Coach');
const Booking = require('../models/Booking');

// Get all active coaches with availability check
const getCoaches = async (req, res) => {
  try {
    const { startTime, endTime } = req.query;
    const coaches = await Coach.find({ isActive: true });

    if (startTime && endTime) {
      // Filter coaches by availability for the specific time slot
      const start = new Date(startTime);
      const end = new Date(endTime);
      const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][start.getDay()];
      const startHour = start.getHours();
      const startMinute = start.getMinutes();
      const endHour = end.getHours();
      const endMinute = end.getMinutes();

      const availableCoaches = await Promise.all(
        coaches.map(async (coach) => {
          // Check if time slot falls within coach's schedule
          const isWithinSchedule = coach.availability.some(slot => {
            if (slot.day !== dayOfWeek) return false;

            const [slotStartHour, slotStartMinute] = slot.startTime.split(':').map(Number);
            const [slotEndHour, slotEndMinute] = slot.endTime.split(':').map(Number);

            const slotStartInMinutes = slotStartHour * 60 + slotStartMinute;
            const slotEndInMinutes = slotEndHour * 60 + slotEndMinute;
            const bookingStartInMinutes = startHour * 60 + startMinute;
            const bookingEndInMinutes = endHour * 60 + endMinute;

            return bookingStartInMinutes >= slotStartInMinutes && bookingEndInMinutes <= slotEndInMinutes;
          });

          if (!isWithinSchedule) {
            return { ...coach.toObject(), isAvailableForSlot: false, reason: 'Not in schedule' };
          }

          // Check if coach has another booking at this time
          const overlappingBooking = await Booking.findOne({
            'resources.coach': coach._id,
            status: 'confirmed',
            startTime: { $lt: end },
            endTime: { $gt: start }
          });

          return {
            ...coach.toObject(),
            isAvailableForSlot: !overlappingBooking,
            reason: overlappingBooking ? 'Already booked' : null
          };
        })
      );

      res.json(availableCoaches);
    } else {
      // Return all coaches without availability check
      const coachesWithFlag = coaches.map(coach => ({
        ...coach.toObject(),
        isAvailableForSlot: true
      }));
      res.json(coachesWithFlag);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new coach (Admin)
const createCoach = async (req, res) => {
  try {
    const { name, pricePerHour, availability } = req.body;

    const coach = new Coach({
      name,
      pricePerHour,
      availability
    });

    const savedCoach = await coach.save();
    res.status(201).json(savedCoach);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a coach (Admin)
const updateCoach = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const coach = await Coach.findByIdAndUpdate(id, updates, { new: true });

    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    res.json(coach);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getCoaches,
  createCoach,
  updateCoach
};
