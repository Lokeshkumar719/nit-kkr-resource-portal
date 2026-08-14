const Mentor = require("../models/Mentor");

const findMentors = async (filter, page, limit) => {
  const mentors = await Mentor.find(filter)
    .sort({ name: 1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Mentor.countDocuments(filter);

  return { mentors, total };
};

const findMentorById = async (mentorId) => {
  return await Mentor.findById(mentorId);
};

const createMentor = async (mentorData) => {
  return await Mentor.create(mentorData);
};

const updateMentor = async (mentorId, mentorData) => {
  return await Mentor.findByIdAndUpdate(mentorId, mentorData, {
    new: true,
    runValidators: true,
  });
};

const deleteMentor = async (mentorId) => {
  return await Mentor.findByIdAndDelete(mentorId);
};

module.exports = {
  findMentors,
  findMentorById,
  createMentor,
  updateMentor,
  deleteMentor,
};
