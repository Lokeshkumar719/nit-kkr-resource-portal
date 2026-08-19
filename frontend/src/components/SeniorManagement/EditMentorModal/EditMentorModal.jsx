import React, { useState, useEffect } from 'react';
import { Check, Loader } from 'lucide-react';
import BasicInfoSection from '../CreateMentor/BasicInfoSection.jsx';
import ExperienceSection from '../CreateMentor/ExperienceSection.jsx';
import AchievementSection from '../CreateMentor/AchievementSection.jsx';
import TagsSection from '../CreateMentor/TagsSection.jsx';
import { parseMentorToForm, formatMentorPayload } from '../utils.js';
import toast from 'react-hot-toast';

export default function EditMentorModal({ mentor, onSave, onCancel, isSaving }) {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (mentor) {
      setFormData(parseMentorToForm(mentor));
    }
  }, [mentor]);

  const handleSave = () => {
    if (!formData.name.trim() || !formData.branch) {
      toast.error('Name and Branch are required.');
      return;
    }

    if (formData.year === 'Alumni' && (!formData.batchStart || !formData.batchEnd)) {
      toast.error('Batch start and end are required for Alumni.');
      return;
    }

    const payload = formatMentorPayload(formData);
    onSave(mentor._id, payload);
  };

  if (!mentor || !formData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition p-1"
            aria-label="Close modal"
          >
            <span className="text-xl leading-none">&times;</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          <BasicInfoSection formData={formData} setFormData={setFormData} />
          <ExperienceSection formData={formData} setFormData={setFormData} />
          <AchievementSection formData={formData} setFormData={setFormData} />
          <TagsSection formData={formData} setFormData={setFormData} />
        </div>

        <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 mt-auto shrink-0">
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
    </div>
  );
}
