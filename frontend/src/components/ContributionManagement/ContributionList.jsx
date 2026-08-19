import React from 'react';
import { Inbox, FileText } from 'lucide-react';
import { ContributionSkeleton } from '../ui/Skeleton.jsx';
import ContributionCard from './ContributionCard.jsx';
import EmptyState from '../admin/common/EmptyState.jsx';

export default function ContributionList({
  contributions,
  isFetching,
  currentFilter,
  onEdit,
  onApprove,
  onReject,
  isApprovingId,
  isRejectingId,
}) {
  const filteredContributions =
    currentFilter === 'ALL' ? contributions : contributions.filter((c) => c.type === currentFilter);

  if (isFetching && contributions.length === 0) {
    return <ContributionSkeleton rows={3} />;
  }

  if (contributions.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="All caught up!"
        description="There are no pending contributions to review at this time."
        className="bg-white shadow-sm border border-slate-200 border-solid"
      />
    );
  }

  if (filteredContributions.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title={`No ${currentFilter.toLowerCase()} available for review.`}
        description="Try selecting a different filter."
      />
    );
  }

  return (
    <div className="space-y-3">
      {filteredContributions.map((contribution) => (
        <ContributionCard
          key={contribution._id}
          contribution={contribution}
          onEdit={onEdit}
          onApprove={onApprove}
          onReject={onReject}
          isApproving={isApprovingId === contribution._id}
          isRejecting={isRejectingId === contribution._id}
        />
      ))}
    </div>
  );
}
