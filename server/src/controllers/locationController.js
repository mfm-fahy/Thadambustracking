const Vehicle = require('../models/Vehicle');
const Alert = require('../models/Alert');

// @desc    Update vehicle location
// @route   POST /v1/vehicles/:id/location
// @access  Private/Driver
const updateLocation = async (req, res, next) => {
  try {
    const { latitude, longitude, accuracy, speed, heading } = req.body;
    const timestamp = new Date();

    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, {
      $set: {
        last_location: {
          latitude,
          longitude,
          accuracy,
          speed,
          heading,
          timestamp
        }
      }
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

    // Logic for route deviation or speed violation could go here
    if (speed > 80) { // Example threshold
       await Alert.create({
         vehicle_id: vehicle._id,
         alert_type: 'speed_violation',
         severity: 'high',
         message: `Vehicle ${vehicle.registration_number} is overspeeding at ${speed} km/h`,
         location: { latitude, longitude }
       });
    }

    res.status(200).json({
      id: `loc-${Date.now()}`,
      vehicle_id: vehicle._id,
      latitude,
      longitude,
      accuracy,
      speed,
      heading,
      timestamp,
      created_at: timestamp
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get vehicle current location
// @route   GET /v1/vehicles/:id/location
// @access  Private
const getLocation = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle || !vehicle.last_location) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Location data not found for this vehicle',
          status: 404
        }
      });
    }
    res.status(200).json({ data: vehicle.last_location });
  } catch (err) {
    next(err);
  }
};

module.exports = { updateLocation, getLocation };
