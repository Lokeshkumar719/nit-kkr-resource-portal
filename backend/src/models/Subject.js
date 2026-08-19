const mongoose = require('mongoose');

const BRANCHES = require('../constants/branches');

const subjectSchema = new mongoose.Schema(
  {
    subjectCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    subjectName: {
      type: String,
      required: true,
      trim: true,
    },
    branch: {
      type: String,
      required: true,
      enum: BRANCHES,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
  },
  {
    timestamps: true,
  }
);

subjectSchema.index({ branch: 1, semester: 1 });

module.exports = mongoose.model('Subject', subjectSchema);
