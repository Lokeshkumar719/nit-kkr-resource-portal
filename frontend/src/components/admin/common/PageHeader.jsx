import React from 'react';

export default function PageHeader({ icon: Icon, title, children }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl shadow-sm border border-slate-300 gap-4">
      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5 text-nit-primary" />} {title}
      </h2>
      {children && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          {children}
        </div>
      )}
    </div>
  );
}
