const express = require('express');
const { getRoutes, getRoute, createRoute, updateRoute } = require('../controllers/routeController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getRoutes);
router.get('/:id', getRoute);
router.post('/', authorize('admin', 'operator'), createRoute);
router.put('/:id', authorize('admin', 'operator'), updateRoute);

module.exports = router;
