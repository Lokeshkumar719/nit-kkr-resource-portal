import React from 'react';
import { User, Mail, GraduationCap } from 'lucide-react';
import { BRANCHES, ALL_MENTOR_YEARS, ALUMNI_YEAR_VALUE } from '../../../constants/index.js';

export default function BasicInfoSection({ formData, setFormData }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
        <User className="w-4 h-4 text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-700 uppercase">Basic Info</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-nit-primary"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Full Name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-gray-400" /> Email
          </label>
          <input
            type="email"
            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-nit-primary"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Email Address (Optional)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-gray-400" /> Branch{' '}
            <span className="text-red-500">*</span>
          </label>
          <select
            required
            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-nit-primary"
            value={formData.branch}
            onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
          >
            <option value="">Select Branch</option>
            {BRANCHES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-gray-400" /> Year{' '}
            <span className="text-red-500">*</span>
          </label>
          <select
            required
            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-nit-primary"
            value={formData.year}
            onChange={(e) => {
              const newYear = e.target.value;
              setFormData({
                ...formData,
                year: newYear,
                batchStart: newYear !== ALUMNI_YEAR_VALUE ? '' : formData.batchStart,
                batchEnd: newYear !== ALUMNI_YEAR_VALUE ? '' : formData.batchEnd,
              });
            }}
          >
            {ALL_MENTOR_YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {formData.year === ALUMNI_YEAR_VALUE && (
          <div className="sm:col-span-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <label className="block text-sm font-medium text-amber-800 mb-1 flex items-center gap-1.5">
              Batch (Required for Alumni) <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="2019"
                required={formData.year === ALUMNI_YEAR_VALUE}
                className="w-24 p-2 border border-amber-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500 text-center"
                value={formData.batchStart}
                onChange={(e) => setFormData({ ...formData, batchStart: e.target.value })}
              />
              <span className="text-amber-800 font-semibold">-</span>
              <input
                type="number"
                placeholder="2023"
                required={formData.year === ALUMNI_YEAR_VALUE}
                className="w-24 p-2 border border-amber-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500 text-center"
                value={formData.batchEnd}
                onChange={(e) => setFormData({ ...formData, batchEnd: e.target.value })}
              />
            </div>
            <p className="text-xs text-amber-700 mt-1.5">Example: 2019 - 2023</p>
          </div>
        )}
      </div>
    </div>
  );
}
