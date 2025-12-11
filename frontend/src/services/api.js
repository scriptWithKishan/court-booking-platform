import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication
export const signup = async (userData) => {
  const response = await api.post('/auth/signup', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.put('/auth/profile', data);
  return response.data;
};

// Courts
export const fetchCourts = async () => {
  const response = await api.get('/courts');
  return response.data;
};

export const createCourt = async (courtData) => {
  const response = await api.post('/courts', courtData);
  return response.data;
};

export const updateCourt = async (id, courtData) => {
  const response = await api.put(`/courts/${id}`, courtData);
  return response.data;
};

export const toggleCourtStatus = async (id) => {
  const response = await api.patch(`/courts/${id}/toggle`);
  return response.data;
};

// Equipment
export const fetchEquipment = async (startTime = null, endTime = null) => {
  const params = {};
  if (startTime && endTime) {
    params.startTime = startTime;
    params.endTime = endTime;
  }
  const response = await api.get('/equipment', { params });
  return response.data;
};

export const createEquipment = async (equipmentData) => {
  const response = await api.post('/equipment', equipmentData);
  return response.data;
};

export const updateEquipment = async (id, equipmentData) => {
  const response = await api.put(`/equipment/${id}`, equipmentData);
  return response.data;
};

// Coaches
export const fetchCoaches = async (startTime = null, endTime = null) => {
  const params = {};
  if (startTime && endTime) {
    params.startTime = startTime;
    params.endTime = endTime;
  }
  const response = await api.get('/coaches', { params });
  return response.data;
};

export const createCoach = async (coachData) => {
  const response = await api.post('/coaches', coachData);
  return response.data;
};

export const updateCoach = async (id, coachData) => {
  const response = await api.put(`/coaches/${id}`, coachData);
  return response.data;
};

// Pricing Rules
export const fetchPricingRules = async () => {
  const response = await api.get('/pricing-rules');
  return response.data;
};

export const fetchAllPricingRules = async () => {
  const response = await api.get('/pricing-rules/all');
  return response.data;
};

export const createPricingRule = async (ruleData) => {
  const response = await api.post('/pricing-rules', ruleData);
  return response.data;
};

export const updatePricingRule = async (id, ruleData) => {
  const response = await api.put(`/pricing-rules/${id}`, ruleData);
  return response.data;
};

export const togglePricingRuleStatus = async (id) => {
  const response = await api.patch(`/pricing-rules/${id}/toggle`);
  return response.data;
};

// Bookings
export const checkAvailability = async (date) => {
  const response = await api.get(`/bookings/availability?date=${date}`);
  return response.data;
};

export const calculatePrice = async (bookingData) => {
  const response = await api.post('/bookings/calculate-price', bookingData);
  return response.data;
};

export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

export const fetchUserBookings = async (userId) => {
  const response = await api.get(`/bookings/user/${userId}`);
  return response.data;
};

export const fetchAllBookings = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await api.get(`/bookings/all?${params}`);
  return response.data;
};

export const cancelBooking = async (id) => {
  const response = await api.delete(`/bookings/${id}`);
  return response.data;
};

export default api;
