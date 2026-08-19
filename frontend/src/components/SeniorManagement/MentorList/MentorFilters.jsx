import React from 'react';
import { Users } from 'lucide-react';
import { BRANCHES, ALL_MENTOR_YEARS } from '../../../constants/index.js';
import PillFilterBar from '../../admin/filters/PillFilterBar.jsx';

export default function MentorFilters({
  currentBranch,
  onBranchChange,
  currentYear,
  onYearChange,
  mentorCount,
  showYearFilter,
}) {
  return (
    <div className="space-y-4 mb-6">
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Branch</label>
        <select
          className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-nit-primary"
          value={currentBranch}
          onChange={(e) => onBranchChange(e.target.value)}
        >
          <option value="">Select Branch</option>
          {BRANCHES.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {showYearFilter && (
        <div className="border-t border-slate-200 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
              <Users className="w-4 h-4" /> Profiles ({mentorCount})
            </h3>
            <PillFilterBar
              options={['ALL', ...ALL_MENTOR_YEARS]}
              currentValue={currentYear}
              onChange={onYearChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
