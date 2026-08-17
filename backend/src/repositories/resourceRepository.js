const Resource = require("../models/Resource");

const createResource = async (resourceData) => {
  return await Resource.create(resourceData);
};

const findResourceById = async (resourceId) => {
  return await Resource.findById(resourceId);
};

const findResources = async (filter) => {
  return await Resource.find(filter).sort({
    createdAt: -1,
  });
};

const deleteResource = async (resourceId) => {
  return await Resource.findByIdAndDelete(resourceId);
};

const updateResource = async (resourceId, updateData) => {
  return await Resource.findByIdAndUpdate(resourceId, updateData, { new: true });
};

module.exports = {
  createResource,
  findResourceById,
  findResources,
  deleteResource,
  updateResource,
};
