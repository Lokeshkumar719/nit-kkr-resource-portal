import React from 'react';

const colorMap = {
  PENDING: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-red-100 text-red-700',
  OPEN: 'bg-red-100 text-red-700',
  CLOSED: 'bg-emerald-100 text-emerald-700',
  RESOLVED: 'bg-emerald-100 text-emerald-700',
  BUG_REPORT: 'bg-red-100 text-red-700',
  DEFAULT: 'bg-slate-100 text-slate-700',
};

export default function StatusBadge({ status, label, className = '' }) {
  const displayLabel = label || status;
  const colorClass = colorMap[status] || colorMap.DEFAULT;

  return (
    <span
      className={`px-2 py-0.5 text-xs font-semibold rounded uppercase ${colorClass} ${className}`}
    >
      {displayLabel}
    </span>
  );
}
