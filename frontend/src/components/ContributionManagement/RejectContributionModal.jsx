import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import ConfirmModal from '../admin/modals/ConfirmModal.jsx';

export default function RejectContributionModal({
  contribution,
  onConfirm,
  onCancel,
  isRejecting,
}) {
  if (!contribution) return null;

  return (
    <ConfirmModal
      icon={AlertCircle}
      title="Reject Contribution"
      description={
        <>
          Are you sure you want to reject{' '}
          <span className="font-semibold text-gray-800">{contribution.title}</span>? This will
          remove it from the pending list and the file will be deleted.
        </>
      }
      confirmText="Reject"
      confirmIcon={X}
      onConfirm={() => onConfirm(contribution._id)}
      onCancel={onCancel}
      isLoading={isRejecting}
    />
  );
}
