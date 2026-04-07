const express = require('express');
const { updateLocation, getLocation } = require('../controllers/locationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/:id/location', authorize('driver', 'operator', 'admin'), updateLocation);
router.get('/:id/location', getLocation);

module.exports = router;
