const Boarding = require('../models/Boarding');
const Student = require('../models/Student');
const Trip = require('../models/Trip');

// @desc    Scan QR Code for boarding
// @route   POST /v1/boarding/scan-qr
// @access  Private/Driver
const scanQR = async (req, res, next) => {
  try {
    const { code, trip_id } = req.body;

    const student = await Student.findOne({ qr_code: code });

    if (!student) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Student not found for this QR code',
          status: 404
        }
      });
    }

    // Create or update boarding record
    let boarding = await Boarding.findOne({ student_id: student._id, trip_id });

    if (!boarding) {
       boarding = await Boarding.create({
         student_id: student._id,
         trip_id,
         status: 'onboard',
         boarding_time: new Date()
       });
    } else {
       boarding.status = 'onboard';
       boarding.boarding_time = new Date();
       await boarding.save();
    }

    // Update trip occupancy
    await Trip.findByIdAndUpdate(trip_id, { $inc: { passengers: 1 } });

    res.status(200).json({
      student_id: student._id,
      name: student.name,
      status: 'confirmed',
      boarding_time: boarding.boarding_time
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Confirm boarding from parent or student
// @route   POST /v1/boarding/:id/confirm
// @access  Private
const confirmBoarding = async (req, res, next) => {
  try {
     const boarding = await Boarding.findByIdAndUpdate(req.params.id, {
       status: 'confirmed'
     }, { new: true });

     if (!boarding) {
       return res.status(404).json({
         error: {
           code: 'NOT_FOUND',
           message: 'Boarding record not found',
           status: 404
         }
       });
     }

     res.status(200).json({ data: boarding });
  } catch (err) {
    next(err);
  }
};

module.exports = { scanQR, confirmBoarding };
