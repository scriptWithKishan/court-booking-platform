import { FaPlus, FaMinus, FaUserTie, FaStar, FaCheckCircle, FaBan } from 'react-icons/fa';
import { GiTennisRacket, GiRunningShoe } from 'react-icons/gi';
import { MdSportsTennis } from 'react-icons/md';

const ResourceSelector = ({
  equipment,
  coaches,
  selectedResources,
  onResourceChange
}) => {
  const handleEquipmentChange = (equipmentName, delta) => {
    const current = selectedResources[equipmentName] || 0;
    const newValue = Math.max(0, current + delta);

    const equipmentItem = equipment.find(e => e.name === equipmentName);
    if (equipmentItem && newValue <= equipmentItem.currentlyAvailable) {
      onResourceChange({ ...selectedResources, [equipmentName]: newValue });
    }
  };

  const handleCoachChange = (coachId) => {
    onResourceChange({
      ...selectedResources,
      coach: selectedResources.coach === coachId ? null : coachId
    });
  };

  const racketEquipment = equipment.find(e => e.name === 'racket');
  const shoesEquipment = equipment.find(e => e.name === 'shoes');

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
          <MdSportsTennis className="text-white text-xl" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">
          Add Resources <span className="text-gray-500 text-lg font-normal">(Optional)</span>
        </h3>
      </div>

      {/* Equipment Section */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <GiTennisRacket className="text-purple-600 text-xl" />
          Equipment Rental
        </h4>

        <div className="space-y-4">
          {/* Rackets */}
          {racketEquipment && (
            <div className={`
              relative overflow-hidden rounded-xl border-2 transition-all duration-300
              ${(selectedResources.racket || 0) > 0
                ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-purple-300'
              }
            `}>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <GiTennisRacket className="text-white text-2xl" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-lg">Tennis Rackets</p>
                      <p className="text-sm text-gray-600">
                        ${racketEquipment.pricePerUnit} each •
                        <span className={`ml-1 font-semibold ${racketEquipment.currentlyAvailable > 5 ? 'text-green-600' :
                            racketEquipment.currentlyAvailable > 0 ? 'text-orange-600' : 'text-red-600'
                          }`}>
                          {racketEquipment.currentlyAvailable} available
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEquipmentChange('racket', -1)}
                      disabled={(selectedResources.racket || 0) === 0}
                      className="w-10 h-10 rounded-lg bg-white border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                    >
                      <FaMinus className="mx-auto text-purple-600" />
                    </button>
                    <div className="w-16 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center border-2 border-purple-300">
                      <span className="font-bold text-2xl text-purple-700">
                        {selectedResources.racket || 0}
                      </span>
                    </div>
                    <button
                      onClick={() => handleEquipmentChange('racket', 1)}
                      disabled={(selectedResources.racket || 0) >= racketEquipment.currentlyAvailable}
                      className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 border-2 border-purple-600 hover:from-purple-600 hover:to-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                    >
                      <FaPlus className="mx-auto text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Shoes */}
          {shoesEquipment && (
            <div className={`
              relative overflow-hidden rounded-xl border-2 transition-all duration-300
              ${(selectedResources.shoes || 0) > 0
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-blue-300'
              }
            `}>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                      <GiRunningShoe className="text-white text-2xl" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-lg">Sports Shoes</p>
                      <p className="text-sm text-gray-600">
                        ${shoesEquipment.pricePerUnit} each •
                        <span className={`ml-1 font-semibold ${shoesEquipment.currentlyAvailable > 5 ? 'text-green-600' :
                            shoesEquipment.currentlyAvailable > 0 ? 'text-orange-600' : 'text-red-600'
                          }`}>
                          {shoesEquipment.currentlyAvailable} available
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEquipmentChange('shoes', -1)}
                      disabled={(selectedResources.shoes || 0) === 0}
                      className="w-10 h-10 rounded-lg bg-white border-2 border-blue-300 hover:border-blue-500 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                    >
                      <FaMinus className="mx-auto text-blue-600" />
                    </button>
                    <div className="w-16 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center border-2 border-blue-300">
                      <span className="font-bold text-2xl text-blue-700">
                        {selectedResources.shoes || 0}
                      </span>
                    </div>
                    <button
                      onClick={() => handleEquipmentChange('shoes', 1)}
                      disabled={(selectedResources.shoes || 0) >= shoesEquipment.currentlyAvailable}
                      className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 border-2 border-blue-600 hover:from-blue-600 hover:to-cyan-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                    >
                      <FaPlus className="mx-auto text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Coaches Section */}
      <div>
        <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <FaUserTie className="text-teal-600 text-xl" />
          Professional Coach
        </h4>

        <div className="space-y-3">
          {coaches.map((coach) => {
            const isSelected = selectedResources.coach === coach._id;
            const isAvailable = coach.isAvailableForSlot !== false;

            return (
              <button
                key={coach._id}
                onClick={() => isAvailable && handleCoachChange(coach._id)}
                disabled={!isAvailable}
                className={`
                  w-full relative overflow-hidden rounded-xl border-2 transition-all duration-300 text-left group
                  ${!isAvailable
                    ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-60'
                    : isSelected
                      ? 'border-teal-600 bg-gradient-to-br from-teal-50 to-emerald-50 shadow-xl scale-102'
                      : 'border-gray-200 hover:border-teal-400 hover:shadow-lg bg-white'
                  }
                `}
              >
                {/* Background Pattern */}
                {isAvailable && (
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'linear-gradient(45deg, #14b8a6 25%, transparent 25%, transparent 75%, #14b8a6 75%, #14b8a6), linear-gradient(45deg, #14b8a6 25%, transparent 25%, transparent 75%, #14b8a6 75%, #14b8a6)',
                      backgroundSize: '15px 15px',
                      backgroundPosition: '0 0, 7.5px 7.5px'
                    }}></div>
                  </div>
                )}

                <div className="relative p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Coach Avatar */}
                      <div className={`
                        w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold
                        ${!isAvailable
                          ? 'bg-gray-300 text-gray-500'
                          : isSelected
                            ? 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white'
                            : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700 group-hover:from-teal-400 group-hover:to-emerald-500 group-hover:text-white'
                        }
                        transition-all duration-300
                      `}>
                        {coach.name.charAt(0)}
                      </div>

                      <div>
                        <p className={`font-bold text-lg mb-1 ${!isAvailable
                            ? 'text-gray-500'
                            : isSelected ? 'text-teal-700' : 'text-gray-800 group-hover:text-teal-600'
                          } transition-colors`}>
                          {coach.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className={`text-2xl font-bold ${!isAvailable
                              ? 'text-gray-500'
                              : 'bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent'
                            }`}>
                            ${coach.pricePerHour}
                          </span>
                          <span className="text-gray-600 text-sm">/hour</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={`text-xs ${!isAvailable ? 'text-gray-400' : 'text-yellow-400'}`} />
                          ))}
                          <span className="text-xs text-gray-600 ml-1">Professional</span>
                        </div>

                        {/* Availability Status */}
                        {!isAvailable && coach.reason && (
                          <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-red-100 border border-red-300 rounded-full text-xs font-semibold text-red-700">
                            <FaBan className="text-xs" />
                            {coach.reason}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {isSelected && isAvailable && (
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                          <FaCheckCircle className="text-white text-2xl" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Accent */}
                {isAvailable && (
                  <div className={`
                    h-1.5 w-full transition-all duration-300
                    ${isSelected
                      ? 'bg-gradient-to-r from-teal-600 to-emerald-600'
                      : 'bg-gradient-to-r from-teal-400 to-emerald-500 opacity-0 group-hover:opacity-100'
                    }
                  `}></div>
                )}
              </button>
            );
          })}
        </div>

        {coaches.length === 0 && (
          <div className="p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl text-center">
            <FaUserTie className="mx-auto text-4xl text-gray-400 mb-2" />
            <p className="text-gray-600">No coaches available at this time</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceSelector;
