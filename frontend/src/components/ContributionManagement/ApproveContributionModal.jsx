import React from 'react';
import { CheckCircle } from 'lucide-react';
import ConfirmModal from '../admin/modals/ConfirmModal.jsx';

export default function ApproveContributionModal({
  contribution,
  onConfirm,
  onCancel,
  isApproving,
}) {
  if (!contribution) return null;

  return (
    <ConfirmModal
      icon={CheckCircle}
      iconColorClass="text-emerald-600"
      iconBgClass="bg-emerald-100"
      title="Approve Contribution"
      description={
        <>
          Are you sure you want to approve{' '}
          <span className="font-semibold text-gray-800">{contribution.title}</span>? This will make
          it publicly available to all students.
        </>
      }
      confirmText="Approve"
      confirmColorClass="bg-emerald-600 hover:bg-emerald-700 text-white"
      confirmIcon={CheckCircle}
      onConfirm={() => onConfirm(contribution._id)}
      onCancel={onCancel}
      isLoading={isApproving}
    />
  );
}
