const { errorResponse } = require('../utils/apiResponse');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  if (status >= 500) {
    // Log server errors for troubleshooting
    console.error(err);
  }

  res.status(status).json(errorResponse(message));
};

module.exports = errorHandler;
