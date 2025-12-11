import { FaCheckCircle, FaStar } from 'react-icons/fa';
import { MdSportsBasketball } from 'react-icons/md';
import { BsBuilding, BsTree } from 'react-icons/bs';

const CourtSelector = ({ courts, selectedCourt, onCourtSelect }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg">
            <MdSportsBasketball className="text-white text-xl" />
          </div>
          Select Court
        </h3>
        <span className="text-sm text-gray-500">{courts.length} courts available</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courts.map((court) => {
          const isSelected = selectedCourt?._id === court._id;
          const isIndoor = court.type === 'indoor';

          return (
            <button
              key={court._id}
              onClick={() => onCourtSelect(court)}
              className={`
                relative overflow-hidden rounded-2xl border-3 transition-all duration-300 text-left group
                ${isSelected
                  ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-purple-50 shadow-2xl scale-105'
                  : 'border-gray-200 hover:border-blue-400 hover:shadow-xl bg-white hover:scale-102'
                }
              `}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: isIndoor
                    ? 'linear-gradient(45deg, #3b82f6 25%, transparent 25%, transparent 75%, #3b82f6 75%, #3b82f6), linear-gradient(45deg, #3b82f6 25%, transparent 25%, transparent 75%, #3b82f6 75%, #3b82f6)'
                    : 'radial-gradient(circle, #10b981 1px, transparent 1px)',
                  backgroundSize: isIndoor ? '20px 20px' : '15px 15px',
                  backgroundPosition: isIndoor ? '0 0, 10px 10px' : '0 0'
                }}></div>
              </div>

              {/* Selection Badge */}
              {isSelected && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <FaCheckCircle className="text-white text-xl" />
                  </div>
                </div>
              )}

              <div className="relative p-6">
                {/* Court Type Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${isIndoor
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                    : 'bg-gradient-to-br from-green-500 to-emerald-600'
                  }`}>
                  {isIndoor ? (
                    <BsBuilding className="text-white text-2xl" />
                  ) : (
                    <BsTree className="text-white text-2xl" />
                  )}
                </div>

                {/* Court Name */}
                <h4 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                  {court.name}
                </h4>

                {/* Court Type Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={`
                    inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold
                    ${isIndoor
                      ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                      : 'bg-green-100 text-green-800 border-2 border-green-300'
                    }
                  `}>
                    {isIndoor ? '🏠 Indoor Court' : '🌳 Outdoor Court'}
                  </span>
                </div>

                {/* Pricing */}
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ${court.basePrice}
                  </span>
                  <span className="text-gray-600 text-lg">/hour</span>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  {isIndoor && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaStar className="text-yellow-500" />
                      <span className="font-medium">Premium indoor facility</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaCheckCircle className="text-green-500" />
                    <span>Professional equipment available</span>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className={`
                  absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300
                  ${isSelected ? 'opacity-100' : ''}
                `}></div>
              </div>

              {/* Bottom Accent Bar */}
              <div className={`
                h-2 w-full transition-all duration-300
                ${isSelected
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                  : isIndoor
                    ? 'bg-gradient-to-r from-blue-400 to-indigo-500 opacity-50 group-hover:opacity-100'
                    : 'bg-gradient-to-r from-green-400 to-emerald-500 opacity-50 group-hover:opacity-100'
                }
              `}></div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CourtSelector;
