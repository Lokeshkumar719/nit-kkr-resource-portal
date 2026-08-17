const mentorService = require('../services/mentorService');

const mentorValidator = require('../validators/mentorValidator');

const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

const STATUS_CODES = require('../constants/statusCodes');

const getMentors = asyncHandler(async (req, res) => {
  mentorValidator.validateGetMentors(req.query);

  const mentors = await mentorService.getMentors(req.query);

  return new ApiResponse(res, STATUS_CODES.OK, 'Mentors fetched successfully.', mentors);
});

const getMentor = asyncHandler(async (req, res) => {
  mentorValidator.validateMentorId(req.params.id);

  const mentor = await mentorService.getMentor(req.params.id);

  return new ApiResponse(res, STATUS_CODES.OK, 'Mentor fetched successfully.', mentor);
});

const createMentor = asyncHandler(async (req, res) => {
  mentorValidator.validateCreateMentor(req.body);

  const mentor = await mentorService.createMentor(req.body);

  return new ApiResponse(res, STATUS_CODES.CREATED, 'Mentor created successfully.', mentor);
});

const updateMentor = asyncHandler(async (req, res) => {
  mentorValidator.validateUpdateMentor(req.params.id, req.body);

  const mentor = await mentorService.updateMentor(req.params.id, req.body);

  return new ApiResponse(res, STATUS_CODES.OK, 'Mentor updated successfully.', mentor);
});

const deleteMentor = asyncHandler(async (req, res) => {
  mentorValidator.validateMentorId(req.params.id);

  await mentorService.deleteMentor(req.params.id);

  return new ApiResponse(res, STATUS_CODES.OK, 'Mentor deleted successfully.');
});

module.exports = {
  getMentors,
  getMentor,
  createMentor,
  updateMentor,
  deleteMentor,
};
