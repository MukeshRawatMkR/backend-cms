/**
 * Get pagination options from query parameters
 * @param {Object} queryParams - Query parameters from request
 * @returns {Object} Pagination options
 */
const getPaginationOptions = (queryParams) => {
  const page = parseInt(queryParams.page) || 1;
  const limit = parseInt(queryParams.limit) || 10;
  
  // Ensure limit is within acceptable bounds
  const maxLimit = 100;
  const finalLimit = Math.min(limit, maxLimit);
  
  const skip = (page - 1) * finalLimit;

  return {
    page,
    limit: finalLimit,
    skip
  };
};

/**
 * Create paginated result object
 * @param {Array} data - The data array
 * @param {number} total - Total number of items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Paginated result
 */
const getPaginatedResult = (data, total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? page + 1 : null,
      prevPage: hasPrevPage ? page - 1 : null
    }
  };
};

module.exports = {
  getPaginationOptions,
  getPaginatedResult
};