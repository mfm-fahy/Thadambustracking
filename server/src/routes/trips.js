const express = require('express');
const {
  getCurrentTrips,
  getTrip,
  createTrip,
  updateTripStatus,
  getETA
} = require('../controllers/tripController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/current', getCurrentTrips);
router.get('/:id', getTrip);
router.get('/:id/eta', getETA);
router.post('/', authorize('operator', 'admin'), createTrip);
router.patch('/:id', authorize('driver', 'operator', 'admin'), updateTripStatus);

module.exports = router;
