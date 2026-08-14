const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const mentorController = require("../controllers/mentorController");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  mentorController.getMentors,
);

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  mentorController.createMentor,
);

router.get(
  "/:id",
  authMiddleware,
  mentorController.getMentor,
);

router.patch(
  "/:id",
  authMiddleware,
  adminMiddleware,
  mentorController.updateMentor,
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  mentorController.deleteMentor,
);

module.exports = router;