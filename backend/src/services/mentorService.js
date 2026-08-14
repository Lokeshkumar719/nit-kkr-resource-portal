const mentorRepository = require("../repositories/mentorRepository");

const buildMentorQuery = require("../utils/mentorQueryBuilder");

const ApiError = require("../utils/ApiError");
const STATUS_CODES = require("../constants/statusCodes");

const getMentors = async (query) => {
  const filter = buildMentorQuery(query);

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 12;

  const { mentors, total } = await mentorRepository.findMentors(
    filter,
    page,
    limit,
  );

  return {
    mentors,
    pagination: {
      page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getMentor = async (mentorId) => {
  const mentor = await mentorRepository.findMentorById(mentorId);

  if (!mentor) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Mentor not found.");
  }

  return mentor;
};

const createMentor = async (mentorData) => {
  return await mentorRepository.createMentor(mentorData);
};

const updateMentor = async (mentorId, mentorData) => {
  const mentor = await mentorRepository.updateMentor(mentorId, mentorData);

  if (!mentor) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Mentor not found.");
  }

  return mentor;
};

const deleteMentor = async (mentorId) => {
  const mentor = await mentorRepository.deleteMentor(mentorId);

  if (!mentor) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Mentor not found.");
  }
};

module.exports = {
  getMentors,
  getMentor,
  createMentor,
  updateMentor,
  deleteMentor,
};
