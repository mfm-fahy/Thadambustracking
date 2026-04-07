const express = require('express');
const { sendSOS, getActiveSOS, resolveSOS } = require('../controllers/sosController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', sendSOS);
router.get('/active', authorize('operator', 'admin'), getActiveSOS);
router.patch('/:id/resolve', authorize('operator', 'admin'), resolveSOS);

module.exports = router;
