const Vehicle = require('../models/Vehicle');

// @desc    List all vehicles
// @route   GET /v1/vehicles
// @access  Private
const getVehicles = async (req, res, next) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    const query = {};
    if (status) query.status = status;

    const vehicles = await Vehicle.find(query)
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .sort({ createdAt: -1 });

    const total = await Vehicle.countDocuments(query);

    res.status(200).json({
      data: vehicles,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single vehicle details
// @route   GET /v1/vehicles/:id
// @access  Private
const getVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Vehicle not found',
          status: 404
        }
      });
    }
    res.status(200).json({ data: vehicle });
  } catch (err) {
    next(err);
  }
};

// @desc    Create vehicle
// @route   POST /v1/vehicles
// @access  Public (temporarily for E2E testing)
const createVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.create({
      ...req.body,
      organization_id: req.user?.organization_id || 'org-1',
      driver_id: req.user?._id || '60c72b2f9b1d8b001c8e4b3e' // Dummy MongoDB ID object
    });
    res.status(201).json({ data: vehicle });
  } catch (err) {
    next(err);
  }
};

// @desc    Update vehicle
// @route   PUT /v1/vehicles/:id
// @access  Private/Admin
const updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!vehicle) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Vehicle not found',
          status: 404
        }
      });
    }
    res.status(200).json({ data: vehicle });
  } catch (err) {
    next(err);
  }
};

// @desc    Update occupancy status
// @route   PATCH /v1/vehicles/:id/occupancy
// @access  Private/Driver
const updateOccupancy = async (req, res, next) => {
  try {
    const { occupancy_status, current_occupancy } = req.body;
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, {
      occupancy_status,
      current_occupancy
    }, {
      new: true,
      runValidators: true
    });
    if (!vehicle) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Vehicle not found',
          status: 404
        }
      });
    }
    res.status(200).json({ data: vehicle });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  updateOccupancy
};
