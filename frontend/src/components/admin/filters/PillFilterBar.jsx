import React from 'react';

export default function PillFilterBar({
  options,
  currentValue,
  onChange,
  getCount,
  className = '',
}) {
  return (
    <div
      className={`flex bg-slate-100 rounded-lg p-1 border border-slate-200 w-fit overflow-x-auto ${className}`}
    >
      {options.map((option) => {
        const isActive = currentValue === option;
        const count = getCount ? getCount(option) : null;

        return (
          <button
            key={option}
            onClick={(e) => {
              e.preventDefault();
              onChange(option);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition flex items-center gap-1.5 ${
              isActive
                ? 'bg-white text-nit-primary shadow-sm border border-slate-200'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {option}
            {count !== null && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  isActive ? 'bg-blue-50 text-nit-primary' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
