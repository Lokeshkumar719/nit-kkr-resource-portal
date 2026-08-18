const express = require('express');

const authController = require('../controllers/authController');

const authMiddleware = require('../middlewares/authMiddleware');

const {
    limitLogin, 
    limitRegister, 
    limitChangePassword, 
    limitForgotPassword, 
    limitResendOtp
} = require("../middlewares/rateLimiterMiddleware");

const router = express.Router();

router.post("/register", limitRegister, authController.register);

router.post('/verify-otp', authController.verifyOTP);

router.post("/resend-otp", limitResendOtp, authController.resendOTP);

router.post("/login", limitLogin, authController.login);

router.post("/forgot-password", limitForgotPassword, authController.forgotPassword);

router.post('/verify-forgot-password-otp', authController.verifyForgotPasswordOTP);

router.post('/reset-password', authController.resetPassword);

router.patch("/change-password", authMiddleware, limitChangePassword, authController.changePassword);

router.post('/refresh-token', authController.refreshAccessToken);

router.post('/logout', authMiddleware, authController.logout);

router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;
