const mongoose = require('mongoose');

const RESOURCE_TYPES = require('../constants/resourceTypes');

const resourceSchema = new mongoose.Schema(
  {
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(RESOURCE_TYPES),
    },
    fileName: {
      type: String,
      trim: true,
    },
    fileKey: {
      type: String,
      unique: true,
      sparse: true,
    },
    url: {
      type: String,
      trim: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

resourceSchema.index({ subjectId: 1, type: 1 });

module.exports = mongoose.model('Resource', resourceSchema);
