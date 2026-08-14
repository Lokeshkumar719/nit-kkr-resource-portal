const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const subjectController = require("../controllers/subjectController");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  subjectController.createSubject,
);

router.get("/", authMiddleware, subjectController.getSubjects);

module.exports = router;
