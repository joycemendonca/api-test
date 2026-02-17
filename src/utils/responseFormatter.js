const successResponse = (res, statusCode, data, message = null) => {
  const response = {
    success: true,
    data,
  };
  
  if (message) {
    response.message = message;
  }
  
  return res.status(statusCode).json(response);
};

const errorResponse = (res, statusCode, error, message = null) => {
  const response = {
    success: false,
    error,
  };
  
  if (message) {
    response.message = message;
  }
  
  return res.status(statusCode).json(response);
};

module.exports = {
  successResponse,
  errorResponse,
};
