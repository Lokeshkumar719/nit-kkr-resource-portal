const ApiError = require("../utils/ApiError");

const STATUS_CODES = require("../constants/statusCodes");
const RESOURCE_TYPES = require("../constants/resourceTypes");

const contributionRepository = require("../repositories/contributionRepository");
const subjectRepository = require("../repositories/subjectRepository");
const resourceRepository = require("../repositories/resourceRepository");

const fileService = require("./fileService");

const createContribution = async (contributionData, file, user) => {
  const { subjectId, title, type, url } = contributionData;

  const subject = await subjectRepository.findSubjectById(subjectId);

  if (!subject) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Subject not found.");
  }

  if (type === RESOURCE_TYPES.LECTURES) {
    if (!url) {
      throw new ApiError(STATUS_CODES.BAD_REQUEST, "Lecture URL is required.");
    }

    return await contributionRepository.createContribution({
      subjectId,
      title,
      type,
      url,
      contributedBy: user._id,
    });
  }

  if (!file) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Resource file is required.");
  }

  const { fileKey } = await fileService.uploadFile(
    file.buffer,
    file.originalname,
    file.mimetype,
    "resources",
  );

  try {
    return await contributionRepository.createContribution({
      subjectId,
      title,
      type,
      fileName: file.originalname,
      fileKey,
      contributedBy: user._id,
    });
  } catch (error) {
    await fileService.deleteFile(fileKey);
    throw error;
  }
};

const getContributions = async (filter) => {
  return await contributionRepository.findContributions(filter);
};

const approveContribution = async (contributionId) => {
  const contribution =
    await contributionRepository.findContributionById(contributionId);

  if (!contribution) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Contribution not found.");
  }

  const resource = await resourceRepository.createResource({
    subjectId: contribution.subjectId,
    title: contribution.title,
    type: contribution.type,
    fileName: contribution.fileName,
    fileKey: contribution.fileKey,
    url: contribution.url,
    uploadedBy: contribution.contributedBy,
  });

  await contributionRepository.deleteContribution(contributionId);

  return resource;
};

const deleteContribution = async (contributionId) => {
  const contribution =
    await contributionRepository.findContributionById(contributionId);

  if (!contribution) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Contribution not found.");
  }

  if (contribution.fileKey) {
    await fileService.deleteFile(contribution.fileKey);
  }

  await contributionRepository.deleteContribution(contributionId);
};

module.exports = {
  createContribution,
  getContributions,
  approveContribution,
  deleteContribution,
};
