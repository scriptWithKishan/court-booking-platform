const Court = require('../models/Court');

// Get all active courts
const getCourts = async (req, res) => {
  try {
    const courts = await Court.find({ isActive: true });
    res.json(courts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new court (Admin)
const createCourt = async (req, res) => {
  try {
    const { name, type, basePrice } = req.body;

    const court = new Court({
      name,
      type,
      basePrice
    });

    const savedCourt = await court.save();
    res.status(201).json(savedCourt);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a court (Admin)
const updateCourt = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const court = await Court.findByIdAndUpdate(id, updates, { new: true });

    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }

    res.json(court);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Toggle court active status (Admin)
const toggleCourtStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const court = await Court.findById(id);

    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }

    court.isActive = !court.isActive;
    await court.save();

    res.json(court);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getCourts,
  createCourt,
  updateCourt,
  toggleCourtStatus
};
