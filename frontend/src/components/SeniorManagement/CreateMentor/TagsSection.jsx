import React from 'react';
import { Tag } from 'lucide-react';
import { MENTOR_TAGS } from '../../../constants/index.js';

export default function TagsSection({ formData, setFormData }) {
  const toggleTag = (e, t) => {
    e.preventDefault();
    if (formData.tags.includes(t)) {
      setFormData({
        ...formData,
        tags: formData.tags.filter((tag) => tag !== t),
      });
    } else {
      setFormData({
        ...formData,
        tags: [...formData.tags, t],
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
        <Tag className="w-4 h-4 text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-700 uppercase">Expertise Tags</h3>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Areas of Expertise
        </label>
        <div className="flex flex-wrap gap-2">
          {MENTOR_TAGS.map((t) => {
            const isSelected = formData.tags?.includes(t);
            return (
              <button
                key={t}
                onClick={(e) => toggleTag(e, t)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all border ${isSelected ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
