const validator = require("validator");

const ApiError = require("../utils/ApiError");

const STATUS_CODES = require("../constants/statusCodes");
const BRANCHES = require("../constants/branches");

const validateCreateSubject = (data) => {
  const { subjectCode, subjectName, branch, semester } = data;

  if (!subjectCode || validator.isEmpty(subjectCode.trim())) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Subject code is required.");
  }

  if (!subjectName || validator.isEmpty(subjectName.trim())) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Subject name is required.");
  }

  if (!branch || !BRANCHES.includes(branch)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Invalid branch.");
  }

  if (
    semester === undefined ||
    !Number.isInteger(Number(semester)) ||
    Number(semester) < 1 ||
    Number(semester) > 8
  ) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Semester must be between 1 and 8.",
    );
  }
};

const validateGetSubjects = (data) => {
  const { branch, semester } = data;

  if (!branch || !BRANCHES.includes(branch)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Invalid branch.");
  }

  if (
    semester === undefined ||
    !Number.isInteger(Number(semester)) ||
    Number(semester) < 1 ||
    Number(semester) > 8
  ) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Semester must be between 1 and 8.",
    );
  }
};

const validateSubjectId = (subjectId) => {
  if (!validator.isMongoId(subjectId)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Invalid subject id.");
  }
};

const validateSubjectCode = (subjectCode) => {
  if (!subjectCode || validator.isEmpty(subjectCode.trim())) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Subject code is required.");
  }
};

const validateUpdateSubject = (data) => {
  const { subjectCode, subjectName } = data;

  if (subjectCode !== undefined && validator.isEmpty(subjectCode.trim())) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Subject code cannot be empty.");
  }

  if (subjectName !== undefined && validator.isEmpty(subjectName.trim())) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Subject name cannot be empty.");
  }
};

module.exports = {
  validateCreateSubject,
  validateGetSubjects,
  validateSubjectId,
  validateSubjectCode,
  validateUpdateSubject,
};
