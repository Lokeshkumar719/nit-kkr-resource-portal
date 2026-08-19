import React from 'react';

export default function EmptyState({ icon: Icon, title, description, children, className = '' }) {
  return (
    <div
      className={`text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center ${className}`}
    >
      {Icon && (
        <div className="w-16 h-16 mx-auto rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-slate-400" />
        </div>
      )}
      {title && <h3 className="text-lg font-bold text-gray-700 mb-1">{title}</h3>}
      {description && <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">{description}</p>}
      {children}
    </div>
  );
}
