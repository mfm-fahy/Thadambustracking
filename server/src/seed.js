const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Vehicle = require('./models/Vehicle');
const Route = require('./models/Route');
const Student = require('./models/Student');
const connectDB = require('./config/db');

dotenv.config();

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Vehicle.deleteMany();
    await Route.deleteMany();
    await Student.deleteMany();

    console.log('Data cleared...');

    // Create Admin
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const driverPassword = await bcrypt.hash('driver123', salt);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@thadam.com',
      password: 'admin123', 
      role: 'admin',
      organization_id: 'org-1'
    });

    const driver = await User.create({
      name: 'John Driver',
      email: 'driver@thadam.com',
      password: 'driver123',
      role: 'driver',
      organization_id: 'org-1'
    });

    console.log('Users created...');

    const route = await Route.create({
      name: 'Downtown Route A',
      organization_id: 'org-1',
      start_point: { latitude: 40.7128, longitude: -74.006, address: 'Central Station, NYC' },
      end_point: { latitude: 40.7489, longitude: -73.9680, address: 'Tech Park, NYC' },
      waypoints: [{ latitude: 40.7200, longitude: -74.0000, address: 'Main St & 5th Ave' }],
      estimated_duration: 45,
      distance: 15.5,
      schedule: [{ day_of_week: 1, start_time: '08:00', end_time: '17:00', is_active: true }]
    });

    console.log('Route created...');

    const vehicle = await Vehicle.create({
      registration_number: 'TM-1001',
      name: 'Bus Route 5',
      type: 'bus',
      capacity: 50,
      driver_id: driver._id,
      organization_id: 'org-1',
      status: 'active'
    });

    console.log('Vehicle created...');

    const student = await Student.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
      school_id: 'school-1',
      organization_id: 'org-1',
      qr_code: 'STUDENT-JANE-123'
    });

    console.log('Student created...');
    console.log('Data Seeding Completed!');
  } catch (err) {
    console.error(`Seeding error: ${err.message}`);
  }
};

module.exports = seedData;

if (require.main === module) {
  (async () => {
    await connectDB();
    await seedData();
    process.exit();
  })();
}
