import React from 'react';
import { Award } from 'lucide-react';

export default function AchievementSection({ formData, setFormData }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
        <Award className="w-4 h-4 text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-700 uppercase">Achievements</h3>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notable Achievements</label>
        <textarea
          className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-nit-primary min-h-[80px]"
          value={formData.achievements}
          onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
          placeholder="e.g. ICPC Regionalist, GSoC'23 (Separate with commas)"
        />
        <p className="text-xs text-gray-500 mt-1">Separate multiple achievements with commas.</p>
      </div>
    </div>
  );
}
