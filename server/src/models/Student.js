const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  school_id: {
    type: String,
    required: true
  },
  organization_id: {
    type: String,
    required: true
  },
  parent_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  qr_code: {
    type: String,
    unique: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);
