import React, { useState } from 'react';
import { Award, Plus, X } from 'lucide-react';

export default function AchievementSection({ formData, setFormData }) {
  const [newAchievement, setNewAchievement] = useState('');

  const handleAddAchievement = (e) => {
    e.preventDefault();
    if (newAchievement.trim()) {
      setFormData({
        ...formData,
        achievements: [...(formData.achievements || []), newAchievement.trim()],
      });
      setNewAchievement('');
    }
  };

  const handleRemoveAchievement = (indexToRemove) => {
    setFormData({
      ...formData,
      achievements: formData.achievements.filter((_, idx) => idx !== indexToRemove),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
        <Award className="w-4 h-4 text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-700 uppercase">Achievements</h3>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notable Achievements</label>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            className="flex-1 p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-nit-primary"
            value={newAchievement}
            onChange={(e) => setNewAchievement(e.target.value)}
            placeholder="e.g. ICPC Regionalist, GSoC'23"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddAchievement(e);
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddAchievement}
            className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-medium text-sm transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        {formData.achievements && formData.achievements.length > 0 && (
          <ul className="space-y-2">
            {formData.achievements.map((ach, idx) => (
              <li
                key={idx}
                className="flex items-start justify-between gap-3 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
              >
                <span className="text-slate-700 flex-1 break-words leading-snug">{ach}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAchievement(idx)}
                  className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
