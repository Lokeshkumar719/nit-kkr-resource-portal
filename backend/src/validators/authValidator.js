const validator = require("validator");

const ApiError = require("../utils/ApiError");
const validatePassword = require("../utils/auth/validatePassword");
const STATUS_CODES = require("../constants/statusCodes");

const validateRegister = (data) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Email and Password are required.",
    );
  }

  if (!validator.isEmail(email)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Invalid email.");
  }

  if (!email.endsWith("@nitkkr.ac.in")) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Only @nitkkr.ac.in email addresses are allowed.",
    );
  }

  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Password must contain uppercase, lowercase, number, special character and be at least 8 characters long.",
    );
  }
};

const validateLogin = (data) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Email and Password are required.",
    );
  }

  if (!validator.isEmail(email)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Invalid email.");
  }
};

const validateVerifyOTP = (data) => {
  const { email, otp } = data;

  if (!email || !otp) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Email and OTP are required.");
  }

  if (!validator.isEmail(email)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Invalid email.");
  }

  if (
    !validator.isLength(otp, { min: 6, max: 6 }) ||
    !validator.isNumeric(otp)
  ) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Invalid OTP.");
  }
};

const validateResendOTP = (data) => {
  const { email } = data;

  if (!email) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Email is required.");
  }

  if (!validator.isEmail(email)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Invalid email.");
  }
};

const validateForgotPassword = (data) => {
  const { email } = data;
  if (!email || !validator.isEmail(email)) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Please provide a valid email.",
    );
  }
};

const validateResetPassword = (data) => {
  const { email, otp, password } = data;
  if (!email || !validator.isEmail(email)) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Please provide a valid email.",
    );
  }

  if (
    !otp ||
    !validator.isLength(otp, {
      min: 6,
      max: 6,
    }) ||
    !validator.isNumeric(otp)
  ) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Please provide a valid OTP.");
  }

  validatePassword(password);
};

const validateChangePassword = ({ oldPassword, newPassword }) => {
  if (!oldPassword) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Old password is required.");
  }

  validatePassword(newPassword);
};

module.exports = {
  validateRegister,
  validateLogin,
  validateVerifyOTP,
  validateResendOTP,
  validateForgotPassword,
  validateResetPassword,
  validateChangePassword,
};