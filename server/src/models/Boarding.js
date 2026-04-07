const mongoose = require('mongoose');

const boardingSchema = new mongoose.Schema({
  trip_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'boarding', 'onboard', 'dropped_off'],
    default: 'pending'
  },
  boarding_time: {
    type: Date
  },
  drop_off_time: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Boarding', boardingSchema);
