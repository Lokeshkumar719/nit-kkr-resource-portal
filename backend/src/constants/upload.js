const MAX_RESOURCE_SIZE = 100 * 1024 * 1024;

const ALLOWED_RESOURCE_MIME_TYPES = [
    'application/zip',
    'application/x-zip-compressed',
];

module.exports = {
    MAX_RESOURCE_SIZE,
    ALLOWED_RESOURCE_MIME_TYPES,
};