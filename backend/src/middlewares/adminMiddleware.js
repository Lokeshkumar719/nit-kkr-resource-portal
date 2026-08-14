const USER_ROLE = require('../constants/roles');

const ApiError = require('../utils/ApiError');

const STATUS_CODES = require('../constants/statusCodes');

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== USER_ROLE.ADMIN) {
    return next(
      new ApiError(
        STATUS_CODES.FORBIDDEN,
        'Access denied.'
      )
    );
  }

  next();
};

module.exports = adminMiddleware;