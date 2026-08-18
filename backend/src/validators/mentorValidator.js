const mongoose = require('mongoose');

const validator = require('validator');

const ApiError = require('../utils/ApiError');
const STATUS_CODES = require('../constants/statusCodes');

const validateMentorId = (mentorId) => {
  if (!mongoose.Types.ObjectId.isValid(mentorId)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Invalid mentor id.');
  }
};

const validateCreateMentor = (data) => {
  const { name, email, branch, currentYear } = data;

  if (!name || !branch || !currentYear) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'All required fields must be provided.');
  }

  if (email && !validator.isEmail(email)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Invalid email.');
  }
};

const validateUpdateMentor = (mentorId, mentorData) => {
  validateMentorId(mentorId);

  if (mentorData.email && !validator.isEmail(mentorData.email)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Invalid email.');
  }
};

const validateGetMentors = () => {};

module.exports = {
  validateMentorId,
  validateCreateMentor,
  validateUpdateMentor,
  validateGetMentors,
};
