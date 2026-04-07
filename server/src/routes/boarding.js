const express = require('express');
const { scanQR, confirmBoarding } = require('../controllers/boardingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/scan-qr', authorize('driver', 'operator', 'admin'), scanQR);
router.post('/:id/confirm', confirmBoarding);

module.exports = router;
