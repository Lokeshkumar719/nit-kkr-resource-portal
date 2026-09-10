const authRepository = require('../repositories/authRepository');

const { verifyAccessToken } = require('../services/auth/tokenService');
const { isAccessTokenBlacklisted } = require('../services/auth/sessionService');

const ApiError = require('../utils/ApiError');

const STATUS_CODES = require('../constants/statusCodes');

const authMiddleware = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return next(new ApiError(STATUS_CODES.UNAUTHORIZED, 'Access token is required.'));
  }

  const payload = verifyAccessToken(accessToken);

  // Check if the token has been revoked (e.g., after logout or password change).
  // Fail-open: if Redis is down, allow the request rather than locking out users.
  try {
    const blacklisted = await isAccessTokenBlacklisted(accessToken);
    if (blacklisted) {
      return next(new ApiError(STATUS_CODES.UNAUTHORIZED, 'Token has been revoked.'));
    }
  } catch (error) {
    console.error('[authMiddleware] Blacklist check failed (fail-open):', error);
  }

  const user = await authRepository.findUserById(payload.id);

  if (!user) {
    return next(new ApiError(STATUS_CODES.UNAUTHORIZED, 'User not found.'));
  }

  req.user = user;

  next();
};

module.exports = authMiddleware;

