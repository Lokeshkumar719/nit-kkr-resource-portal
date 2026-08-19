import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import { parseRateLimitError } from '../../../utils/rateLimitUtils';
import { useRateLimitCountdown } from '../../../hooks/useRateLimitCountdown';
import { AUTH_STEPS, DEFAULT_FORM_STATE } from '../constants';
import {
  login as apiLogin,
  register as apiRegister,
  verifyOTP as apiVerifyOTP,
  resendOTP as apiResendOTP,
  forgotPassword as apiForgotPassword,
  verifyForgotPasswordOTP as apiVerifyForgotPasswordOTP,
  resetPassword as apiResetPassword,
} from '../../../services/api';

export const useAuthFlow = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(AUTH_STEPS.AUTH);

  const [formData, setFormData] = useState(DEFAULT_FORM_STATE);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loginRateLimit = useRateLimitCountdown('login');
  const registerRateLimit = useRateLimitCountdown('register');
  const resendOtpRateLimit = useRateLimitCountdown('resendOtp');
  const forgotPasswordRateLimit = useRateLimitCountdown('forgotPassword');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setFormData(DEFAULT_FORM_STATE);
  };

  const goBackToLogin = () => {
    setStep(AUTH_STEPS.AUTH);
    setIsLogin(true);
    setError('');
    setSuccess('');
    setFormData(DEFAULT_FORM_STATE);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const res = await apiLogin(formData.email, formData.password);
        login(res.data.data);
        toast.success('Logged in successfully!');

        if (res.data.data.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        await apiRegister(formData.email, formData.password);
        toast.success('OTP sent to your email! Please verify.');
        setSuccess('OTP sent to your email! Please verify.');
        resendOtpRateLimit.triggerRateLimit(60);
        setStep(AUTH_STEPS.VERIFY);
      }
    } catch (err) {
      const { isRateLimited, retryAfterSeconds } = parseRateLimitError(err);
      if (isRateLimited) {
        if (isLogin) {
          loginRateLimit.triggerRateLimit(retryAfterSeconds);
        } else {
          registerRateLimit.triggerRateLimit(retryAfterSeconds);
        }
        toast.error(`Rate limited. Please wait ${retryAfterSeconds}s.`);
      } else {
        const responseData = err.response?.data;
        if (responseData?.code === 'ACCOUNT_UNVERIFIED') {
          toast.success('A verification code has been sent to your email.');
          setSuccess('A verification code has been sent to your email.');
          resendOtpRateLimit.triggerRateLimit(60);
          setStep(AUTH_STEPS.VERIFY);
        } else {
          const errorMsg = responseData?.message || 'Authentication failed. Please try again.';
          setError(errorMsg);
          toast.error(errorMsg);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await apiVerifyOTP(formData.email, formData.otp);
      if (res.data && res.data.data) {
        login(res.data.data);
        toast.success('Email verified successfully.');
        if (res.data.data.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        toast.success('Verified! You can now log in.');
        setStep(AUTH_STEPS.AUTH);
        setIsLogin(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed. Please check the OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await apiResendOTP(formData.email);
      toast.success('A new verification code has been sent to your email.');
      setSuccess('A new verification code has been sent to your email.');
      resendOtpRateLimit.triggerRateLimit(60);
    } catch (err) {
      const { isRateLimited, retryAfterSeconds } = parseRateLimitError(err);
      if (isRateLimited) {
        resendOtpRateLimit.triggerRateLimit(retryAfterSeconds);
        toast.error(`Please wait ${retryAfterSeconds}s before resending.`);
      } else {
        const errorMsg = err.response?.data?.message || 'Failed to resend OTP. Please try again.';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await apiForgotPassword(formData.email);
      toast.success('A password reset OTP has been sent to your email.');
      setSuccess('A password reset OTP has been sent to your email.');
      resendOtpRateLimit.triggerRateLimit(60);
      setStep(AUTH_STEPS.FORGOT_OTP);
    } catch (err) {
      const { isRateLimited, retryAfterSeconds } = parseRateLimitError(err);
      if (isRateLimited) {
        forgotPasswordRateLimit.triggerRateLimit(retryAfterSeconds);
        toast.error(`Please wait ${retryAfterSeconds}s before requesting a new OTP.`);
      } else {
        const errorMsg =
          err.response?.data?.message || 'Failed to send reset OTP. Please try again.';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyForgotOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await apiVerifyForgotPasswordOTP(formData.email, formData.otp);
      toast.success('OTP verified. Please set your new password.');
      setStep(AUTH_STEPS.FORGOT_RESET);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await apiResetPassword(formData.email, formData.otp, formData.newPassword);
      toast.success('Password reset successfully.');
      setStep(AUTH_STEPS.RESET_SUCCESS);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendForgotOTP = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await apiForgotPassword(formData.email);
      toast.success('A new password reset OTP has been sent to your email.');
      setSuccess('A new password reset OTP has been sent to your email.');
      resendOtpRateLimit.triggerRateLimit(60);
    } catch (err) {
      const { isRateLimited, retryAfterSeconds } = parseRateLimitError(err);
      if (isRateLimited) {
        resendOtpRateLimit.triggerRateLimit(retryAfterSeconds);
        toast.error(`Please wait ${retryAfterSeconds}s before resending.`);
      } else {
        const errorMsg = err.response?.data?.message || 'Failed to resend OTP.';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    setStep,
    isLogin,
    formData,
    loading,
    error,
    setError,
    success,
    setSuccess,
    loginRateLimit,
    registerRateLimit,
    resendOtpRateLimit,
    forgotPasswordRateLimit,
    handleChange,
    toggleMode,
    goBackToLogin,
    handleAuthSubmit,
    handleVerifySubmit,
    handleResendOTP,
    handleForgotSubmit,
    handleVerifyForgotOTP,
    handleResetPasswordSubmit,
    handleResendForgotOTP,
  };
};
