const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const subjectController = require('../controllers/subjectController');

const router = express.Router();

router.post('/', authMiddleware, adminMiddleware, subjectController.createSubject);

router.get('/', authMiddleware, subjectController.getSubjects);

router.patch('/:subjectId', authMiddleware, adminMiddleware, subjectController.updateSubject);

router.delete('/:subjectId', authMiddleware, adminMiddleware, subjectController.deleteSubject);

module.exports = router;
