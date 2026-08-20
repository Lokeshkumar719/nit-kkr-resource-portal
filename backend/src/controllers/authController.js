const authService = require('../services/authService');

const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

const STATUS_CODES = require('../constants/statusCodes');

const authValidator = require('../validators/authValidator');

const clearAuthCookies = require('../utils/auth/clearAuthCookies');
const sendTokenResponse = require('../utils/auth/sendTokenResponse');

const register = asyncHandler(async (req, res) => {
  authValidator.validateRegister(req.body);

  const data = await authService.register(req.body);

  return new ApiResponse(res, STATUS_CODES.CREATED, 'OTP sent successfully.', data);
});

const verifyOTP = asyncHandler(async (req, res) => {
  authValidator.validateVerifyOTP(req.body);

  const { user, accessToken, refreshToken } = await authService.verifyOTP(req.body);

  return sendTokenResponse(res, STATUS_CODES.OK, 'Email verified successfully.', {
    user,
    accessToken,
    refreshToken,
  });
});

const resendOTP = asyncHandler(async (req, res) => {
  authValidator.validateResendOTP(req.body);

  const data = await authService.resendOTP(req.body);

  return new ApiResponse(res, STATUS_CODES.OK, 'OTP sent successfully.', data);
});

const login = asyncHandler(async (req, res) => {
  authValidator.validateLogin(req.body);

  const { user, accessToken, refreshToken } = await authService.login(req.body);

  return sendTokenResponse(res, STATUS_CODES.OK, 'Login successful.', {
    user,
    accessToken,
    refreshToken,
  });
});
// when access token expired then refresh token is used to renew the acess token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.refreshAccessToken(
    req.cookies.refreshToken
  );

  return sendTokenResponse(res, STATUS_CODES.OK, 'Access token refreshed successfully.', {
    user,
    accessToken,
    refreshToken,
  });
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user.id);

  clearAuthCookies(res);

  return new ApiResponse(res, STATUS_CODES.OK, 'Logout successful.');
});

// called when page refresh
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);

  return new ApiResponse(res, STATUS_CODES.OK, 'Current user fetched successfully.', user);
});

const forgotPassword = asyncHandler(async (req, res) => {
  authValidator.validateForgotPassword(req.body);

  const data = await authService.forgotPassword(req.body);

  return new ApiResponse(res, STATUS_CODES.OK, 'OTP sent successfully.', data);
});

const verifyForgotPasswordOTP = asyncHandler(async (req, res) => {
  authValidator.validateVerifyForgotPasswordOTP(req.body);

  const data = await authService.verifyForgotPasswordOTP(req.body);

  return new ApiResponse(res, STATUS_CODES.OK, 'OTP verified successfully.', data);
});

const resetPassword = asyncHandler(async (req, res) => {
  authValidator.validateResetPassword(req.body);

  await authService.resetPassword(req.body);

  return new ApiResponse(res, STATUS_CODES.OK, 'Password reset successfully. Please login again.');
});

const changePassword = asyncHandler(async (req, res) => {
  authValidator.validateChangePassword(req.body);

  await authService.changePassword({
    userId: req.user.id,
    ...req.body,
  });

  clearAuthCookies(res);

  return new ApiResponse(
    res,
    STATUS_CODES.OK,
    'Password changed successfully. Please login again.'
  );
});

module.exports = {
  register,
  verifyOTP,
  resendOTP,
  login,
  refreshAccessToken,
  logout,
  getCurrentUser,
  forgotPassword,
  verifyForgotPasswordOTP,
  resetPassword,
  changePassword,
};
