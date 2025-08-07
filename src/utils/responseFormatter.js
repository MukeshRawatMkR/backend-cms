/**
 * Creates a standardized API response format
 * @param {boolean} success - Whether the operation was successful
 * @param {string} message - Response message
 * @param {*} data - Response data (optional)
 * @param {Array} errors - Array of error objects (optional)
 * @param {Object} meta - Additional metadata (optional)
 * @returns {Object} Formatted response object
 */
const createResponse = (success, message, data = null, errors = [], meta = {}) => {
  const response = {
    success,
    message,
    timestamp: new Date().toISOString()
  };

  if (data !== null) {
    response.data = data;
  }

  if (errors && errors.length > 0) {
    response.errors = errors;
  }

  if (meta && Object.keys(meta).length > 0) {
    response.meta = meta;
  }

  return response;
};

module.exports = createResponse;