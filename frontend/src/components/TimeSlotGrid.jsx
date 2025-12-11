import { FaClock, FaFire, FaCheckCircle, FaBan } from 'react-icons/fa';

const TimeSlotGrid = ({ slots, selectedSlot, onSlotSelect }) => {
  const isPeakHour = (hour) => {
    const hourNum = parseInt(hour.split(':')[0]);
    return hourNum >= 18 && hourNum < 21;
  };

  const getTimeOfDay = (hour) => {
    const hourNum = parseInt(hour.split(':')[0]);
    if (hourNum >= 6 && hourNum < 12) return 'morning';
    if (hourNum >= 12 && hourNum < 17) return 'afternoon';
    if (hourNum >= 17 && hourNum < 21) return 'evening';
    return 'night';
  };

  const timeOfDayColors = {
    morning: 'from-amber-50 to-orange-50 border-amber-200',
    afternoon: 'from-blue-50 to-cyan-50 border-blue-200',
    evening: 'from-purple-50 to-pink-50 border-purple-200',
    night: 'from-indigo-50 to-slate-50 border-indigo-200'
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <FaClock className="text-white text-xl" />
          </div>
          Select Time Slot
        </h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Booked</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {slots.map((slot) => {
          const timeOfDay = getTimeOfDay(slot.hour);
          const isPeak = isPeakHour(slot.hour);
          const isSelected = selectedSlot?.hour === slot.hour;
          const isAvailable = slot.available;

          return (
            <button
              key={slot.hour}
              onClick={() => isAvailable && onSlotSelect(slot)}
              disabled={!isAvailable}
              className={`
                relative overflow-hidden rounded-xl border-2 transition-all duration-300 transform
                ${isSelected
                  ? 'border-blue-600 bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl scale-105 -translate-y-1'
                  : isAvailable
                    ? `bg-gradient-to-br ${timeOfDayColors[timeOfDay]} hover:shadow-xl hover:scale-105 hover:-translate-y-1`
                    : 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-60'
                }
              `}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}></div>
              </div>

              <div className="relative p-5">
                {/* Time Display */}
                <div className={`text-center mb-3 ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                  <div className="text-2xl font-bold mb-1">
                    {slot.hour.split(' - ')[0]}
                  </div>
                  <div className="text-xs opacity-75">
                    {slot.hour.split(' - ')[1]}
                  </div>
                </div>

                {/* Status Indicators */}
                <div className="flex flex-col gap-2">
                  {isPeak && isAvailable && (
                    <div className={`flex items-center justify-center gap-1 text-xs font-semibold ${isSelected ? 'text-yellow-200' : 'text-orange-600'
                      }`}>
                      <FaFire className="animate-pulse" />
                      <span>Peak Hour</span>
                    </div>
                  )}

                  {isSelected && (
                    <div className="flex items-center justify-center gap-1 text-xs font-semibold text-white">
                      <FaCheckCircle />
                      <span>Selected</span>
                    </div>
                  )}

                  {!isAvailable && (
                    <div className="flex items-center justify-center gap-1 text-xs font-semibold text-red-600">
                      <FaBan />
                      <span>Booked</span>
                    </div>
                  )}
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <FaCheckCircle className="text-blue-600 text-sm" />
                    </div>
                  </div>
                )}

                {/* Shine Effect on Hover */}
                {isAvailable && !isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20 transition-opacity duration-500 transform -skew-x-12"></div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {slots.every(slot => !slot.available) && (
        <div className="mt-6 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl text-center">
          <div className="text-4xl mb-3">😔</div>
          <p className="text-yellow-900 font-semibold text-lg mb-2">
            All Slots Booked
          </p>
          <p className="text-yellow-700 text-sm">
            Please select another date to see available time slots
          </p>
        </div>
      )}
    </div>
  );
};

export default TimeSlotGrid;
