const express = require('express');
const { getStudentStatus, getStudentTrips } = require('../controllers/parentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/students/:id', authorize('parent', 'admin', 'operator'), getStudentStatus);
router.get('/students/:id/trips', authorize('parent', 'admin', 'operator'), getStudentTrips);

module.exports = router;
