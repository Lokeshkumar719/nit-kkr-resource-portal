const mongoose = require('mongoose');

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
  createdAt: -1,
});

module.exports = mongoose.model('Bug', bugSchema);
