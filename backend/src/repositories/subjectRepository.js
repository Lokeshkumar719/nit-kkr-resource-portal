const Subject = require('../models/Subject');

const createSubject = async (subjectData) => {
  return await Subject.create(subjectData);
};

const findSubjectById = async (subjectId) => {
  return await Subject.findById(subjectId);
};

const findSubjectByCode = async (subjectCode) => {
  return await Subject.findOne({ subjectCode });
};

const findSubjects = async ({ branch, semester }) => {
  return await Subject.find({
    offeredTo: {
      $elemMatch: {
        branch,
        semester,
      },
    },
  }).sort({
    subjectName: 1,
  });
};

const findAllSubjects = async () => {
  return await Subject.find({}).sort({ subjectName: 1 });
};

const updateSubject = async (subjectId, updateData) => {
  return await Subject.findByIdAndUpdate(subjectId, updateData, {
    new: true,
    runValidators: true,
  });
};

const deleteSubject = async (subjectId) => {
  return await Subject.findByIdAndDelete(subjectId);
};

module.exports = {
  createSubject,
  findSubjectById,
  findSubjectByCode,
  findSubjects,
  findAllSubjects,
  updateSubject,
  deleteSubject,
};
