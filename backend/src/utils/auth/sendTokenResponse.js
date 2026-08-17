const { accessTokenCookieOptions, refreshTokenCookieOptions } = require('./cookieOptions');

const sendTokenResponse = (res, statusCode, message, { user, accessToken, refreshToken }) => {
  res.cookie('accessToken', accessToken, accessTokenCookieOptions);

  res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

  return res.status(statusCode).json({
    success: true,
    message,
    data: {
      _id: user._id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    },
  });
};

module.exports = sendTokenResponse;
