import React from 'react';
import { AlertCircle, Trash2 } from 'lucide-react';
import ConfirmModal from '../admin/modals/ConfirmModal.jsx';

export default function DeleteMentorModal({ mentor, onConfirm, onCancel, isDeleting }) {
  if (!mentor) return null;

  return (
    <ConfirmModal
      icon={AlertCircle}
      title="Delete Profile"
      description={
        <>
          Are you sure you want to delete{' '}
          <span className="font-semibold text-gray-800">{mentor.name}</span>'s profile? This action
          cannot be undone.
        </>
      }
      confirmText="Delete"
      confirmIcon={Trash2}
      onConfirm={() => onConfirm(mentor._id)}
      onCancel={onCancel}
      isLoading={isDeleting}
    />
  );
}
