import React from 'react';
import ConfirmModal from '../admin/modals/ConfirmModal.jsx';
import { Trash2 } from 'lucide-react';

export default function DeleteSubjectModal({ subject, onConfirm, onCancel, isDeleting }) {
  if (!subject) return null;

  return (
    <ConfirmModal
      title="Delete Subject"
      description={
        <>
          Are you sure you want to delete <span className="font-bold">{subject.subjectName}</span> (
          {subject.subjectCode})?
          <br />
          <br />
          This action cannot be undone. All resources and contributions associated with this subject
          will also be permanently deleted.
        </>
      }
      confirmText="Delete"
      confirmIcon={Trash2}
      onConfirm={() => onConfirm(subject._id)}
      onCancel={onCancel}
      isLoading={isDeleting}
    />
  );
}
