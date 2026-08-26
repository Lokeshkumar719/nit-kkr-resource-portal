const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const { uploadBugFile } = require('../middlewares/uploadBugFileMiddleware');

const bugController = require('../controllers/bugController');

const router = express.Router();

router.post('/', authMiddleware, uploadBugFile, bugController.createBug);

router.get('/', authMiddleware, adminMiddleware, bugController.getBugs);

router.patch('/:bugId/resolve', authMiddleware, adminMiddleware, bugController.resolveBug);

router.delete('/:bugId', authMiddleware, adminMiddleware, bugController.deleteBug);

router.get('/:bugId/download', authMiddleware, adminMiddleware, bugController.downloadBugAttachment);

module.exports = router;
