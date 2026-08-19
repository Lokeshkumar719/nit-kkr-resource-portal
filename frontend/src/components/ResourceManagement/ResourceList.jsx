import React from 'react';
import { FileText, Loader } from 'lucide-react';
import ResourceCard from './ResourceCard.jsx';
import EmptyState from '../admin/common/EmptyState.jsx';
import { ResourceSkeleton } from '../ui/Skeleton.jsx';

export default function ResourceList({
  resources,
  isFetching,
  currentFilter,
  onEdit,
  onDelete,
  isDeletingId,
}) {
  const filteredResources =
    currentFilter === 'ALL' ? resources : resources.filter((r) => r.type === currentFilter);

  if (isFetching) {
    return <ResourceSkeleton rows={3} />;
  }

  if (resources.length === 0) {
    return (
      <EmptyState icon={FileText} title="No resources found for this subject." className="py-10" />
    );
  }

  if (filteredResources.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title={`No ${currentFilter.toLowerCase()} available for this subject.`}
        description="Try selecting a different filter."
        className="py-10"
      />
    );
  }

  return (
    <div className="space-y-3">
      {filteredResources.map((resource) => (
        <ResourceCard
          key={resource._id}
          resource={resource}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={isDeletingId === resource._id}
        />
      ))}
    </div>
  );
}
