import React, { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import ConfirmModal from '../admin/modals/ConfirmModal.jsx';

export default function RejectContributionModal({
  contribution,
  onConfirm,
  onCancel,
  isRejecting,
}) {
  const [reason, setReason] = useState('');

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
      onConfirm={() => onConfirm(contribution._id, reason)}
      onCancel={onCancel}
      isLoading={isRejecting}
    >
      <div className="mt-4 text-left">
        <label className="block text-sm font-medium text-gray-700 mb-1">Reason (Optional)</label>
        <textarea
          className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500 resize-none h-24"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Provide a reason for rejection to help the contributor..."
        />
      </div>
    </ConfirmModal>
  );
}
