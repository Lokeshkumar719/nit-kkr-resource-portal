const forgotPasswordOTPTemplate = (otp) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 8px;">
      <h2 style="color: #2563eb; text-align: center;">
        NIT KKR Academic Portal
      </h2>

      <p>Hello,</p>

      <p>
        We received a request to reset your password.
      </p>

      <p>
        Use the OTP below to reset your password:
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; padding: 12px 24px; font-size: 28px; font-weight: bold; letter-spacing: 6px; background-color: #f3f4f6; border-radius: 8px;">
          ${otp}
        </span>
      </div>

      <p>
        This OTP will expire in <strong>${process.env.OTP_EXPIRY_MINUTES} minutes</strong>.
      </p>

      <p>
        If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
      </p>

      <hr />

      <p style="font-size: 12px; color: #6b7280;">
        This is an automated email. Please do not reply.
      </p>
    </div>
  `;
};

module.exports = forgotPasswordOTPTemplate;
