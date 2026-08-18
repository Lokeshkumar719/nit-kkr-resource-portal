const Subject = require("../models/Subject");

const createSubject = async (subjectData) => {
  return await Subject.create(subjectData);
};

const findSubjectById = async (subjectId) => {
  return await Subject.findById(subjectId);
};

const findSubjectByCode = async (subjectCode) => {
  return await Subject.findOne({ subjectCode });
};

const findSubjects = async (filter) => {
  return await Subject.find(filter).sort({
    subjectName: 1,
  });
};

const updateSubject = async (subjectId, updateData) => {
  return await Subject.findByIdAndUpdate(subjectId, updateData, { new: true, runValidators: true });
};

const deleteSubject = async (subjectId) => {
  return await Subject.findByIdAndDelete(subjectId);
};

module.exports = {
  createSubject,
  findSubjectById,
  findSubjectByCode,
  findSubjects,
  updateSubject,
  deleteSubject,
};
