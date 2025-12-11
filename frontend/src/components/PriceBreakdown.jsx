import { FaDollarSign, FaFire, FaCalendarWeek, FaHome } from 'react-icons/fa';
import { GiTennisRacket, GiRunningShoe } from 'react-icons/gi';
import { FaUserTie } from 'react-icons/fa';

const PriceBreakdown = ({ pricing, loading }) => {
  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-8">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!pricing) {
    return (
      <div className="card">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaDollarSign className="text-primary-600" />
          Price Breakdown
        </h3>
        <p className="text-gray-600 text-center py-4">
          Select a court and time slot to see pricing
        </p>
      </div>
    );
  }

  const items = [
    {
      label: 'Base Price',
      amount: pricing.basePrice,
      icon: <FaDollarSign className="text-blue-600" />,
      show: true
    },
    {
      label: 'Peak Hour Fee',
      amount: pricing.peakHourFee,
      icon: <FaFire className="text-orange-600" />,
      show: pricing.peakHourFee > 0
    },
    {
      label: 'Weekend Surcharge',
      amount: pricing.weekendFee,
      icon: <FaCalendarWeek className="text-purple-600" />,
      show: pricing.weekendFee > 0
    },
    {
      label: 'Indoor Court Premium',
      amount: pricing.courtTypeFee,
      icon: <FaHome className="text-green-600" />,
      show: pricing.courtTypeFee > 0
    },
    {
      label: 'Equipment Rental',
      amount: pricing.equipmentFee,
      icon: <GiTennisRacket className="text-indigo-600" />,
      show: pricing.equipmentFee > 0
    },
    {
      label: 'Coach Fee',
      amount: pricing.coachFee,
      icon: <FaUserTie className="text-teal-600" />,
      show: pricing.coachFee > 0
    }
  ];

  return (
    <div className="card">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <FaDollarSign className="text-primary-600" />
        Price Breakdown
      </h3>

      <div className="space-y-3 mb-4">
        {items.filter(item => item.show).map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-fade-in"
          >
            <div className="flex items-center gap-2">
              {item.icon}
              <span className="text-gray-700 font-medium">{item.label}</span>
            </div>
            <span className="font-bold text-gray-800">
              ${item.amount.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t-2 border-gray-200 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-800">Total</span>
          <div className="text-right">
            <div className="text-3xl font-bold text-gradient animate-slide-up">
              ${pricing.total.toFixed(2)}
            </div>
            <p className="text-sm text-gray-600">for 1 hour</p>
          </div>
        </div>
      </div>

      {(pricing.peakHourFee > 0 || pricing.weekendFee > 0) && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            💡 <strong>Tip:</strong> Book during off-peak hours for better rates!
          </p>
        </div>
      )}
    </div>
  );
};

export default PriceBreakdown;
