const MAX_RESOURCE_FILE_SIZE = 200 * 1024 * 1024;

const ALLOWED_RESOURCE_MIME_TYPES = ['application/zip', 'application/x-zip-compressed'];

const MAX_BUG_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_BUG_FILE_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/pdf',
  'application/zip',
  'application/x-zip-compressed',
];

module.exports = {
  MAX_RESOURCE_FILE_SIZE,
  ALLOWED_RESOURCE_MIME_TYPES,
  MAX_BUG_FILE_SIZE,
  ALLOWED_BUG_FILE_MIME_TYPES,
};
