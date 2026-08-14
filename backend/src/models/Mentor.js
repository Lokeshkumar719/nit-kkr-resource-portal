const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    branch: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    year: {
      type: String,
      enum: ['2nd Year', '3rd Year', '4th Year', 'Alumni'],
      required: true,
    },

    company: {
      type: String,
      trim: true,
      default: null,
    },

    linkedin: {
      type: String,
      trim: true,
      default: null,
    },

    imageUrl: {
      type: String,
      default: null,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Mentor', mentorSchema);