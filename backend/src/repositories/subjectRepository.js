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

module.exports = {
  createSubject,
  findSubjectById,
  findSubjectByCode,
  findSubjects,
};
