const { errorResponse } = require('../utils/apiResponse');

const notFound = (req, res, next) => {
  res.status(404).json(errorResponse(`Route ${req.originalUrl} not found`));
};

module.exports = notFound;
