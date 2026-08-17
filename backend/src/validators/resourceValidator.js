const validator = require("validator");

const ApiError = require("../utils/ApiError");

const STATUS_CODES = require("../constants/statusCodes");
const RESOURCE_TYPES = require("../constants/resourceTypes");

const validateCreateResource = (data, file) => {
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

const validateGetResources = (data) => {
  const { subjectId } = data;

  if (!subjectId || !validator.isMongoId(subjectId)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Invalid subject.");
  }
};

const validateResourceId = (resourceId) => {
  if (!validator.isMongoId(resourceId)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Invalid resource id.");
  }
};

const validateUpdateResource = (data) => {
  const { title, type, url } = data;

  if (title !== undefined && validator.isEmpty(title.trim())) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Title cannot be empty.");
  }

  if (type !== undefined && !Object.values(RESOURCE_TYPES).includes(type)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Invalid resource type.");
  }

  if (type === RESOURCE_TYPES.LECTURES || (url !== undefined && url !== "")) {
    if (url && !validator.isURL(url)) {
      throw new ApiError(
        STATUS_CODES.BAD_REQUEST,
        "A valid URL is required.",
      );
    }
  }
};

module.exports = {
  validateCreateResource,
  validateGetResources,
  validateResourceId,
  validateUpdateResource,
};
