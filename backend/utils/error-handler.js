const dotenv = require('dotenv');
dotenv.config();

module.exports = (err, req, res, next) => {
  console.log('error-handler.js:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.DEV === 'dev' ? err.stack : undefined
  });
};
