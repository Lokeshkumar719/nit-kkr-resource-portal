const mongoose = require("mongoose");

const RESOURCE_TYPES = require("../constants/resourceTypes");
const CONTRIBUTION_STATUS = require("../constants/contributionStatus");

const contributionSchema = new mongoose.Schema(
  {
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
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
      match: /^https?:\/\/.+/,
    },
    contributedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(CONTRIBUTION_STATUS),
      default: CONTRIBUTION_STATUS.PENDING,
    },
  },
  {
    timestamps: true,
  },
);

contributionSchema.index({
  subjectId: 1,
  status: 1,
});

module.exports = mongoose.model("Contribution", contributionSchema);
