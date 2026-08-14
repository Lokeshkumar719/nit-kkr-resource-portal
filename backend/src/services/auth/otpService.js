const resend = require('../../config/resend');

const verificationOTPTemplate = require('../../templates/emails/verificationOTPTemplate');

const sendVerificationOTP = async (email, otp) => {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verify your NIT KKR Academic Portal account',
      html: verificationOTPTemplate(otp),
    });
  } catch (error) {
    console.error('Failed to send verification OTP:', error);

    throw new Error('Failed to send verification OTP.');
  }
};

module.exports = {
  sendVerificationOTP,
};