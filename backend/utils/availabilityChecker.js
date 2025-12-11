const Booking = require('../models/Booking');
const Equipment = require('../models/Equipment');
const Coach = require('../models/Coach');

/**
 * Check if a court is available for the given time slot
 */
const checkCourtAvailability = async (courtId, startTime, endTime) => {
  const overlappingBooking = await Booking.findOne({
    court: courtId,
    status: 'confirmed',
    $or: [
      // New booking overlaps with existing booking
      {
        startTime: { $lt: endTime },
        endTime: { $gt: startTime }
      }
    ]
  });

  return !overlappingBooking;
};

/**
 * Check if a coach is available for the given time slot
 * Checks both the coach's schedule and existing bookings
 */
const checkCoachAvailability = async (coachId, startTime, endTime) => {
  if (!coachId) return true; // No coach selected

  const coach = await Coach.findById(coachId);
  if (!coach || !coach.isActive) return false;

  // Check if the time slot falls within coach's availability schedule
  const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][startTime.getDay()];
  const startHour = startTime.getHours();
  const startMinute = startTime.getMinutes();
  const endHour = endTime.getHours();
  const endMinute = endTime.getMinutes();

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

  if (!isWithinSchedule) return false;

  // Check if coach has another booking at this time
  const overlappingBooking = await Booking.findOne({
    'resources.coach': coachId,
    status: 'confirmed',
    $or: [
      {
        startTime: { $lt: endTime },
        endTime: { $gt: startTime }
      }
    ]
  });

  return !overlappingBooking;
};

/**
 * Check if equipment is available in sufficient quantity
 */
const checkEquipmentAvailability = async (equipmentRequests, startTime, endTime) => {
  // equipmentRequests: { rackets: 2, shoes: 1 }

  for (const [equipmentName, requestedQuantity] of Object.entries(equipmentRequests)) {
    if (requestedQuantity === 0) continue;

    // Get equipment details
    const equipment = await Equipment.findOne({ name: equipmentName, isActive: true });
    if (!equipment) return false;

    // Count how many of this equipment are already booked for this time slot
    const overlappingBookings = await Booking.find({
      status: 'confirmed',
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime }
        }
      ]
    });

    const bookedQuantity = overlappingBookings.reduce((sum, booking) => {
      return sum + (booking.resources[equipmentName] || 0);
    }, 0);

    const availableQuantity = equipment.totalStock - bookedQuantity;

    if (availableQuantity < requestedQuantity) {
      return false;
    }
  }

  return true;
};

/**
 * Check availability of all resources atomically
 */
const checkMultiResourceAvailability = async (courtId, coachId, equipmentRequests, startTime, endTime) => {
  const courtAvailable = await checkCourtAvailability(courtId, startTime, endTime);
  if (!courtAvailable) {
    return { available: false, reason: 'Court is not available for this time slot' };
  }

  const coachAvailable = await checkCoachAvailability(coachId, startTime, endTime);
  if (!coachAvailable) {
    return { available: false, reason: 'Coach is not available for this time slot' };
  }

  const equipmentAvailable = await checkEquipmentAvailability(equipmentRequests, startTime, endTime);
  if (!equipmentAvailable) {
    return { available: false, reason: 'Requested equipment is not available in sufficient quantity' };
  }

  return { available: true };
};

module.exports = {
  checkCourtAvailability,
  checkCoachAvailability,
  checkEquipmentAvailability,
  checkMultiResourceAvailability
};
