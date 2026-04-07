const Student = require('../models/Student');
const Trip = require('../models/Trip');
const Alert = require('../models/Alert');

// @desc    Get student current status for parent
// @route   GET /v1/parent-portal/students/:id
// @access  Private/Parent
const getStudentStatus = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('parent_ids', 'name phone');

    if (!student) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Student not found',
          status: 404
        }
      });
    }

    // Find current trip for this student
    const currentTrip = await Trip.findOne({
      status: 'in_progress'
      // In a real app, we'd link student to route/trip
    }).populate('vehicle_id').populate('route_id');

    res.status(200).json({
      student_id: student._id,
      name: student.name,
      current_trip: currentTrip || null,
      boarding_status: 'confirmed',
      alerts: [],
      last_drop_off: new Date()
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get student historical trips
// @route   GET /v1/parent-portal/students/:id/trips
// @access  Private/Parent
const getStudentTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find({ status: 'completed' })
      .limit(10)
      .populate('vehicle_id')
      .populate('route_id');

    res.status(200).json({ data: trips });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStudentStatus, getStudentTrips };
