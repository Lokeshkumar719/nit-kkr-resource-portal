const STATUS_CODES = require('../constants/statusCodes');

const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const subjectService = require('../services/subjectService');
const subjectValidator = require('../validators/subjectValidator');

const createSubject = asyncHandler(async (req, res) => {
  subjectValidator.validateCreateSubject(req.body);

  const subject = await subjectService.createSubject(req.body);

  return new ApiResponse(res, STATUS_CODES.CREATED, 'Subject created successfully.', subject);
});

const getSubjectById = asyncHandler(async (req, res) => {
  subjectValidator.validateSubjectId(req.params.subjectId);

  const subject = await subjectService.getSubjectById(req.params.subjectId);

  return new ApiResponse(res, STATUS_CODES.OK, 'Subject fetched successfully.', subject);
});

const getSubjectByCode = asyncHandler(async (req, res) => {
  subjectValidator.validateSubjectCode(req.params.subjectCode);

  const subject = await subjectService.getSubjectByCode(req.params.subjectCode);

  return new ApiResponse(res, STATUS_CODES.OK, 'Subject fetched successfully.', subject);
});

const getSubjects = asyncHandler(async (req, res) => {
  subjectValidator.validateGetSubjects(req.query);

  const subjects = await subjectService.getSubjects(req.query);

  return new ApiResponse(res, STATUS_CODES.OK, 'Subjects fetched successfully.', subjects);
});

const getAllSubjects = asyncHandler(async (req, res) => {
  const subjects = await subjectService.getAllSubjects();

  return new ApiResponse(res, STATUS_CODES.OK, 'All subjects fetched successfully.', subjects);
});

const updateSubject = asyncHandler(async (req, res) => {
  subjectValidator.validateSubjectId(req.params.subjectId);
  subjectValidator.validateUpdateSubject(req.body);

  const subject = await subjectService.updateSubject(req.params.subjectId, req.body);

  return new ApiResponse(res, STATUS_CODES.OK, 'Subject updated successfully.', subject);
});

const deleteSubject = asyncHandler(async (req, res) => {
  subjectValidator.validateSubjectId(req.params.subjectId);

  await subjectService.deleteSubject(req.params.subjectId);

  return new ApiResponse(res, STATUS_CODES.OK, 'Subject deleted successfully.');
});

module.exports = {
  createSubject,
  getSubjectById,
  getSubjectByCode,
  getSubjects,
  getAllSubjects,
  updateSubject,
  deleteSubject,
};
