const Trip = require('../models/Trip');

// @desc    Get current trips
// @route   GET /v1/trips/current
// @access  Private
const getCurrentTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find({ status: 'in_progress' })
      .populate('vehicle_id')
      .populate('route_id')
      .populate('driver_id', 'name');
    res.status(200).json({ data: trips });
  } catch (err) {
    next(err);
  }
};

// @desc    Get trip details
// @route   GET /v1/trips/:id
// @access  Private
const getTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('vehicle_id')
      .populate('route_id')
      .populate('driver_id', 'name');

    if (!trip) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Trip not found',
          status: 404
        }
      });
    }
    res.status(200).json({ data: trip });
  } catch (err) {
    next(err);
  }
};

// @desc    Create trip
// @route   POST /v1/trips
// @access  Private/Operator
const createTrip = async (req, res, next) => {
  try {
    const trip = await Trip.create({
       ...req.body,
       estimated_end_time: req.body.estimated_end_time || new Date(Date.now() + 45 * 60 * 1000)
    });
    res.status(201).json({ data: trip });
  } catch (err) {
    next(err);
  }
};

// @desc    Update trip status
// @route   PATCH /v1/trips/:id
// @access  Private/Driver
const updateTripStatus = async (req, res, next) => {
  try {
    const { status, actual_end_time, current_waypoint_index } = req.body;
    const update = { status };
    if (actual_end_time) update.actual_end_time = actual_end_time;
    if (current_waypoint_index !== undefined) update.current_waypoint_index = current_waypoint_index;

    const trip = await Trip.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true
    });

    if (!trip) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Trip not found',
          status: 404
        }
      });
    }
    res.status(200).json({ data: trip });
  } catch (err) {
    next(err);
  }
};

// @desc    Get trip ETA
// @route   GET /v1/trips/:id/eta
// @access  Private
const getETA = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Trip not found',
          status: 404
        }
      });
    }

    // Example ETA logic
    res.status(200).json({
      trip_id: trip._id,
      current_waypoint_index: trip.current_waypoint_index,
      remaining_distance: 5.2, // Simulated
      estimated_arrival_time: trip.estimated_end_time,
      updated_at: new Date()
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCurrentTrips, getTrip, createTrip, updateTripStatus, getETA };
