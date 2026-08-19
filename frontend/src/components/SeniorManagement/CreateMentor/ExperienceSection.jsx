import React from 'react';
import { Briefcase, Building, Link2, ExternalLink } from 'lucide-react';

export default function ExperienceSection({ formData, setFormData }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
        <Briefcase className="w-4 h-4 text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-700 uppercase">Experience</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-gray-400" /> Company
          </label>
          <input
            type="text"
            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-nit-primary"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="e.g. Google, Microsoft"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5 text-gray-400" /> LinkedIn Profile
          </label>
          <input
            type="url"
            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-nit-primary"
            value={formData.linkedin}
            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
            placeholder="https://linkedin.com/in/..."
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" /> Profile Image URL
          </label>
          <input
            type="url"
            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-nit-primary"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>
    </div>
  );
}
