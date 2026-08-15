const STATUS_CODES = require("../constants/statusCodes");

const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const bugService = require("../services/bugService");
const bugValidator = require("../validators/bugValidator");

const createBug = asyncHandler(async (req, res) => {
  bugValidator.validateCreateBug(req.body);

  const bug = await bugService.createBug(req.body, req.user);

  return new ApiResponse(
    res,
    STATUS_CODES.CREATED,
    "Bug reported successfully.",
    bug,
  );
});

const getBugs = asyncHandler(async (req, res) => {
  const bugs = await bugService.getBugs(req.query);

  return new ApiResponse(
    res,
    STATUS_CODES.OK,
    "Bugs fetched successfully.",
    bugs,
  );
});

const resolveBug = asyncHandler(async (req, res) => {
  bugValidator.validateBugId(req.params.bugId);

  const bug = await bugService.resolveBug(req.params.bugId);

  return new ApiResponse(
    res,
    STATUS_CODES.OK,
    "Bug resolved successfully.",
    bug,
  );
});

const deleteBug = asyncHandler(async (req, res) => {
  bugValidator.validateBugId(req.params.bugId);

  await bugService.deleteBug(req.params.bugId);

  return new ApiResponse(res, STATUS_CODES.OK, "Bug deleted successfully.");
});

module.exports = {
  createBug,
  getBugs,
  resolveBug,
  deleteBug,
};
