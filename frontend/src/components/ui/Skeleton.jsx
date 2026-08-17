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
      <div key={i} className="px-4 py-3 rounded-lg border border-slate-300 bg-white">
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
      <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-300 overflow-hidden">
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

// For AdminDashboard.jsx contributions list — matches actual contribution cards
export const ContributionSkeleton = ({ rows = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-slate-300 flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex-1 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Bone className="h-5 w-14 rounded" />
            <Bone className="h-3 w-20" />
            <Bone className="h-3 w-16" />
          </div>
          <Bone className="h-4 w-4/5 mb-3" />
          <Bone className="h-3 w-2/3" />
        </div>
        <div className="flex gap-2 shrink-0">
          <Bone className="h-9 w-9 rounded-lg" />
          <Bone className="h-9 w-9 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

// For AdminDashboard.jsx Overview tab
export const OverviewSkeleton = () => (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
      <div className="p-6 rounded-xl border-l-4 border-emerald-500 shadow-sm bg-white">
        <Bone className="h-3 w-28 mb-3" />
        <Bone className="h-8 w-16" />
      </div>
      <div className="p-6 rounded-xl border-l-4 border-amber-500 shadow-sm bg-white">
        <Bone className="h-3 w-28 mb-3" />
        <Bone className="h-8 w-16" />
      </div>
    </div>

    <div className="border-t border-slate-200 pt-8 mb-6">
      <Bone className="h-6 w-48 mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border-l-4 border-red-500 shadow-sm bg-white">
          <Bone className="h-3 w-28 mb-3" />
          <Bone className="h-8 w-16" />
        </div>
      </div>
    </div>

    <Bone className="h-10 w-32 rounded-lg" />
  </>
);

// For AdminDashboard.jsx Resources & Seniors form tabs
export const AdminFormSkeleton = () => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <Bone className="h-7 w-48" />
      <Bone className="h-10 w-56 rounded-lg" />
    </div>
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-300 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Bone className="h-4 w-16 mb-2" />
          <Bone className="h-11 w-full rounded-lg" />
        </div>
        <div>
          <Bone className="h-4 w-20 mb-2" />
          <Bone className="h-11 w-full rounded-lg" />
        </div>
      </div>
      <div>
        <Bone className="h-4 w-28 mb-2" />
        <Bone className="h-11 w-full rounded-lg" />
      </div>
      <Bone className="h-11 w-full rounded-lg" />
    </div>
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

// Content Skeleton — matches Dashboard.jsx layout exactly:
// Welcome banner (rounded-2xl) + "Quick Access" label + 4-col card grid
export const AppSkeleton = () => (
  <div className="space-y-6">
    {/* Welcome banner skeleton */}
    <Bone className="h-44 sm:h-48 w-full rounded-2xl" />

    {/* "Quick Access" label */}
    <div>
      <Bone className="h-4 w-28 mb-4" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
            <Bone className="h-1 w-full rounded-none" />
            <div className="p-5 space-y-3">
              <Bone className="w-11 h-11 rounded-xl" />
              <Bone className="h-4 w-2/3" />
              <Bone className="h-3 w-full" />
              <Bone className="h-3 w-1/2" />
              <Bone className="h-4 w-20 mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Admin Dashboard Skeleton — matches AdminDashboard.jsx layout exactly:
// Sidebar (back+title row, 4 nav items) + main content (2 stat cards + status block)
export const AdminAppSkeleton = () => (
  <div className="flex flex-col md:flex-row min-h-screen -m-4 sm:-m-6 lg:-m-8">
    {/* Sidebar Skeleton */}
    <div className="bg-white w-full md:w-64 shadow-sm border-r border-slate-300 flex flex-col md:min-h-screen z-10">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Bone className="w-8 h-8 rounded-lg shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Bone className="h-5 w-3/4" />
            <Bone className="h-3 w-1/2" />
          </div>
        </div>
      </div>
      <div className="flex-1 p-4 space-y-1">
        <Bone className="h-10 w-full rounded-lg" />
        <Bone className="h-10 w-full rounded-lg" />
        <Bone className="h-10 w-full rounded-lg" />
        <Bone className="h-10 w-full rounded-lg" />
      </div>
    </div>
    {/* Main Content — matches OverviewTab */}
    <div className="flex-1 p-6 md:p-8 space-y-6">
      <Bone className="h-7 w-32 mb-2" />
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-300 space-y-4">
        <Bone className="h-4 w-32" />
        <div className="grid sm:grid-cols-3 gap-4">
          <Bone className="h-11 w-full rounded-lg" />
          <Bone className="h-11 w-full rounded-lg" />
          <Bone className="h-11 w-full rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="p-6 rounded-xl border-l-4 border-emerald-500 shadow-sm bg-white">
          <Bone className="h-3 w-28 mb-3" />
          <Bone className="h-8 w-16" />
        </div>
        <div className="p-6 rounded-xl border-l-4 border-amber-500 shadow-sm bg-white">
          <Bone className="h-3 w-28 mb-3" />
          <Bone className="h-8 w-16" />
        </div>
      </div>

      <div className="border-t border-slate-200 pt-8 mb-6">
        <Bone className="h-6 w-48 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border-l-4 border-red-500 shadow-sm bg-white">
            <Bone className="h-3 w-28 mb-3" />
            <Bone className="h-8 w-16" />
          </div>
        </div>
      </div>
    </div>
  </div>
);