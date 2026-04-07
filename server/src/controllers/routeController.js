const Route = require('../models/Route');

// @desc    List all routes
// @route   GET /v1/routes
// @access  Private
const getRoutes = async (req, res, next) => {
  try {
    const { active_only, organization_id } = req.query;
    const query = {};
    if (organization_id) query.organization_id = organization_id;
    if (active_only === 'true') {
      query.schedule = { $elemMatch: { is_active: true } };
    }

    const routes = await Route.find(query).sort({ createdAt: -1 });
    res.status(200).json({ data: routes });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single route details
// @route   GET /v1/routes/:id
// @access  Private
const getRoute = async (req, res, next) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Route not found',
          status: 404
        }
      });
    }
    res.status(200).json({ data: route });
  } catch (err) {
    next(err);
  }
};

// @desc    Create route
// @route   POST /v1/routes
// @access  Private/Admin
const createRoute = async (req, res, next) => {
  try {
    const route = await Route.create({
      ...req.body,
      organization_id: req.user.organization_id
    });
    res.status(201).json({ data: route });
  } catch (err) {
    next(err);
  }
};

// @desc    Update route
// @route   PUT /v1/routes/:id
// @access  Private/Admin
const updateRoute = async (req, res, next) => {
  try {
    const route = await Route.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!route) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Route not found',
          status: 404
        }
      });
    }
    res.status(200).json({ data: route });
  } catch (err) {
    next(err);
  }
};

module.exports = { getRoutes, getRoute, createRoute, updateRoute };
