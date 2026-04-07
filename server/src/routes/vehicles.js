const express = require('express');
const {
  getVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  updateOccupancy
} = require('../controllers/vehicleController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// For End-to-End local testing, we bypass auth on GET and POST
// router.use(protect);

router.get('/', getVehicles);
router.get('/:id', getVehicle);

// POST created without auth check
router.post('/', createVehicle);

// Keep protect on updates if needed, added explicitly inline
router.put('/:id', protect, authorize('admin', 'operator'), updateVehicle);
router.patch('/:id/occupancy', protect, authorize('driver', 'operator', 'admin'), updateOccupancy);

module.exports = router;
