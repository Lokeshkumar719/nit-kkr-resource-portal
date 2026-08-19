import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export const ResetSuccess = ({ authFlow }) => {
  const { goBackToLogin } = authFlow;

  return (
    <div className="text-center py-6 animate-fade-in">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-full mb-5 border border-emerald-100">
        <ShieldCheck className="w-8 h-8 text-emerald-600" />
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-1">Password Reset Successfully!</h3>
      <p className="text-sm text-gray-500 mb-6">
        Your password has been updated. Please sign in with your new password.
      </p>
      <button onClick={goBackToLogin} className="btn-primary inline-flex">
        Sign In Now <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
