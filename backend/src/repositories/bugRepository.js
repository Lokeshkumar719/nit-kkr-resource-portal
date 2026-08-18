const Bug = require("../models/Bug");

const createBug = async (bugData) => {
  return await Bug.create(bugData);
};

const findBugById = async (bugId) => {
  return await Bug.findById(bugId);
};

const findBugs = async (filter) => {
  return await Bug.find(filter).populate("reportedBy", "username email").sort({
    createdAt: 1,
  });
};

const updateBug = async (bugId, updateData) => {
  return await Bug.findByIdAndUpdate(bugId, updateData, { new: true });
};

const deleteBug = async (bugId) => {
  return await Bug.findByIdAndDelete(bugId);
};

module.exports = {
  createBug,
  findBugById,
  findBugs,
  updateBug,
  deleteBug,
};
