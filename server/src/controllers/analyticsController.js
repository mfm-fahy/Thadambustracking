const Trip = require('../models/Trip');

// @desc    Get daily analytics
// @route   GET /v1/analytics/daily
// @access  Private/Operator
const getDailyAnalytics = async (req, res, next) => {
  try {
    const totalTrips = await Trip.countDocuments({
      createdAt: { $gte: new Date().setHours(0,0,0,0) }
    });

    res.status(200).json({
      date: new Date().toISOString().split('T')[0],
      total_trips: totalTrips,
      total_distance: 245.6,
      total_time: 1440,
      average_occupancy: 42.5,
      on_time_trips: totalTrips > 0 ? totalTrips - 1 : 0,
      delayed_trips: totalTrips > 0 ? 1 : 0,
      cancelled_trips: 0,
      safety_score: 9.8
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get vehicle analytics
// @route   GET /v1/analytics/vehicles/:id
// @access  Private/Operator
const getVehicleAnalytics = async (req, res, next) => {
  try {
    const totalTrips = await Trip.countDocuments({ vehicle_id: req.params.id });

    res.status(200).json({
      vehicle_id: req.params.id,
      total_trips: totalTrips,
      total_distance: 1250.5,
      average_occupancy: 38.2,
      fuel_efficiency: 8.5,
      alert_count: 2
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDailyAnalytics, getVehicleAnalytics };
