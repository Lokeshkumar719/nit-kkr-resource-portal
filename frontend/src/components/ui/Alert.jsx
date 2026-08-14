import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

export const Alert = ({ type = 'error', message, onDismiss }) => {
  if (!message) return null;

  const styles = {
    error: 'bg-red-50 text-red-800 border-red-200',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  };

  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div className={`flex items-start gap-2.5 p-3 rounded-lg border text-sm animate-fade-in ${styles[type]}`}>
      <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <span className="flex-1 leading-relaxed">{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="opacity-60 hover:opacity-100 text-lg leading-none">&times;</button>
      )}
    </div>
  );
};
