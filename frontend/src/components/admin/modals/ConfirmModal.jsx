import React from 'react';
import ModalLayout from './ModalLayout.jsx';
import LoadingButton from '../common/LoadingButton.jsx';

export default function ConfirmModal({
  icon: Icon,
  iconColorClass = 'text-red-600',
  iconBgClass = 'bg-red-100',
  title,
  description,
  confirmText = 'Confirm',
  confirmColorClass = 'bg-red-600 hover:bg-red-700 text-white',
  confirmIcon: ConfirmIcon,
  onConfirm,
  onCancel,
  isLoading,
  children,
}) {
  return (
    <ModalLayout className="max-w-md">
      <div className="p-6">
        {Icon && (
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${iconBgClass}`}
          >
            <Icon className={`w-8 h-8 ${iconColorClass}`} />
          </div>
        )}
        {title && <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">{title}</h2>}
        {description && <p className="text-sm text-gray-500 mb-4 text-center">{description}</p>}
        {children}
      </div>

      <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 mt-auto">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <LoadingButton
          onClick={onConfirm}
          isLoading={isLoading}
          icon={ConfirmIcon}
          className={confirmColorClass}
        >
          {confirmText}
        </LoadingButton>
      </div>
    </ModalLayout>
  );
}
