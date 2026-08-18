const mongoose = require('mongoose');
const { BRANCHES } = require('../constants/branches');

const { CURRENT_YEARS, TAGS } = require('../constants/mentorTags');

const mentorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
    },

    branch: {
      type: String,
      required: true,
      enum: BRANCHES,
    },

    currentYear: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
    },

    branch: {
      type: String,
      required: true,
      enum: BRANCHES,
    },

    currentYear: {
      type: String,
      required: true,
      enum: CURRENT_YEARS,
    },

    batch: {
      type: String,
    },

    image: {
      type: String,
    },

    linkedin: {
      type: String,
    },

    tags: [
      {
        type: String,
        enum: TAGS,
      },
    ],

    experiences: [
      {
        company: String,
        role: String,
        type: {
          type: String,
          enum: ['Internship', 'Placement', 'Research'],
        },
      },
    ],

    achievements: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

mentorSchema.index({ currentYear: 1 });

mentorSchema.index({ branch: 1 });

mentorSchema.index({ tags: 1 });

module.exports = mongoose.model('Mentor', mentorSchema);
