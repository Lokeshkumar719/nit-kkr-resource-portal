const validator = require("validator");

const ApiError = require("../utils/ApiError");

const STATUS_CODES = require("../constants/statusCodes");

const validateCreateBug = (data) => {
  const { description } = data;

  if (!description || validator.isEmpty(description.trim())) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Description is required.");
  }
};

const validateBugId = (bugId) => {
  if (!validator.isMongoId(bugId)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Invalid bug id.");
  }
};

module.exports = {
  validateCreateBug,
  validateBugId,
};
