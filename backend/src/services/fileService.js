const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const crypto = require("crypto");

const r2Client = require("../config/r2Client");

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

  await r2Client.send(command);

  return {
    fileKey,
  };
};

const deleteFile = async (fileKey) => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileKey,
  });

  await r2Client.send(command);
};

module.exports = {
  uploadFile,
  deleteFile,
};
