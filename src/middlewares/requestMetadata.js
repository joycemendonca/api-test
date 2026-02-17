const { v4: uuidv4 } = require('uuid');

const requestMetadata = (req, res, next) => {
  // Generate unique request ID
  const requestId = uuidv4();
  
  // Add request ID to request object for potential logging
  req.requestId = requestId;
  
  // Set response headers
  res.setHeader('X-Request-ID', requestId);
  res.setHeader('X-App-Version', '1.0.0');
  
  next();
};

module.exports = requestMetadata;
