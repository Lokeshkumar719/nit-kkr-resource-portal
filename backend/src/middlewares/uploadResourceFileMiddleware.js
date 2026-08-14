const multer = require("multer");
const STATUS_CODES = require('../constants/statusCodes');

const ApiError = require("../utils/ApiError");

const {
  MAX_RESOURCE_FILE_SIZE,
  ALLOWED_RESOURCE_MIME_TYPES,
} = require("../constants/upload");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_RESOURCE_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_RESOURCE_MIME_TYPES.includes(file.mimetype)) {
      return cb(new ApiError(STATUS_CODES.BAD_REQUEST, "Only ZIP files are allowed."));
    }

    cb(null, true);
  },
});

const uploadResourceFile = upload.single("resource");

module.exports = {
  uploadResourceFile,
};
