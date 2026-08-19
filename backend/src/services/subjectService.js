const ApiError = require('../utils/ApiError');

const STATUS_CODES = require('../constants/statusCodes');

const subjectRepository = require('../repositories/subjectRepository');
const resourceRepository = require('../repositories/resourceRepository');
const contributionRepository = require('../repositories/contributionRepository');

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

const getSubjects = async ({ branch, semester }) => {
  const filter = {};
  if (branch) filter.branch = branch;
  if (semester) filter.semester = Number(semester);

  return await subjectRepository.findSubjects(filter);
};

const getAllSubjects = async () => {
  return await subjectRepository.findAllSubjects();
};

const updateSubject = async (subjectId, subjectData) => {
  const subject = await subjectRepository.findSubjectById(subjectId);
  if (!subject) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Subject not found.');
  }

  // Check if updating to a code that already exists on another subject
  if (subjectData.subjectCode && subjectData.subjectCode !== subject.subjectCode) {
    const existingSubject = await subjectRepository.findSubjectByCode(subjectData.subjectCode);
    if (existingSubject) {
      throw new ApiError(STATUS_CODES.CONFLICT, 'Subject with this code already exists.');
    }
  }

  return await subjectRepository.updateSubject(subjectId, subjectData);
};

const fileService = require('./fileService');

const deleteSubject = async (subjectId) => {
  const subject = await subjectRepository.findSubjectById(subjectId);
  if (!subject) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Subject not found.');
  }

  // Cascading Delete: Find and delete all resources attached to this subject
  const resources = await resourceRepository.findResources({ subjectId });
  for (const resource of resources) {
    if (resource.fileKey) {
      await fileService.deleteFile(resource.fileKey);
    }
    await resourceRepository.deleteResource(resource._id);
  }

  // also delete all contributions attached to this subject
  const contributions = await contributionRepository.findContributions({ subjectId });
  for (const contribution of contributions) {
    if (contribution.fileKey) {
      await fileService.deleteFile(contribution.fileKey);
    }
    await contributionRepository.deleteContribution(contribution._id);
  }

  return await subjectRepository.deleteSubject(subjectId);
};

module.exports = {
  createSubject,
  getSubjectById,
  getSubjectByCode,
  getSubjects,
  getAllSubjects,
  updateSubject,
  deleteSubject,
};
