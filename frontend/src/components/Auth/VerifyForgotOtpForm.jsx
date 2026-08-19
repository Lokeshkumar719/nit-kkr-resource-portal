import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { ButtonSpinner } from '../ui/Spinner';
import { OtpField } from './fields/OtpField';

export const VerifyForgotOtpForm = ({ authFlow }) => {
  const {
    formData,
    handleChange,
    handleVerifyForgotOTP,
    handleResendForgotOTP,
    loading,
    resendOtpRateLimit,
    goBackToLogin,
  } = authFlow;

  return (
    <form onSubmit={handleVerifyForgotOTP} className="space-y-4">
      <OtpField value={formData.otp} onChange={handleChange} label="Reset Code" />

      <button type="submit" disabled={loading} className="btn-primary mt-2">
        {loading ? <ButtonSpinner /> : 'Verify OTP'}
        {!loading && <ArrowRight className="w-4 h-4" />}
      </button>

      <div className="text-center pt-1 space-y-4">
        <button
          type="button"
          onClick={handleResendForgotOTP}
          disabled={loading || resendOtpRateLimit.isRateLimited}
          className="text-sm font-semibold text-nit-primary hover:text-nit-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resendOtpRateLimit.isRateLimited
            ? `Resend code in ${resendOtpRateLimit.formattedCountdown}`
            : "Didn't receive the code? Resend"}
        </button>
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={goBackToLogin}
            className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold text-white bg-slate-700 border border-transparent rounded-lg hover:bg-slate-800 transition-all shadow-sm group"
          >
            <ArrowLeft className="w-4 h-4 text-slate-300 group-hover:-translate-x-0.5 transition-transform" />{' '}
            Back to Sign In
          </button>
        </div>
      </div>
    </form>
  );
};
