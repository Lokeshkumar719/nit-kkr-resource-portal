const ApiError = require('../utils/ApiError');

const STATUS_CODES = require('../constants/statusCodes');
const RESOURCE_TYPES = require('../constants/resourceTypes');

const subjectRepository = require('../repositories/subjectRepository');
const resourceRepository = require('../repositories/resourceRepository');

const fileService = require('./fileService');

const createResource = async (resourceData, file, user) => {
  const { subjectId, title, type, url } = resourceData;

  const subject = await subjectRepository.findSubjectById(subjectId);

  if (!subject) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Subject not found.');
  }

  if (type === RESOURCE_TYPES.LECTURES) {
    if (!url) {
      throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Lecture URL is required.');
    }

    return await resourceRepository.createResource({
      subjectId,
      title,
      type,
      url,
      uploadedBy: user._id,
    });
  }

  if (!file) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Resource file is required.');
  }

  const { fileKey } = await fileService.uploadFile(
    file.buffer,
    file.originalname,
    file.mimetype,
    'resources'
  );

  try {
    return await resourceRepository.createResource({
      subjectId,
      title,
      type,
      fileName: file.originalname,
      fileKey,
      uploadedBy: user._id,
    });
  } catch (error) {
    await fileService.deleteFile(fileKey);
    throw error;
  }
};

const getResourceById = async (resourceId) => {
  const resource = await resourceRepository.findResourceById(resourceId);

  if (!resource) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Resource not found.');
  }

  return resource;
};

const getResources = async (filter) => {
  return await resourceRepository.findResources(filter);
};

const getResourceStats = async () => {
  const resources = await resourceRepository.findResources({});
  const stats = { total: resources.length, notes: 0, books: 0, pyqs: 0, lectures: 0 };

  resources.forEach((r) => {
    if (r.type === RESOURCE_TYPES.NOTES) stats.notes++;
    else if (r.type === RESOURCE_TYPES.BOOKS) stats.books++;
    else if (r.type === RESOURCE_TYPES.PYQS) stats.pyqs++;
    else if (r.type === RESOURCE_TYPES.LECTURES) stats.lectures++;
  });

  return stats;
};

const deleteResource = async (resourceId) => {
  const resource = await resourceRepository.findResourceById(resourceId);

  if (!resource) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Resource not found.');
  }

  if (resource.fileKey) {
    await fileService.deleteFile(resource.fileKey);
  }

  await resourceRepository.deleteResource(resourceId);
};

const updateResource = async (resourceId, updateData) => {
  const resource = await resourceRepository.findResourceById(resourceId);

  if (!resource) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Resource not found.');
  }

  const allowedUpdates = {};
  if (updateData.title !== undefined) allowedUpdates.title = updateData.title;
  if (updateData.type !== undefined) allowedUpdates.type = updateData.type;
  if (updateData.url !== undefined) allowedUpdates.url = updateData.url;

  return await resourceRepository.updateResource(resourceId, allowedUpdates);
};

module.exports = {
  createResource,
  getResourceById,
  getResources,
  getResourceStats,
  deleteResource,
  updateResource,
};
