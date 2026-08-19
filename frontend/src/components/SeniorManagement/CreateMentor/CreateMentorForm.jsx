import React, { useState } from 'react';
import { PlusCircle, Loader } from 'lucide-react';
import BasicInfoSection from './BasicInfoSection.jsx';
import ExperienceSection from './ExperienceSection.jsx';
import AchievementSection from './AchievementSection.jsx';
import TagsSection from './TagsSection.jsx';
import { DEFAULT_FORM_STATE } from '../constants.js';
import { formatMentorPayload } from '../utils.js';

export default function CreateMentorForm({ createMentor, isCreating }) {
  const [formData, setFormData] = useState({ ...DEFAULT_FORM_STATE });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = formatMentorPayload(formData);
    await createMentor(payload, () => setFormData({ ...DEFAULT_FORM_STATE }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300 overflow-hidden">
      <div className="bg-slate-50 p-4 border-b border-slate-200">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-nit-primary" /> Create New Profile
        </h3>
        <p className="text-sm text-gray-500 mt-1">Add a new senior or alumni to the directory.</p>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        <BasicInfoSection formData={formData} setFormData={setFormData} />
        <ExperienceSection formData={formData} setFormData={setFormData} />
        <AchievementSection formData={formData} setFormData={setFormData} />
        <TagsSection formData={formData} setFormData={setFormData} />

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={isCreating}
            className="px-6 py-2.5 bg-nit-primary text-white font-medium rounded-lg hover:bg-blue-900 transition flex items-center gap-2 disabled:opacity-70"
          >
            {isCreating ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <PlusCircle className="w-4 h-4" />
            )}{' '}
            Add Profile
          </button>
        </div>
      </form>
    </div>
  );
}
