import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FaCheckCircle, FaSpinner, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import DatePicker from '../components/DatePicker';
import TimeSlotGrid from '../components/TimeSlotGrid';
import CourtSelector from '../components/CourtSelector';
import ResourceSelector from '../components/ResourceSelector';
import PriceBreakdown from '../components/PriceBreakdown';
import AuthModal from '../components/AuthModal';
import {
  fetchCourts,
  fetchEquipment,
  fetchCoaches,
  checkAvailability,
  calculatePrice,
  createBooking
} from '../services/api';

const BookingPage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedResources, setSelectedResources] = useState({
    racket: 0,
    shoes: 0,
    coach: null
  });

  const [courts, setCourts] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [pricing, setPricing] = useState(null);

  const [loading, setLoading] = useState(false);
  const [pricingLoading, setPricingLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        console.log('Fetching initial data...');
        const [courtsData, equipmentData, coachesData] = await Promise.all([
          fetchCourts(),
          fetchEquipment(),
          fetchCoaches()
        ]);
        console.log('Courts loaded:', courtsData);
        console.log('Equipment loaded:', equipmentData);
        console.log('Coaches loaded:', coachesData);
        setCourts(courtsData);
        setEquipment(equipmentData);
        setCoaches(coachesData);
      } catch (err) {
        setError('Failed to load data. Please refresh the page.');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch availability when date or court changes
  useEffect(() => {
    if (selectedDate && selectedCourt) {
      fetchAvailabilityData();
    }
  }, [selectedDate, selectedCourt]);

  // Calculate price when selections change
  useEffect(() => {
    if (selectedCourt && selectedSlot) {
      calculatePricing();
    }
  }, [selectedCourt, selectedSlot, selectedResources]);

  // Fetch equipment and coaches with availability when slot is selected
  useEffect(() => {
    if (selectedSlot) {
      fetchResourcesForSlot();
    }
  }, [selectedSlot]);

  const fetchResourcesForSlot = async () => {
    try {
      const [equipmentData, coachesData] = await Promise.all([
        fetchEquipment(selectedSlot.startTime, selectedSlot.endTime),
        fetchCoaches(selectedSlot.startTime, selectedSlot.endTime)
      ]);
      console.log('Equipment for slot:', equipmentData);
      console.log('Coaches for slot:', coachesData);
      setEquipment(equipmentData);
      setCoaches(coachesData);
    } catch (err) {
      console.error('Failed to fetch resources for slot:', err);
    }
  };

  const fetchAvailabilityData = async () => {
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const availabilityData = await checkAvailability(dateStr);

      // Find availability for selected court
      const courtAvailability = availabilityData.find(
        a => a.court._id === selectedCourt._id
      );

      if (courtAvailability) {
        setAvailability(courtAvailability.slots);
      }
    } catch (err) {
      console.error('Failed to fetch availability:', err);
    }
  };

  const calculatePricing = async () => {
    try {
      setPricingLoading(true);
      const bookingData = {
        courtId: selectedCourt._id,
        coachId: selectedResources.coach,
        resources: {
          rackets: selectedResources.racket || 0,
          shoes: selectedResources.shoes || 0
        },
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime
      };

      const pricingData = await calculatePrice(bookingData);
      setPricing(pricingData);
    } catch (err) {
      console.error('Failed to calculate price:', err);
    } finally {
      setPricingLoading(false);
    }
  };

  const handleBooking = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    try {
      setBookingLoading(true);
      setError(null);

      const bookingData = {
        courtId: selectedCourt._id,
        coachId: selectedResources.coach,
        resources: {
          rackets: selectedResources.racket || 0,
          shoes: selectedResources.shoes || 0
        },
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime
      };

      await createBooking(bookingData);
      setSuccess(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setSelectedSlot(null);
        setSelectedCourt(null);
        setSelectedResources({ racket: 0, shoes: 0, coach: null });
        setPricing(null);
        setSuccess(false);
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
      console.error('Booking error:', err);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleAuthSuccess = () => {
    // After successful auth, proceed with booking
    setShowAuthModal(false);
    handleBooking();
  };

  const canBook = selectedDate && selectedSlot && selectedCourt && pricing;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-3">
              Book Your Court
            </h1>
            <p className="text-gray-600 text-lg">
              Select your preferred date, time, and resources
            </p>
          </div>

          {/* User Info / Login Button */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-md border-2 border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <FaUser className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="Logout"
              >
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              Login / Sign Up
            </button>
          )}
        </div>

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-6 bg-green-50 border-2 border-green-500 rounded-xl animate-slide-up">
            <div className="flex items-center gap-3 text-green-800">
              <FaCheckCircle className="text-3xl" />
              <div>
                <h3 className="font-bold text-lg">Booking Confirmed!</h3>
                <p>Your court has been successfully booked.</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-6 bg-red-50 border-2 border-red-500 rounded-xl">
            <div className="text-red-800">
              <h3 className="font-bold text-lg mb-1">Booking Failed</h3>
              <p>{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Booking Steps */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Date Selection */}
            <DatePicker
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />

            {/* Step 2: Court Selection */}
            {selectedDate && (
              <>
                <CourtSelector
                  courts={courts}
                  selectedCourt={selectedCourt}
                  onCourtSelect={setSelectedCourt}
                />
                {courts.length === 0 && !loading && (
                  <div className="p-6 bg-yellow-50 border-2 border-yellow-300 rounded-xl text-center">
                    <p className="text-yellow-900 font-semibold text-lg mb-2">
                      ⚠️ No Courts Available
                    </p>
                    <p className="text-yellow-700">
                      Please make sure the backend server is running and the database has been seeded.
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Step 3: Time Slot Selection */}
            {selectedDate && selectedCourt && availability.length > 0 && (
              <TimeSlotGrid
                slots={availability}
                selectedSlot={selectedSlot}
                onSlotSelect={setSelectedSlot}
              />
            )}

            {/* Step 4: Resources Selection - Show after selecting court and slot */}
            {selectedCourt && selectedSlot && (
              <ResourceSelector
                equipment={equipment}
                coaches={coaches}
                selectedResources={selectedResources}
                onResourceChange={setSelectedResources}
              />
            )}
          </div>

          {/* Right Column - Price Breakdown & Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <PriceBreakdown
                pricing={pricing}
                loading={pricingLoading}
              />

              {canBook && (
                <button
                  onClick={handleBooking}
                  disabled={bookingLoading}
                  className="btn-primary w-full cursor-pointer mt-4 text-lg py-4 shadow-lg"
                >
                  {bookingLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <FaSpinner className="animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <FaCheckCircle />
                      Confirm Booking
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
