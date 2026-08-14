const isProduction = process.env.NODE_ENV === 'production';

const accessTokenCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'strict',
  path: '/',
  maxAge: Number(process.env.ACCESS_COOKIE_MAX_AGE),
};

const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'strict',
  path: '/',
  maxAge: Number(process.env.REFRESH_COOKIE_MAX_AGE),
};

module.exports = {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
};