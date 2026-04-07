const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

const seedData = require('./seed');

// Load environment variables
dotenv.config();

// Connect to Database
const initialize = async () => {
  await connectDB();
  if (process.env.DB_TYPE === 'mock') {
    await seedData();
  }
};
initialize();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Thadam API' });
});

// Import Routes
const authRoutes = require('./routes/auth');
const vehicleRoutes = require('./routes/vehicles');
const locationRoutes = require('./routes/locations');
const routeRoutes = require('./routes/routes');
const tripRoutes = require('./routes/trips');
const boardingRoutes = require('./routes/boarding');
const sosRoutes = require('./routes/sos');
const parentRoutes = require('./routes/parent');
const analyticsRoutes = require('./routes/analytics');

// Use Routes
app.use('/v1/auth', authRoutes);
app.use('/v1/vehicles', vehicleRoutes);
app.use('/v1/locations', locationRoutes);
app.use('/v1/routes', routeRoutes);
app.use('/v1/trips', tripRoutes);
app.use('/v1/boarding', boardingRoutes);
app.use('/v1/sos', sosRoutes);
app.use('/v1/parent-portal', parentRoutes);
app.use('/v1/analytics', analyticsRoutes);

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
});
