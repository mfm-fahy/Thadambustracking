const SOS = require('../models/SOS');
const Alert = require('../models/Alert');

// @desc    Send SOS
// @route   POST /v1/sos
// @access  Private
const sendSOS = async (req, res, next) => {
  try {
    const { vehicle_id, trip_id, initiator_type, location } = req.body;

    const sos = await SOS.create({
      vehicle_id,
      trip_id,
      initiator_id: req.user._id,
      initiator_type,
      location,
      status: 'pending'
    });

    // Automatically create a critical alert
    await Alert.create({
      vehicle_id,
      trip_id,
      alert_type: 'sos',
      severity: 'critical',
      message: `SOS Emergency requested by ${initiator_type}`,
      location
    });

    res.status(201).json({ data: sos });
  } catch (err) {
    next(err);
  }
};

// @desc    Get active SOS
// @route   GET /v1/sos/active
// @access  Private/Operator
const getActiveSOS = async (req, res, next) => {
  try {
    const sosRequests = await SOS.find({ status: { $ne: 'resolved' } })
      .populate('vehicle_id')
      .populate('initiator_id', 'name phone');

    res.status(200).json({ data: sosRequests });
  } catch (err) {
    next(err);
  }
};

// @desc    Resolve SOS
// @route   PATCH /v1/sos/:id/resolve
// @access  Private/Operator
const resolveSOS = async (req, res, next) => {
  try {
    const { notes } = req.body;
    const sos = await SOS.findByIdAndUpdate(req.params.id, {
      status: 'resolved',
      notes,
      resolved_at: new Date()
    }, { new: true });

    if (!sos) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'SOS request not found',
          status: 404
        }
      });
    }

    res.status(200).json({ data: sos });
  } catch (err) {
    next(err);
  }
};

module.exports = { sendSOS, getActiveSOS, resolveSOS };
