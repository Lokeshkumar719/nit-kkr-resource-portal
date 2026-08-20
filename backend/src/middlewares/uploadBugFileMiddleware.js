const multer = require('multer');
const STATUS_CODES = require('../constants/statusCodes');

const ApiError = require('../utils/ApiError');

const { MAX_BUG_FILE_SIZE, ALLOWED_BUG_FILE_MIME_TYPES } = require('../constants/upload');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_BUG_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_BUG_FILE_MIME_TYPES.includes(file.mimetype)) {
      return cb(
        new ApiError(
          STATUS_CODES.BAD_REQUEST,
          'Unsupported file type. Only images, PDFs, and ZIP files are allowed.'
        )
      );
    }

    cb(null, true);
  },
});

const uploadBugFile = upload.single('file');

module.exports = {
  uploadBugFile,
};
