import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ButtonSpinner } from '../ui/Spinner';
import { EmailField } from './fields/EmailField';
import { PasswordField } from './fields/PasswordField';
import { AUTH_STEPS } from './constants';

export const LoginForm = ({ authFlow }) => {
  const {
    formData,
    handleChange,
    handleAuthSubmit,
    loading,
    loginRateLimit,
    setStep,
    setError,
    setSuccess,
  } = authFlow;

  return (
    <form onSubmit={handleAuthSubmit} className="space-y-4">
      <EmailField value={formData.email} onChange={handleChange} />

      <PasswordField
        label="Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        rightAction={
          <button
            type="button"
            onClick={() => {
              setStep(AUTH_STEPS.FORGOT);
              setError('');
              setSuccess('');
            }}
            className="text-xs font-semibold text-nit-accent hover:text-blue-700 transition cursor-pointer"
          >
            Forgot password?
          </button>
        }
      />

      <button
        type="submit"
        disabled={loading || loginRateLimit.isRateLimited}
        className="btn-primary mt-2"
      >
        {loading ? (
          <ButtonSpinner />
        ) : loginRateLimit.isRateLimited ? (
          `Try Again (${loginRateLimit.formattedCountdown})`
        ) : (
          'Sign In'
        )}
        {!loading && !loginRateLimit.isRateLimited && <ArrowRight className="w-4 h-4" />}
      </button>
    </form>
  );
};
