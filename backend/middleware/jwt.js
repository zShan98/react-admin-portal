const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const decoded = jwt.verify(authorization.split(" ")[1], process.env.JWT_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    next({
      statusCode: 401,
      message: 'Auth failed.'
    });
  }
};
