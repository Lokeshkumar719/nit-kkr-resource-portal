const mongoose = require('mongoose');

const BRANCHES = require('../constants/branches');

const offeredToSchema = new mongoose.Schema(
  {
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
    _id: false,
  }
);

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

    offeredTo: {
      type: [offeredToSchema],
      required: true,
      validate: [
        {
          validator: (value) => value.length > 0,
          message: 'At least one branch-semester combination is required.',
        },
        {
          validator: (value) => {
            const combinations = new Set(
              value.map(({ branch, semester }) => `${branch}-${semester}`)
            );
            return combinations.size === value.length;
          },
          message: 'Duplicate branch-semester combinations are not allowed.',
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

subjectSchema.index({
  'offeredTo.branch': 1,
  'offeredTo.semester': 1,
});

module.exports = mongoose.model('Subject', subjectSchema);
