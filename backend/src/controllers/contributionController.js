const STATUS_CODES = require('../constants/statusCodes');

const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const contributionService = require('../services/contributionService');
const contributionValidator = require('../validators/contributionValidator');

const createContribution = asyncHandler(async (req, res) => {
  contributionValidator.validateCreateContribution(req.body, req.file);

  const contribution = await contributionService.createContribution(req.body, req.file, req.user);

  return new ApiResponse(
    res,
    STATUS_CODES.CREATED,
    'Contribution submitted successfully.',
    contribution
  );
});

const getContributions = asyncHandler(async (req, res) => {
  const contributions = await contributionService.getContributions(req.query);

  return new ApiResponse(
    res,
    STATUS_CODES.OK,
    'Contributions fetched successfully.',
    contributions
  );
});

const approveContribution = asyncHandler(async (req, res) => {
  contributionValidator.validateContributionId(req.params.contributionId);

  const resource = await contributionService.approveContribution(req.params.contributionId);

  return new ApiResponse(res, STATUS_CODES.OK, 'Contribution approved successfully.', resource);
});

const deleteContribution = asyncHandler(async (req, res) => {
  contributionValidator.validateContributionId(req.params.contributionId);

  await contributionService.deleteContribution(req.params.contributionId);

  return new ApiResponse(res, STATUS_CODES.OK, 'Contribution deleted successfully.');
});

const updateContribution = asyncHandler(async (req, res) => {
  contributionValidator.validateContributionId(req.params.contributionId);
  contributionValidator.validateUpdateContribution(req.body);

  const contribution = await contributionService.updateContribution(
    req.params.contributionId,
    req.body
  );

  return new ApiResponse(res, STATUS_CODES.OK, 'Contribution updated successfully.', contribution);
});

const getDownloadUrl = asyncHandler(async (req, res) => {
  contributionValidator.validateContributionId(req.params.contributionId);

  const contribution = await contributionService.getContributions({
    _id: req.params.contributionId,
  });

  if (!contribution || contribution.length === 0) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Contribution not found.');
  }

  const targetContribution = contribution[0];

  if (!targetContribution.fileKey) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      'This contribution does not have a downloadable file.'
    );
  }

  const { getFileUrl } = require('../services/fileService');
  const downloadUrl = await getFileUrl(targetContribution.fileKey);

  return new ApiResponse(res, STATUS_CODES.OK, 'Download URL generated successfully.', {
    downloadUrl,
  });
});

module.exports = {
  createContribution,
  getContributions,
  approveContribution,
  deleteContribution,
  getDownloadUrl,
  updateContribution,
};
