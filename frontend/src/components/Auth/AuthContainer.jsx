import React from 'react';
import { AuthLayout } from './AuthLayout';
import { AuthHeader } from './AuthHeader';
import { useAuthFlow } from './hooks/useAuthFlow';
import { Alert } from '../ui/Alert';
import { AUTH_STEPS, getStepTitle, getStepSubtitle } from './constants';

import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { VerifyOtpForm } from './VerifyOtpForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { VerifyForgotOtpForm } from './VerifyForgotOtpForm';
import { ResetPasswordForm } from './ResetPasswordForm';
import { ResetSuccess } from './ResetSuccess';

export const AuthContainer = () => {
  const authFlow = useAuthFlow();
  const { step, isLogin, formData, error, setError, success, setSuccess, toggleMode } = authFlow;

  const renderForm = () => {
    switch (step) {
      case AUTH_STEPS.AUTH:
        return isLogin ? <LoginForm authFlow={authFlow} /> : <RegisterForm authFlow={authFlow} />;
      case AUTH_STEPS.VERIFY:
        return <VerifyOtpForm authFlow={authFlow} />;
      case AUTH_STEPS.FORGOT:
        return <ForgotPasswordForm authFlow={authFlow} />;
      case AUTH_STEPS.FORGOT_OTP:
        return <VerifyForgotOtpForm authFlow={authFlow} />;
      case AUTH_STEPS.FORGOT_RESET:
        return <ResetPasswordForm authFlow={authFlow} />;
      case AUTH_STEPS.RESET_SUCCESS:
        return <ResetSuccess authFlow={authFlow} />;
      default:
        return null;
    }
  };

  return (
    <AuthLayout>
      <div className="glass-card p-8">
        <AuthHeader
          title={getStepTitle(step, isLogin)}
          subtitle={getStepSubtitle(step, isLogin, formData.email)}
        />

        <Alert type="error" message={error} onDismiss={() => setError('')} />
        <Alert type="success" message={success} onDismiss={() => setSuccess('')} />

        <div className="mt-6">{renderForm()}</div>

        {step === AUTH_STEPS.AUTH && (
          <div className="mt-8 text-center border-t border-slate-200 pt-6">
            <p className="text-sm text-gray-500">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={toggleMode}
                className="font-semibold text-nit-primary hover:text-nit-accent transition-colors"
              >
                {isLogin ? 'Create one' : 'Sign in'}
              </button>
            </p>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};
