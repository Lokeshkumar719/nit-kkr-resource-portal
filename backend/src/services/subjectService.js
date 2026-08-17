const ApiError = require('../utils/ApiError');

const STATUS_CODES = require('../constants/statusCodes');

const subjectRepository = require('../repositories/subjectRepository');

const createSubject = async (subjectData) => {
  const existingSubject = await subjectRepository.findSubjectByCode(subjectData.subjectCode);

  if (existingSubject) {
    throw new ApiError(STATUS_CODES.CONFLICT, 'Subject with this code already exists.');
  }

  return await subjectRepository.createSubject(subjectData);
};

const getSubjectById = async (subjectId) => {
  const subject = await subjectRepository.findSubjectById(subjectId);

  if (!subject) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Subject not found.');
  }

  return subject;
};

const getSubjectByCode = async (subjectCode) => {
  const subject = await subjectRepository.findSubjectByCode(subjectCode);

  if (!subject) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Subject not found.');
  }

  return subject;
};

const getSubjects = async (filter) => {
  return await subjectRepository.findSubjects(filter);
};

module.exports = {
  createSubject,
  getSubjectById,
  getSubjectByCode,
  getSubjects,
};
