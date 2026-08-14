const validator = require("validator");

const ApiError = require("../utils/ApiError");

const STATUS_CODES = require("../constants/statusCodes");
const RESOURCE_TYPES = require("../constants/resourceTypes");

const validateCreateContribution = (data, file) => {
  const { subjectId, title, type, url } = data;

  if (!subjectId || !validator.isMongoId(subjectId)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Invalid subject.");
  }

  if (!title || validator.isEmpty(title.trim())) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Title is required.");
  }

  if (!Object.values(RESOURCE_TYPES).includes(type)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Invalid resource type.");
  }

  if (type === RESOURCE_TYPES.LECTURES) {
    if (!url || !validator.isURL(url)) {
      throw new ApiError(
        STATUS_CODES.BAD_REQUEST,
        "A valid lecture URL is required.",
      );
    }

    return;
  }

  if (!file) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Resource file is required.");
  }
};

const validateContributionId = (contributionId) => {
  if (!validator.isMongoId(contributionId)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Invalid contribution id.");
  }
};

module.exports = {
  validateCreateContribution,
  validateContributionId,
};
