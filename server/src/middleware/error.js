const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message,
        status: 404
      }
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message,
        status: 400
      }
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message,
        status: 400
      }
    });
  }

  res.status(error.status || 500).json({
    error: {
      code: error.code || 'SERVER_ERROR',
      message: error.message || 'Server Error',
      status: error.status || 500
    }
  });
};

module.exports = errorHandler;
