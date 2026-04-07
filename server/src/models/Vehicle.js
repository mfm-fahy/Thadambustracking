const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  registration_number: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['bus', 'van', 'car'],
    default: 'bus'
  },
  capacity: {
    type: Number,
    required: true
  },
  current_occupancy: {
    type: Number,
    default: 0
  },
  occupancy_status: {
    type: String,
    enum: ['empty', 'moderate', 'full'],
    default: 'empty'
  },
  driver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organization_id: {
    type: String,
    required: true
  },
  last_location: {
    latitude: Number,
    longitude: Number,
    accuracy: Number,
    speed: Number,
    heading: Number,
    timestamp: Date
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
