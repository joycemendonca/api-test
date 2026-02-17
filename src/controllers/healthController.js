const { successResponse } = require('../utils/responseFormatter');

const startTime = Date.now();

const healthCheck = (req, res) => {
  const uptime = Math.floor((Date.now() - startTime) / 1000); // in seconds
  
  return successResponse(res, 200, {
    status: 'OK',
    uptime: `${uptime} seconds`,
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  healthCheck,
};
