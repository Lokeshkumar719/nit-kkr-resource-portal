import React from 'react';

// Base shimmer block — all other skeletons compose from this.
const Bone = ({ className = '' }) => (
  <div className={`bg-slate-200 rounded relative overflow-hidden ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
  </div>
);

export const Skeleton = ({ className = '' }) => <Bone className={className} />;

// For Resources.jsx subject list rows while loading
export const ResourceSkeleton = ({ rows = 5 }) => (
  <div className="space-y-1.5">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="px-4 py-3 rounded-lg border border-gray-200 bg-white">
        <Bone className="h-4 w-3/4 mb-2" />
        <Bone className="h-3 w-1/3" />
      </div>
    ))}
  </div>
);

// For Seniors.jsx / Alumni.jsx profile card grids while loading
export const ProfileSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Bone className="h-16 w-full rounded-none" />
        <div className="px-5 -mt-8">
          <Bone className="w-16 h-16 rounded-full border-4 border-white" />
        </div>
        <div className="px-5 pt-3 pb-5 space-y-2">
          <Bone className="h-4 w-2/3" />
          <Bone className="h-3 w-1/2" />
          <Bone className="h-9 w-full rounded-lg mt-3" />
        </div>
      </div>
    ))}
  </div>
);

// For AdminDashboard.jsx contributions list / any tabular admin data
export const TableSkeleton = ({ rows = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 flex items-center justify-between gap-4">
        <div className="flex-1 space-y-2">
          <Bone className="h-3 w-20" />
          <Bone className="h-4 w-2/3" />
        </div>
        <div className="flex gap-2 shrink-0">
          <Bone className="h-9 w-9 rounded-lg" />
          <Bone className="h-9 w-9 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

// For Contribute.jsx submit button while an upload/submission is in flight.
// Distinct from ButtonSpinner (in Spinner.jsx) in that it communicates
// "your file/data is being sent" specifically, for use if/when the
// backend adds real ZIP upload support.
export const UploadLoader = ({ label = 'Uploading...' }) => (
  <div className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-gray-500">
    <div className="w-4 h-4 border-2 border-slate-300 border-t-nit-accent rounded-full animate-spin" />
    {label}
  </div>
);