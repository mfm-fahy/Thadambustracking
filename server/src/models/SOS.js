const mongoose = require('mongoose');

const sosSchema = new mongoose.Schema({
  vehicle_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  trip_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  initiator_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  initiator_type: {
    type: String,
    enum: ['student', 'driver'],
    required: true
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  status: {
    type: String,
    enum: ['pending', 'acknowledged', 'responded', 'resolved'],
    default: 'pending'
  },
  responder_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  notes: {
    type: String
  },
  resolved_at: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SOS', sosSchema);
