const createResponse = require('../utils/responseFormatter');

const notFound = (req, res) => {
  res.status(404).json(createResponse(false, `Route ${req.originalUrl} not found`));
};

module.exports = notFound;