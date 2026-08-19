import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ButtonSpinner } from '../ui/Spinner';
import { OtpField } from './fields/OtpField';

export const VerifyOtpForm = ({ authFlow }) => {
  const {
    formData,
    handleChange,
    handleVerifySubmit,
    handleResendOTP,
    loading,
    resendOtpRateLimit,
  } = authFlow;

  return (
    <form onSubmit={handleVerifySubmit} className="space-y-4">
      <OtpField value={formData.otp} onChange={handleChange} />

      <button type="submit" disabled={loading} className="btn-primary mt-2">
        {loading ? <ButtonSpinner /> : 'Verify & Continue'}
        {!loading && <ArrowRight className="w-4 h-4" />}
      </button>

      <div className="text-center pt-3">
        <button
          type="button"
          onClick={handleResendOTP}
          disabled={loading || resendOtpRateLimit.isRateLimited}
          className="text-sm font-semibold text-nit-primary hover:text-nit-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resendOtpRateLimit.isRateLimited
            ? `Resend code in ${resendOtpRateLimit.formattedCountdown}`
            : "Didn't receive the code? Resend"}
        </button>
      </div>
    </form>
  );
};
