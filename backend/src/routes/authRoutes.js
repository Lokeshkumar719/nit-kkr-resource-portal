const express = require("express");

const authController = require("../controllers/authController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", authController.register);

router.post("/verify-otp", authController.verifyOTP);

router.post("/resend-otp", authController.resendOTP);

router.post("/login", authController.login);

router.post("/forgot-password", authController.forgotPassword);

router.post("/reset-password", authController.resetPassword);

router.patch("/change-password", authMiddleware, authController.changePassword);

router.post("/refresh-token", authController.refreshAccessToken);

router.post("/logout", authMiddleware, authController.logout);

router.get("/me", authMiddleware, authController.getCurrentUser);

module.exports = router;