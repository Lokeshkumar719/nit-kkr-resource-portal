import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ButtonSpinner } from '../ui/Spinner';
import { EmailField } from './fields/EmailField';
import { PasswordField } from './fields/PasswordField';
import { getPasswordHelperText } from './utils';

export const RegisterForm = ({ authFlow }) => {
  const { formData, handleChange, handleAuthSubmit, loading, registerRateLimit } = authFlow;

  return (
    <form onSubmit={handleAuthSubmit} className="space-y-4">
      <EmailField value={formData.email} onChange={handleChange} />

      <PasswordField
        label="Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        helperText={getPasswordHelperText(false)}
      />

      <button
        type="submit"
        disabled={loading || registerRateLimit.isRateLimited}
        className="btn-primary mt-2"
      >
        {loading ? (
          <ButtonSpinner />
        ) : registerRateLimit.isRateLimited ? (
          `Register (${registerRateLimit.formattedCountdown})`
        ) : (
          'Create Account'
        )}
        {!loading && !registerRateLimit.isRateLimited && <ArrowRight className="w-4 h-4" />}
      </button>
    </form>
  );
};
