import React, { useState, useEffect } from 'react';
import { Check, Loader } from 'lucide-react';
import { RESOURCE_TYPES } from '../../constants/index.js';
import ModalLayout from '../admin/modals/ModalLayout.jsx';
import toast from 'react-hot-toast';

export default function EditContributionModal({ contribution, onSave, onCancel, isSaving }) {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    url: '',
  });

  useEffect(() => {
    if (contribution) {
      setFormData({
        title: contribution.title || '',
        type: contribution.type || '',
        url: contribution.url || '',
      });
    }
  }, [contribution]);

  const handleSave = () => {
    if (!formData.title.trim() || !formData.type) {
      toast.error('Title and Type are required.');
      return;
    }

    const payload = {
      title: formData.title,
      type: formData.type,
      ...(formData.type === 'LECTURES' && { url: formData.url }),
    };

    onSave(contribution._id, payload);
  };

  if (!contribution) return null;

  return (
    <ModalLayout className="max-w-lg">
      <div className="flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">Edit Contribution</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition p-1"
            aria-label="Close modal"
          >
            <span className="text-xl leading-none">&times;</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-nit-primary"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Contribution Title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resource Type</label>
            <select
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-nit-primary"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="">Select Type</option>
              {RESOURCE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {formData.type === 'LECTURES' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lecture URL</label>
              <input
                type="url"
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-nit-primary"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://youtube.com/..."
              />
            </div>
          )}

          {contribution.fileName && (
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700">
              <span className="font-semibold">Note:</span> This contribution contains an uploaded
              file (
              <button
                type="button"
                className="font-bold underline cursor-pointer hover:text-blue-900"
                onClick={async () => {
                  try {
                    const { getContributionDownloadUrl } = await import('../../services/api');
                    const res = await getContributionDownloadUrl(contribution._id);
                    if (res.data?.data?.downloadUrl)
                      window.location.href = res.data.data.downloadUrl;
                  } catch (err) {
                    toast.error('Could not generate download link.');
                  }
                }}
                title="Download File"
              >
                {contribution.fileName}
              </button>
              ). File replacement is not supported during edit. To replace the file, you must reject
              this and ask the contributor to re-upload.
            </div>
          )}
        </div>

        <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 mt-auto">
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 text-sm font-medium bg-nit-primary text-white rounded-lg hover:bg-blue-900 transition flex items-center gap-2 disabled:opacity-70"
          >
            {isSaving ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}{' '}
            Save Changes
          </button>
        </div>
      </div>
    </ModalLayout>
  );
}
