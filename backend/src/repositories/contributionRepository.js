const Contribution = require('../models/Contribution');

const createContribution = async (contributionData) => {
  return await Contribution.create(contributionData);
};

const findContributionById = async (contributionId) => {
  return await Contribution.findById(contributionId);
};

const findContributions = async (filter) => {
  return await Contribution.find(filter)
    .populate('contributedBy', 'name email')
    .populate('subjectId', 'offeredTo')
    .sort({ createdAt: -1 });
};

const deleteContribution = async (contributionId) => {
  return await Contribution.findByIdAndDelete(contributionId);
};

const updateContribution = async (contributionId, updateData) => {
  return await Contribution.findByIdAndUpdate(contributionId, updateData, { new: true });
};

module.exports = {
  createContribution,
  findContributionById,
  findContributions,
  deleteContribution,
  updateContribution,
};
