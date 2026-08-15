const ApiError = require("../utils/ApiError");

const STATUS_CODES = require("../constants/statusCodes");
const BUG_STATUS = require("../constants/bugStatus");

const bugRepository = require("../repositories/bugRepository");

const createBug = async (bugData, user) => {
  return await bugRepository.createBug({
    description: bugData.description,
    reportedBy: user._id,
  });
};

const getBugs = async (filter) => {
  return await bugRepository.findBugs(filter);
};

const resolveBug = async (bugId) => {
  const bug = await bugRepository.findBugById(bugId);

  if (!bug) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Bug not found.");
  }

  return await bugRepository.updateBug(bugId, {
    status: BUG_STATUS.RESOLVED,
  });
};

const deleteBug = async (bugId) => {
  const bug = await bugRepository.findBugById(bugId);

  if (!bug) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Bug not found.");
  }

  await bugRepository.deleteBug(bugId);
};

module.exports = {
  createBug,
  getBugs,
  resolveBug,
  deleteBug,
};
