const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  organization_id: {
    type: String,
    required: true
  },
  start_point: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true }
  },
  end_point: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true }
  },
  waypoints: [{
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true }
  }],
  estimated_duration: {
    type: Number, // in minutes
    required: true
  },
  distance: {
    type: Number, // in kilometers
    required: true
  },
  schedule: [{
    day_of_week: { type: Number, required: true }, // 0-6
    start_time: { type: String, required: true }, // HH:mm
    end_time: { type: String, required: true },
    is_active: { type: Boolean, default: true }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Route', routeSchema);
