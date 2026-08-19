import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { ButtonSpinner } from '../ui/Spinner';
import { PasswordField } from './fields/PasswordField';
import { getNewPasswordHelperText } from './utils';

export const ResetPasswordForm = ({ authFlow }) => {
  const { formData, handleChange, handleResetPasswordSubmit, loading, setError, goBackToLogin } =
    authFlow;

  return (
    <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
      <PasswordField
        label="New Password"
        name="newPassword"
        value={formData.newPassword}
        onChange={handleChange}
        helperText={getNewPasswordHelperText()}
      />

      <PasswordField
        label="Confirm Password"
        name="confirmNewPassword"
        value={formData.confirmNewPassword}
        onChange={handleChange}
        onPaste={(e) => {
          e.preventDefault();
          setError('Copy-pasting passwords is not allowed. Please type it manually.');
        }}
      />

      <button
        type="submit"
        disabled={loading || !formData.newPassword || !formData.confirmNewPassword}
        className="btn-primary mt-2"
      >
        {loading ? <ButtonSpinner /> : 'Reset Password'}
        {!loading && <ArrowRight className="w-4 h-4" />}
      </button>

      <div className="pt-2">
        <button
          type="button"
          onClick={goBackToLogin}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold text-white bg-slate-700 border border-transparent rounded-lg hover:bg-slate-800 transition-all shadow-sm group"
        >
          <ArrowLeft className="w-4 h-4 text-slate-300 group-hover:-translate-x-0.5 transition-transform" />{' '}
          Cancel Reset
        </button>
      </div>
    </form>
  );
};
