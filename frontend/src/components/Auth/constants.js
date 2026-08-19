export const AUTH_STEPS = {
  AUTH: 'auth',
  VERIFY: 'verify',
  FORGOT: 'forgot',
  FORGOT_OTP: 'forgot-otp',
  FORGOT_RESET: 'forgot-reset',
  RESET_SUCCESS: 'reset-success',
};

export const DEFAULT_FORM_STATE = {
  email: '',
  password: '',
  otp: '',
  newPassword: '',
  confirmNewPassword: '',
};

export const getStepTitle = (step, isLogin) => {
  switch (step) {
    case AUTH_STEPS.VERIFY:
      return 'Verify Email';
    case AUTH_STEPS.FORGOT:
      return 'Forgot Password';
    case AUTH_STEPS.FORGOT_OTP:
      return 'Verify Code';
    case AUTH_STEPS.FORGOT_RESET:
      return 'Reset Password';
    case AUTH_STEPS.RESET_SUCCESS:
      return 'Password Reset';
    default:
      return isLogin ? 'Welcome back' : 'Create account';
  }
};

export const getStepSubtitle = (step, isLogin, email = '') => {
  switch (step) {
    case AUTH_STEPS.VERIFY:
      return 'Enter the 6-digit code sent to your email.';
    case AUTH_STEPS.FORGOT:
      return 'Enter your college email to receive a reset OTP.';
    case AUTH_STEPS.FORGOT_OTP:
      return `Enter the OTP sent to ${email}.`;
    case AUTH_STEPS.FORGOT_RESET:
      return 'Set your new password below.';
    case AUTH_STEPS.RESET_SUCCESS:
      return '';
    default:
      return isLogin ? 'Sign in to access your dashboard.' : 'Sign up using your college email.';
  }
};
