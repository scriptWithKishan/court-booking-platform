# Court Booking Platform

A full-stack multi-resource booking platform for sports facilities with dynamic pricing.

## Features

- **Multi-Resource Booking**: Book court + equipment + coach in a single atomic transaction
- **Dynamic Pricing Engine**: Configurable, stackable pricing rules (peak hours, weekends, court types)
- **Admin Dashboard**: Manage courts, equipment, coaches, and pricing rules
- **Real-time Availability**: Check availability across multiple resources
- **Booking Management**: View booking history and cancel bookings
- **Concurrency Handling**: Prevent double-bookings with optimistic locking

## Tech Stack

- **Backend**: Node.js + Express.js + MongoDB + Mongoose
- **Frontend**: React.js + Tailwind CSS + Axios + React Router

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- RESTful API

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/scriptWithKishan/court-booking-platform.git
cd court-booking-platform
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install express mongoose cors dotenv


# Edit .env and add your MongoDB Atlas URI
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/court-booking?retryWrites=true&w=majority
# PORT=5000
# NODE_ENV=development

# Seed the database
npm run seed

# Start the development server
npm run dev
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install axios react-router-dom date-fns react-icons
npm install -D tailwindcss@next

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## Seed Data

The seed script creates:

- **4 Courts**: 2 indoor ($30 base) + 2 outdoor ($20 base)
- **Equipment**: 10 rackets ($5 each) + 10 shoes ($3 each)
- **3 Coaches**: With different availability schedules and hourly rates
- **Pricing Rules**:
  - Peak Hours (6-9 PM): 1.5x multiplier
  - Weekend: +$10 fixed
  - Indoor Court: +$10 fixed
- **Sample Users**: 1 admin + 2 regular users

## API Endpoints

### Courts
- `GET /api/courts` - List all active courts
- `POST /api/courts` - Create court (Admin)
- `PUT /api/courts/:id` - Update court (Admin)
- `PATCH /api/courts/:id/toggle` - Toggle court status (Admin)

### Equipment
- `GET /api/equipment` - List equipment with availability
- `POST /api/equipment` - Create equipment (Admin)
- `PUT /api/equipment/:id` - Update equipment (Admin)

### Coaches
- `GET /api/coaches` - List all active coaches
- `POST /api/coaches` - Create coach (Admin)
- `PUT /api/coaches/:id` - Update coach (Admin)

### Pricing Rules
- `GET /api/pricing-rules` - List active rules
- `GET /api/pricing-rules/all` - List all rules (Admin)
- `POST /api/pricing-rules` - Create rule (Admin)
- `PUT /api/pricing-rules/:id` - Update rule (Admin)
- `PATCH /api/pricing-rules/:id/toggle` - Toggle rule status (Admin)

### Bookings
- `GET /api/bookings/availability?date=YYYY-MM-DD` - Get available slots
- `POST /api/bookings/calculate-price` - Calculate price without booking
- `POST /api/bookings` - Create booking
- `GET /api/bookings/user/:userId` - Get user's bookings
- `GET /api/bookings/all` - Get all bookings (Admin)
- `DELETE /api/bookings/:id` - Cancel booking

## Project Structure

```
court-booking-platform/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── bookingController.js
│   │   ├── coachController.js
│   │   ├── courtController.js
│   │   ├── equipmentController.js
│   │   └── pricingRuleController.js
│   ├── models/
│   │   ├── Booking.js
│   │   ├── Coach.js
│   │   ├── Court.js
│   │   ├── Equipment.js
│   │   ├── PricingRule.js
│   │   └── User.js
│   ├── routes/
│   │   ├── bookings.js
│   │   ├── coaches.js
│   │   ├── courts.js
│   │   ├── equipment.js
│   │   └── pricingRules.js
│   ├── scripts/
│   │   └── seedData.js
│   ├── utils/
│   │   ├── availabilityChecker.js
│   │   └── pricingCalculator.js
│   ├── .env.example
│   ├── app.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── context/
    │   └── App.jsx
    └── package.json
```


## Future Enhancements

- Email notifications for bookings
- Waitlist system for fully booked slots
- Payment integration
- Mobile app
- Recurring bookings
- Coach ratings and reviews
- Complete Admin Dashboard

