const Equipment = require('../models/Equipment');
const Booking = require('../models/Booking');

// Get all equipment with current availability
const getEquipment = async (req, res) => {
  try {
    const { startTime, endTime } = req.query;
    const equipment = await Equipment.find({ isActive: true });

    // Calculate availability for each equipment
    const equipmentWithAvailability = await Promise.all(
      equipment.map(async (item) => {
        let currentlyBooked = 0;

        if (startTime && endTime) {
          // Get bookings for the specific time slot
          const overlappingBookings = await Booking.find({
            status: 'confirmed',
            startTime: { $lt: new Date(endTime) },
            endTime: { $gt: new Date(startTime) }
          });

          currentlyBooked = overlappingBookings.reduce((sum, booking) => {
            // Use item.name to access the correct field (racket or shoes)
            return sum + (booking.resources[item.name] || 0);
          }, 0);
        } else {
          // Get current bookings (for backward compatibility)
          const now = new Date();
          const activeBookings = await Booking.find({
            status: 'confirmed',
            startTime: { $lte: now },
            endTime: { $gte: now }
          });

          currentlyBooked = activeBookings.reduce((sum, booking) => {
            return sum + (booking.resources[item.name] || 0);
          }, 0);
        }

        return {
          ...item.toObject(),
          currentlyAvailable: item.totalStock - currentlyBooked,
          currentlyBooked: currentlyBooked
        };
      })
    );

    res.json(equipmentWithAvailability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new equipment (Admin)
const createEquipment = async (req, res) => {
  try {
    const { name, totalStock, pricePerUnit } = req.body;

    const equipment = new Equipment({
      name,
      totalStock,
      pricePerUnit
    });

    const savedEquipment = await equipment.save();
    res.status(201).json(savedEquipment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update equipment (Admin)
const updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const equipment = await Equipment.findByIdAndUpdate(id, updates, { new: true });

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.json(equipment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getEquipment,
  createEquipment,
  updateEquipment
};
