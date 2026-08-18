const mongoose = require('mongoose');
const USER_ROLE = require('../constants/roles');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-zA-Z0-9._%+-]+@nitkkr\.ac\.in$/, 'Please use a valid @nitkkr.ac.in email'],
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      default: USER_ROLE.USER,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationOTP: {
      type: String,
      default: null,
    },

    emailVerificationOTPExpires: {
      type: Date,
      default: null,
    },

    forgotPasswordOTP: {
      type: String,
      default: null,
    },

    forgotPasswordOTPExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
