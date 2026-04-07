const express = require('express');
const { getDailyAnalytics, getVehicleAnalytics } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'operator'));

router.get('/daily', getDailyAnalytics);
router.get('/vehicles/:id', getVehicleAnalytics);

module.exports = router;
