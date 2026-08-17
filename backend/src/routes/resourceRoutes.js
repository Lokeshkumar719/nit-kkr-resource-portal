const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const {
  uploadResourceFile,
} = require("../middlewares/uploadResourceFileMiddleware");

const resourceController = require("../controllers/resourceController");

const { limitResource } = require("../middlewares/rateLimiterMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  limitResource,
  uploadResourceFile,
  resourceController.createResource,
);

router.get("/", authMiddleware, resourceController.getResources);

router.get("/stats", resourceController.getResourceStats);

router.get("/:resourceId", authMiddleware, resourceController.getResourceById);

router.get("/:resourceId/download", authMiddleware, resourceController.getDownloadUrl);

router.delete(
  "/:resourceId",
  authMiddleware,
  adminMiddleware,
  limitResource,
  resourceController.deleteResource,
);

router.patch(
  "/:resourceId",
  authMiddleware,
  adminMiddleware,
  limitResource,
  resourceController.updateResource,
);

module.exports = router;
