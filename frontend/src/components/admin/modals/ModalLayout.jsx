import React from 'react';

export default function ModalLayout({ children, className = '' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div
        className={`bg-white rounded-2xl w-full shadow-xl overflow-hidden flex flex-col ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
