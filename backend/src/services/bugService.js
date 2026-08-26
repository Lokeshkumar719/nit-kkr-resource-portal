const ApiError = require('../utils/ApiError');

const STATUS_CODES = require('../constants/statusCodes');
const BUG_STATUS = require('../constants/bugStatus');

const bugRepository = require('../repositories/bugRepository');
const fileService = require('./fileService');

const createBug = async (bugData, file, user) => {
  let fileData = {};

  if (file) {
    const uploadedFile = await fileService.uploadFile(
      file.buffer,
      file.originalname,
      file.mimetype,
      'bugs'
    );

    fileData = {
      fileKey: uploadedFile.fileKey,
      fileName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
    };
  }

  return await bugRepository.createBug({
    description: bugData.description,
    reportedBy: user._id,
    ...fileData,
  });
};

const getBugs = async (filter) => {
  return await bugRepository.findBugs(filter);
};

const resolveBug = async (bugId) => {
  const bug = await bugRepository.findBugById(bugId);

  if (!bug) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Bug not found.');
  }

  if (bug.fileKey) {
    await fileService.deleteFile(bug.fileKey);
  }

  return await bugRepository.updateBug(bugId, {
    status: BUG_STATUS.RESOLVED,
  });
};

const deleteBug = async (bugId) => {
  const bug = await bugRepository.findBugById(bugId);

  if (!bug) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Bug not found.');
  }

  if (bug.fileKey) {
    await fileService.deleteFile(bug.fileKey);
  }

  await bugRepository.deleteBug(bugId);
};

const getBugDownloadUrl = async (bugId) => {
  const bug = await bugRepository.findBugById(bugId);

  if (!bug || !bug.fileKey) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Attachment not found.');
  }

  return await fileService.getFileUrl(bug.fileKey, bug.fileName);
};

module.exports = {
  createBug,
  getBugs,
  resolveBug,
  deleteBug,
  getBugDownloadUrl,
};
