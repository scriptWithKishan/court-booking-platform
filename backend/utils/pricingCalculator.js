const PricingRule = require('../models/PricingRule');
const Equipment = require('../models/Equipment');

/**
 * Calculate the total price for a booking
 * @param {Object} court - Court object with basePrice and type
 * @param {Object} resources - { rackets: number, shoes: number, coach: coachObject }
 * @param {Date} startTime - Booking start time
 * @param {Date} endTime - Booking end time
 * @returns {Object} - Detailed pricing breakdown
 */
const calculatePrice = async (court, resources, startTime, endTime) => {
  // Initialize pricing breakdown
  const breakdown = {
    basePrice: court.basePrice,
    peakHourFee: 0,
    weekendFee: 0,
    courtTypeFee: 0,
    equipmentFee: 0,
    coachFee: 0,
    total: 0
  };

  // Fetch all active pricing rules sorted by priority
  const pricingRules = await PricingRule.find({ isActive: true }).sort({ priority: 1 });

  let currentPrice = court.basePrice;

  // Apply pricing rules
  for (const rule of pricingRules) {
    if (rule.type === 'peak_hour') {
      // Check if booking time falls within peak hours
      const hour = startTime.getHours();
      const { startHour, endHour } = rule.conditions;

      if (hour >= startHour && hour < endHour) {
        if (rule.modifierType === 'multiplier') {
          const additionalFee = currentPrice * (rule.modifierValue - 1);
          breakdown.peakHourFee += additionalFee;
          currentPrice += additionalFee;
        } else if (rule.modifierType === 'fixed') {
          breakdown.peakHourFee += rule.modifierValue;
          currentPrice += rule.modifierValue;
        }
      }
    } else if (rule.type === 'weekend') {
      // Check if booking is on weekend (Saturday = 6, Sunday = 0)
      const dayOfWeek = startTime.getDay();

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        if (rule.modifierType === 'multiplier') {
          const additionalFee = currentPrice * (rule.modifierValue - 1);
          breakdown.weekendFee += additionalFee;
          currentPrice += additionalFee;
        } else if (rule.modifierType === 'fixed') {
          breakdown.weekendFee += rule.modifierValue;
          currentPrice += rule.modifierValue;
        }
      }
    } else if (rule.type === 'court_type') {
      // Check if court type matches rule condition
      const { courtType } = rule.conditions;

      if (court.type === courtType) {
        if (rule.modifierType === 'multiplier') {
          const additionalFee = currentPrice * (rule.modifierValue - 1);
          breakdown.courtTypeFee += additionalFee;
          currentPrice += additionalFee;
        } else if (rule.modifierType === 'fixed') {
          breakdown.courtTypeFee += rule.modifierValue;
          currentPrice += rule.modifierValue;
        }
      }
    }
  }

  // Calculate equipment fees
  if (resources.rackets > 0) {
    const racketEquipment = await Equipment.findOne({ name: 'racket', isActive: true });
    if (racketEquipment) {
      breakdown.equipmentFee += resources.rackets * racketEquipment.pricePerUnit;
    }
  }

  if (resources.shoes > 0) {
    const shoesEquipment = await Equipment.findOne({ name: 'shoes', isActive: true });
    if (shoesEquipment) {
      breakdown.equipmentFee += resources.shoes * shoesEquipment.pricePerUnit;
    }
  }

  // Calculate coach fee (hourly rate)
  if (resources.coach) {
    const durationInHours = (endTime - startTime) / (1000 * 60 * 60);
    breakdown.coachFee = resources.coach.pricePerHour * durationInHours;
  }

  // Calculate total
  breakdown.total = currentPrice + breakdown.equipmentFee + breakdown.coachFee;

  return breakdown;
};

module.exports = {
  calculatePrice
};
