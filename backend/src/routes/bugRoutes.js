const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const bugController = require('../controllers/bugController');

const router = express.Router();

router.post('/', authMiddleware, bugController.createBug);

router.get('/', authMiddleware, adminMiddleware, bugController.getBugs);

router.patch('/:bugId/resolve', authMiddleware, adminMiddleware, bugController.resolveBug);

router.delete('/:bugId', authMiddleware, adminMiddleware, bugController.deleteBug);

module.exports = router;
