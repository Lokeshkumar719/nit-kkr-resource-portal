import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { ButtonSpinner } from '../ui/Spinner';
import { EmailField } from './fields/EmailField';

export const ForgotPasswordForm = ({ authFlow }) => {
  const {
    formData,
    handleChange,
    handleForgotSubmit,
    loading,
    forgotPasswordRateLimit,
    goBackToLogin,
  } = authFlow;

  return (
    <form onSubmit={handleForgotSubmit} className="space-y-4">
      <EmailField value={formData.email} onChange={handleChange} />

      <button
        type="submit"
        disabled={loading || forgotPasswordRateLimit.isRateLimited}
        className="btn-primary mt-2"
      >
        {loading ? (
          <ButtonSpinner />
        ) : forgotPasswordRateLimit.isRateLimited ? (
          `Resend in ${forgotPasswordRateLimit.formattedCountdown}`
        ) : (
          'Send Reset OTP'
        )}
        {!loading && !forgotPasswordRateLimit.isRateLimited && <ArrowRight className="w-4 h-4" />}
      </button>

      <div className="pt-2">
        <button
          type="button"
          onClick={goBackToLogin}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold text-white bg-slate-700 border border-transparent rounded-lg hover:bg-slate-800 transition-all shadow-sm group"
        >
          <ArrowLeft className="w-4 h-4 text-slate-300 group-hover:-translate-x-0.5 transition-transform" />{' '}
          Back to Sign In
        </button>
      </div>
    </form>
  );
};
