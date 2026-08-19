const authRepository = require('../repositories/authRepository');

const { verifyAccessToken } = require('../services/auth/tokenService');

const ApiError = require('../utils/ApiError');

const STATUS_CODES = require('../constants/statusCodes');

const authMiddleware = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return next(new ApiError(STATUS_CODES.UNAUTHORIZED, 'Access token is required.'));
  }

  const payload = verifyAccessToken(accessToken);

  const user = await authRepository.findUserById(payload.id);

  if (!user) {
    return next(new ApiError(STATUS_CODES.UNAUTHORIZED, 'User not found.'));
  }

  req.user = user;

  next();
};

module.exports = authMiddleware;
