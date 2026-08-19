import React from 'react';
import { Users, AlertCircle } from 'lucide-react';
import { ProfileSkeleton } from '../../ui/Skeleton.jsx';
import MentorCard from './MentorCard.jsx';
import MentorFilters from './MentorFilters.jsx';
import EmptyState from '../../admin/common/EmptyState.jsx';

export default function MentorList({
  mentors,
  isFetching,
  currentBranch,
  onBranchChange,
  currentYear,
  onYearChange,
  onEdit,
  onDelete,
}) {
  // Client-side year filtering (matches original behavior)
  const filteredMentors =
    currentYear === 'ALL' ? mentors : mentors.filter((m) => m.currentYear === currentYear);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
      <MentorFilters
        currentBranch={currentBranch}
        onBranchChange={onBranchChange}
        currentYear={currentYear}
        onYearChange={onYearChange}
        mentorCount={filteredMentors.length}
        showYearFilter={!!currentBranch}
      />

      {!currentBranch ? (
        <EmptyState
          icon={Users}
          title="Select a branch"
          description="Choose a branch to view the seniors and alumni directory."
        />
      ) : isFetching ? (
        <ProfileSkeleton count={3} />
      ) : filteredMentors.length === 0 ? (
        <EmptyState
          icon={AlertCircle}
          title="No profiles found"
          description={`No profiles available for ${currentBranch}${currentYear !== 'ALL' ? ` in ${currentYear}` : ''}.`}
        />
      ) : (
        <div className="space-y-3">
          {filteredMentors.map((m) => (
            <MentorCard key={m._id} mentor={m} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
