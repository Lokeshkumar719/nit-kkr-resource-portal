import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import ConfirmModal from '../admin/modals/ConfirmModal.jsx';

export default function DeleteResourceModal({ resource, onConfirm, onCancel, isDeleting }) {
  if (!resource) return null;

  return (
    <ConfirmModal
      icon={AlertTriangle}
      title="Delete Resource"
      description={
        <>
          Are you sure you want to delete{' '}
          <span className="font-semibold text-gray-800">{resource.title}</span>? This action cannot
          be undone and the resource file will be permanently removed.
        </>
      }
      confirmText="Delete"
      confirmIcon={Trash2}
      onConfirm={() => onConfirm(resource._id)}
      onCancel={onCancel}
      isLoading={isDeleting}
    />
  );
}
