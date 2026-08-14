const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const {uploadResourceFile }= require("../middlewares/uploadResourceFileMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const contributionController = require("../controllers/contributionController");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  uploadResourceFile,
  contributionController.createContribution,
);

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  contributionController.getContributions,
);

router.patch(
  "/:contributionId/approve",
  authMiddleware,
  adminMiddleware,
  contributionController.approveContribution,
);

router.delete(
  "/:contributionId",
  authMiddleware,
  adminMiddleware,
  contributionController.deleteContribution,
);

module.exports = router;
