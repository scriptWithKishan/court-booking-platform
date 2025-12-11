require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/database');

// Import models
const Court = require('../models/Court');
const Equipment = require('../models/Equipment');
const Coach = require('../models/Coach');
const PricingRule = require('../models/PricingRule');
const User = require('../models/User');

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await Court.deleteMany({});
    await Equipment.deleteMany({});
    await Coach.deleteMany({});
    await PricingRule.deleteMany({});
    await User.deleteMany({});

    // Create Courts
    console.log('Creating courts...');
    const courts = await Court.insertMany([
      {
        name: 'Indoor Court 1',
        type: 'indoor',
        basePrice: 30,
        isActive: true
      },
      {
        name: 'Indoor Court 2',
        type: 'indoor',
        basePrice: 30,
        isActive: true
      },
      {
        name: 'Outdoor Court 1',
        type: 'outdoor',
        basePrice: 20,
        isActive: true
      },
      {
        name: 'Outdoor Court 2',
        type: 'outdoor',
        basePrice: 20,
        isActive: true
      }
    ]);
    console.log(`Created ${courts.length} courts`);

    // Create Equipment
    console.log('Creating equipment...');
    const equipment = await Equipment.insertMany([
      {
        name: 'racket',
        totalStock: 10,
        pricePerUnit: 5,
        isActive: true
      },
      {
        name: 'shoes',
        totalStock: 10,
        pricePerUnit: 3,
        isActive: true
      }
    ]);
    console.log(`Created ${equipment.length} equipment types`);

    // Create Coaches
    console.log('Creating coaches...');
    const coaches = await Coach.insertMany([
      {
        name: 'John Smith',
        pricePerHour: 20,
        availability: [
          { day: 'Monday', startTime: '09:00', endTime: '17:00' },
          { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
          { day: 'Friday', startTime: '09:00', endTime: '17:00' }
        ],
        isActive: true
      },
      {
        name: 'Sarah Johnson',
        pricePerHour: 25,
        availability: [
          { day: 'Tuesday', startTime: '10:00', endTime: '18:00' },
          { day: 'Thursday', startTime: '10:00', endTime: '18:00' },
          { day: 'Saturday', startTime: '08:00', endTime: '16:00' }
        ],
        isActive: true
      },
      {
        name: 'Mike Davis',
        pricePerHour: 30,
        availability: [
          { day: 'Monday', startTime: '18:00', endTime: '21:00' },
          { day: 'Tuesday', startTime: '18:00', endTime: '21:00' },
          { day: 'Wednesday', startTime: '18:00', endTime: '21:00' },
          { day: 'Thursday', startTime: '18:00', endTime: '21:00' },
          { day: 'Friday', startTime: '18:00', endTime: '21:00' }
        ],
        isActive: true
      }
    ]);
    console.log(`Created ${coaches.length} coaches`);

    // Create Pricing Rules
    console.log('Creating pricing rules...');
    const pricingRules = await PricingRule.insertMany([
      {
        name: 'Peak Hours',
        type: 'peak_hour',
        conditions: { startHour: 18, endHour: 21 },
        modifierType: 'multiplier',
        modifierValue: 1.5,
        priority: 1,
        isActive: true
      },
      {
        name: 'Weekend Surcharge',
        type: 'weekend',
        conditions: {},
        modifierType: 'fixed',
        modifierValue: 10,
        priority: 2,
        isActive: true
      },
      {
        name: 'Indoor Court Premium',
        type: 'court_type',
        conditions: { courtType: 'indoor' },
        modifierType: 'fixed',
        modifierValue: 10,
        priority: 3,
        isActive: true
      }
    ]);
    console.log(`Created ${pricingRules.length} pricing rules`);

    // Create Sample Users
    console.log('Creating sample users...');

    // Hash password for all users (using 'password123' for testing)
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@courtbooking.com',
        password: hashedPassword,
        role: 'admin'
      },
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: hashedPassword,
        role: 'user'
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: hashedPassword,
        role: 'user'
      }
    ]);
    console.log(`Created ${users.length} users`);

    console.log('\n✅ Seed data created successfully!');
    console.log('\nSummary:');
    console.log(`- ${courts.length} courts (2 indoor @ $30, 2 outdoor @ $20)`);
    console.log(`- ${equipment.length} equipment types (10 rackets @ $5, 10 shoes @ $3)`);
    console.log(`- ${coaches.length} coaches with different availability`);
    console.log(`- ${pricingRules.length} pricing rules (peak hours, weekend, indoor premium)`);
    console.log(`- ${users.length} users (1 admin, 2 regular users)`);
    console.log('\n🔐 Test Login Credentials:');
    console.log('   Email: admin@courtbooking.com | Password: password123');
    console.log('   Email: john.doe@example.com | Password: password123');
    console.log('   Email: jane.smith@example.com | Password: password123');
    console.log('\nYou can now start the server with: npm run dev');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
