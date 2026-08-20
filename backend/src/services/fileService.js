const { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const crypto = require('crypto');

const path = require('path');
const r2Client = require('../config/r2Client');

const generateFileKey = (folder, extension = '.zip') => {
  return `${folder}/${crypto.randomUUID()}${extension}`;
};

const uploadFile = async (buffer, fileName, mimeType, folder) => {
  const extension = fileName ? path.extname(fileName) : '.zip';
  const fileKey = generateFileKey(folder, extension);

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileKey,
    Body: buffer,
    ContentType: mimeType,
  });

  try {
    await r2Client.send(command);
    return {
      fileKey,
    };
  } catch (error) {
    console.error('================ R2 / S3 UPLOAD ERROR ================');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    console.error('HTTP Status Code:', error.$metadata?.httpStatusCode);
    console.error('Bucket Name:', process.env.R2_BUCKET_NAME);
    console.error('Full Error Object:', error);
    console.error('======================================================');
    throw error;
  }
};

const deleteFile = async (fileKey) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileKey,
    });
    await r2Client.send(command);
  } catch (error) {
    console.error('Error deleting file from R2:', error);
    // Ignore error so it doesn't crash idempotent deletions
  }
};

const getFileUrl = async (fileKey, downloadName = null) => {
  const params = {
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileKey,
  };

  if (downloadName) {
    // Sanitize the filename to prevent header injection or invalid characters
    const safeName = downloadName.replace(/[^a-zA-Z0-9.\-_ ]/g, '').trim();
    // If safeName doesn't end with the fileKey extension, append it
    const fileExt = path.extname(fileKey);
    const finalName = safeName.endsWith(fileExt) ? safeName : `${safeName}${fileExt}`;
    params.ResponseContentDisposition = `attachment; filename="${finalName}"`;
  }

  const command = new GetObjectCommand(params);

  return await getSignedUrl(r2Client, command, { expiresIn: 3600 });
};

module.exports = {
  uploadFile,
  deleteFile,
  getFileUrl,
};
