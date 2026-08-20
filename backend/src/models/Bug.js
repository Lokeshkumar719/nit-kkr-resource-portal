const mongoose = require('mongoose');

const BUG_STATUS = require('../constants/bugStatus');

const bugSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(BUG_STATUS),
      default: BUG_STATUS.OPEN,
    },
    fileKey: {
      type: String,
      default: null,
    },
    fileName: {
      type: String,
      default: null,
    },
    mimeType: {
      type: String,
      default: null,
    },
    fileSize: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

bugSchema.index({
  status: 1,
  createdAt: -1,
});

module.exports = mongoose.model('Bug', bugSchema);
