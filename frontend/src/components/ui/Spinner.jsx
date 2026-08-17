import React from 'react';

export const Spinner = ({ size = 'sm', light = false }) => {
  const sizes = {
    xs: 'w-3.5 h-3.5 border-[1.5px]',
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-[2.5px]',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div
      className={`
        ${sizes[size]} rounded-full animate-spin
        ${light ? 'border-white/30 border-t-white' : 'border-slate-200 border-t-nit-primary'}
      `}
    />
  );
};

export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-50">
    <div className="flex flex-col items-center gap-3">
      <Spinner size="md" />
      <p className="text-sm text-slate-500 font-medium">Loading...</p>
    </div>
  </div>
);

export const ButtonSpinner = () => <Spinner size="xs" light />;
