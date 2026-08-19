const validator = require('validator');

const ApiError = require('../utils/ApiError');

const STATUS_CODES = require('../constants/statusCodes');
const BRANCHES = require('../constants/branches');

const validateOfferedTo = (offeredTo) => {
  if (!Array.isArray(offeredTo) || offeredTo.length === 0) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      'At least one branch-semester combination is required.'
    );
  }

  const combinations = new Set();

  offeredTo.forEach(({ branch, semester }) => {
    if (!branch || !BRANCHES.includes(branch)) {
      throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Invalid branch.');
    }

    if (
      semester === undefined ||
      !Number.isInteger(Number(semester)) ||
      Number(semester) < 1 ||
      Number(semester) > 8
    ) {
      throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Semester must be between 1 and 8.');
    }

    const key = `${branch}-${semester}`;

    if (combinations.has(key)) {
      throw new ApiError(
        STATUS_CODES.BAD_REQUEST,
        'Duplicate branch-semester combinations are not allowed.'
      );
    }

    combinations.add(key);
  });
};

const validateCreateSubject = (data) => {
  const { subjectCode, subjectName, offeredTo } = data;

  if (!subjectCode || validator.isEmpty(subjectCode.trim())) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Subject code is required.');
  }

  if (!subjectName || validator.isEmpty(subjectName.trim())) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Subject name is required.');
  }

  validateOfferedTo(offeredTo);
};

const validateGetSubjects = (data) => {
  const { branch, semester } = data;

  if (!branch || !BRANCHES.includes(branch)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Invalid branch.');
  }

  if (
    semester === undefined ||
    !Number.isInteger(Number(semester)) ||
    Number(semester) < 1 ||
    Number(semester) > 8
  ) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Semester must be between 1 and 8.');
  }
};

const validateSubjectId = (subjectId) => {
  if (!validator.isMongoId(subjectId)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Invalid subject id.');
  }
};

const validateSubjectCode = (subjectCode) => {
  if (!subjectCode || validator.isEmpty(subjectCode.trim())) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Subject code is required.');
  }
};

const validateUpdateSubject = (data) => {
  const { subjectCode, subjectName, offeredTo } = data;

  if (subjectCode !== undefined && validator.isEmpty(subjectCode.trim())) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Subject code cannot be empty.');
  }

  if (subjectName !== undefined && validator.isEmpty(subjectName.trim())) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Subject name cannot be empty.');
  }

  if (offeredTo !== undefined) {
    validateOfferedTo(offeredTo);
  }
};

module.exports = {
  validateCreateSubject,
  validateGetSubjects,
  validateSubjectId,
  validateSubjectCode,
  validateUpdateSubject,
};
