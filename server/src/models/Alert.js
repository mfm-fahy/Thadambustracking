const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  vehicle_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  trip_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip'
  },
  alert_type: {
    type: String,
    enum: [
      'route_deviation',
      'speed_violation',
      'occupancy_full',
      'sos',
      'emergency_contact',
      'vehicle_breakdown',
      'delayed_arrival'
    ],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  location: {
    latitude: Number,
    longitude: Number
  },
  is_resolved: {
    type: Boolean,
    default: false
  },
  resolved_at: {
    type: Date
  },
  resolved_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Alert', alertSchema);
