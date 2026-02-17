const { successResponse, errorResponse } = require('../utils/responseFormatter');

const error400 = (req, res) => {
  return errorResponse(res, 400, 'Bad Request - This is a simulated 400 error');
};

const error401 = (req, res) => {
  return errorResponse(res, 401, 'Unauthorized - This is a simulated 401 error');
};

const error403 = (req, res) => {
  return errorResponse(res, 403, 'Forbidden - This is a simulated 403 error');
};

const error404 = (req, res) => {
  return errorResponse(res, 404, 'Not Found - This is a simulated 404 error');
};

const error500 = (req, res) => {
  return errorResponse(res, 500, 'Internal Server Error - This is a simulated 500 error');
};

const delayedResponse = async (req, res) => {
  const ms = Math.min(parseInt(req.query.ms) || 2000, 10000); // Max 10 seconds
  
  await new Promise(resolve => setTimeout(resolve, ms));
  
  return successResponse(res, 200, { 
    message: `Response delayed by ${ms}ms`,
    delayMs: ms,
  });
};

module.exports = {
  error400,
  error401,
  error403,
  error404,
  error500,
  delayedResponse,
};
