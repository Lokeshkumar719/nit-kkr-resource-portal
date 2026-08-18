const { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const crypto = require('crypto');

const r2Client = require('../config/r2Client');

const generateFileKey = (folder) => {
  return `${folder}/${crypto.randomUUID()}.zip`;
};

const uploadFile = async (buffer, fileName, mimeType, folder) => {
  const fileKey = generateFileKey(folder);

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
  const command = new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileKey,
  });

  await r2Client.send(command);
};

const getFileUrl = async (fileKey, downloadName = null) => {
  const params = {
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileKey,
  };

  if (downloadName) {
    // Sanitize the filename to prevent header injection or invalid characters
    const safeName = downloadName.replace(/[^a-zA-Z0-9.\-_ ]/g, "").trim();
    params.ResponseContentDisposition = `attachment; filename="${safeName}.zip"`;
  }

  const command = new GetObjectCommand(params);

  return await getSignedUrl(r2Client, command, { expiresIn: 3600 });
};

module.exports = {
  uploadFile,
  deleteFile,
  getFileUrl,
};
