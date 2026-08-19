import React from 'react';
import { Loader } from 'lucide-react';

export default function LoadingButton({
  isLoading,
  loadingText,
  icon: Icon,
  children,
  className = '',
  disabled,
  ...props
}) {
  return (
    <button
      disabled={isLoading || disabled}
      className={`flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg transition disabled:opacity-70 ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader className="w-4 h-4 animate-spin" />
          {loadingText || children}
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4" />}
          {children}
        </>
      )}
    </button>
  );
}
