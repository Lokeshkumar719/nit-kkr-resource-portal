const STATUS_CODES = require("../constants/statusCodes");

const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const resourceService = require("../services/resourceService");
const resourceValidator = require("../validators/resourceValidator");

const createResource = asyncHandler(async (req, res) => {
  resourceValidator.validateCreateResource(req.body, req.file);

  const resource = await resourceService.createResource(
    req.body,
    req.file,
    req.user,
  );

  return new ApiResponse(
    res,
    STATUS_CODES.CREATED,
    "Resource created successfully.",
    resource,
  );
});

const getResourceById = asyncHandler(async (req, res) => {
  resourceValidator.validateResourceId(req.params.resourceId);

  const resource = await resourceService.getResourceById(req.params.resourceId);

  return new ApiResponse(
    res,
    STATUS_CODES.OK,
    "Resource fetched successfully.",
    resource,
  );
});

const getResources = asyncHandler(async (req, res) => {
  resourceValidator.validateGetResources(req.query);

  const resources = await resourceService.getResources(req.query);

  return new ApiResponse(
    res,
    STATUS_CODES.OK,
    "Resources fetched successfully.",
    resources,
  );
});

const getResourceStats = asyncHandler(async (req, res) => {
  const stats = await resourceService.getResourceStats();

  return new ApiResponse(
    res,
    STATUS_CODES.OK,
    "Resource stats fetched successfully.",
    stats,
  );
});

const deleteResource = asyncHandler(async (req, res) => {
  resourceValidator.validateResourceId(req.params.resourceId);

  await resourceService.deleteResource(req.params.resourceId);

  return new ApiResponse(
    res,
    STATUS_CODES.OK,
    "Resource deleted successfully.",
  );
});

const getDownloadUrl = asyncHandler(async (req, res) => {
  resourceValidator.validateResourceId(req.params.resourceId);

  const resource = await resourceService.getResourceById(req.params.resourceId);

  if (!resource.fileKey) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "This resource does not have a downloadable file.");
  }

  const { getFileUrl } = require("../services/fileService");
  const downloadUrl = await getFileUrl(resource.fileKey);

  return new ApiResponse(
    res,
    STATUS_CODES.OK,
    "Download URL generated successfully.",
    { downloadUrl }
  );
});

const updateResource = asyncHandler(async (req, res) => {
  resourceValidator.validateResourceId(req.params.resourceId);
  resourceValidator.validateUpdateResource(req.body);

  const resource = await resourceService.updateResource(
    req.params.resourceId,
    req.body
  );

  return new ApiResponse(
    res,
    STATUS_CODES.OK,
    "Resource updated successfully.",
    resource,
  );
});

module.exports = {
  createResource,
  getResourceById,
  getResources,
  getResourceStats,
  deleteResource,
  getDownloadUrl,
  updateResource,
};
