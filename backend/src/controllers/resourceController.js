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

const deleteResource = asyncHandler(async (req, res) => {
  resourceValidator.validateResourceId(req.params.resourceId);

  await resourceService.deleteResource(req.params.resourceId);

  return new ApiResponse(
    res,
    STATUS_CODES.OK,
    "Resource deleted successfully.",
  );
});

module.exports = {
  createResource,
  getResourceById,
  getResources,
  deleteResource,
};
