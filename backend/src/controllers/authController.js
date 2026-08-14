const authService = require("../services/authService");

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const STATUS_CODES = require("../constants/statusCodes");

const {
  validateRegister,
  validateVerifyOTP,
  validateResendOTP,
  validateLogin,
} = require("../validators/authValidator");

const clearAuthCookies = require("../utils/auth/clearAuthCookies");
const sendTokenResponse = require("../utils/auth/sendTokenResponse");

const register = asyncHandler(async (req, res) => {
  validateRegister(req.body);

  const data = await authService.register(req.body);

  return new ApiResponse(
    res,
    STATUS_CODES.CREATED,
    "OTP sent successfully.",
    data,
  );
});

const verifyOTP = asyncHandler(async (req, res) => {
  validateVerifyOTP(req.body);

  const { user, accessToken, refreshToken } = await authService.verifyOTP(
    req.body,
  );

  return sendTokenResponse(
    res,
    STATUS_CODES.OK,
    "Email verified successfully.",
    {
      user,
      accessToken,
      refreshToken,
    },
  );
});

const resendOTP = asyncHandler(async (req, res) => {
  validateResendOTP(req.body);

  const data = await authService.resendOTP(req.body);

  return new ApiResponse(res, STATUS_CODES.OK, "OTP sent successfully.", data);
});

const login = asyncHandler(async (req, res) => {
  validateLogin(req.body);

  const { user, accessToken, refreshToken } = await authService.login(req.body);

  return sendTokenResponse(res, STATUS_CODES.OK, "Login successful.", {
    user,
    accessToken,
    refreshToken,
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } =
    await authService.refreshAccessToken(req.cookies.refreshToken);

  return sendTokenResponse(
    res,
    STATUS_CODES.OK,
    "Access token refreshed successfully.",
    {
      user,
      accessToken,
      refreshToken,
    },
  );
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user.id);

  clearAuthCookies(res);

  return new ApiResponse(res, STATUS_CODES.OK, "Logout successful.");
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);

  return new ApiResponse(
    res,
    STATUS_CODES.OK,
    "Current user fetched successfully.",
    user,
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
};
