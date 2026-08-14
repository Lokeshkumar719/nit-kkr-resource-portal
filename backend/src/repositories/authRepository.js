const User = require('../models/User');

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const findUserById = async (userId) => {
  return await User.findById(userId);
};

const createUser = async (userData) => {
  return await User.create(userData);
};

const updateEmailVerificationOTP = async (email, hashedOTP, expiresAt) => {
  return await User.findOneAndUpdate(
    { email },
    {
      emailVerificationOTP: hashedOTP,
      emailVerificationOTPExpires: expiresAt,
    },
    { new: true }
  );
};

const verifyUser = async (email) => {
  return await User.findOneAndUpdate(
    { email },
    {
      isVerified: true,
      emailVerificationOTP: null,
      emailVerificationOTPExpires: null,
    },
    { new: true }
  );
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateEmailVerificationOTP,
  verifyUser,
};