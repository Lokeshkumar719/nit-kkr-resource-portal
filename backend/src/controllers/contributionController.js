const STATUS_CODES = require("../constants/statusCodes");

const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const contributionService = require("../services/contributionService");
const contributionValidator = require("../validators/contributionValidator");

const createContribution = asyncHandler(async (req, res) => {
  contributionValidator.validateCreateContribution(req.body, req.file);

  const contribution = await contributionService.createContribution(
    req.body,
    req.file,
    req.user,
  );

  return new ApiResponse(
    res,
    STATUS_CODES.CREATED,
    "Contribution submitted successfully.",
    contribution,
  );
});

const getContributions = asyncHandler(async (req, res) => {
  const contributions = await contributionService.getContributions(req.query);

  return new ApiResponse(
    res,
    STATUS_CODES.OK,
    "Contributions fetched successfully.",
    contributions,
  );
});

const approveContribution = asyncHandler(async (req, res) => {
  contributionValidator.validateContributionId(req.params.contributionId);

  const resource = await contributionService.approveContribution(
    req.params.contributionId,
  );

  return new ApiResponse(
    res,
    STATUS_CODES.OK,
    "Contribution approved successfully.",
    resource,
  );
});

const deleteContribution = asyncHandler(async (req, res) => {
  contributionValidator.validateContributionId(req.params.contributionId);

  await contributionService.deleteContribution(req.params.contributionId);

  return new ApiResponse(
    res,
    STATUS_CODES.OK,
    "Contribution deleted successfully.",
  );
});

module.exports = {
  createContribution,
  getContributions,
  approveContribution,
  deleteContribution,
};
