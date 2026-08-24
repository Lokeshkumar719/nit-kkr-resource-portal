import React from 'react';
import { User, Edit2, ExternalLink, Trash2 } from 'lucide-react';
import { MENTOR_TAGS } from '../../../constants/index.js';

export default function MentorCard({ mentor, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition">
      <div className="md:w-48 bg-slate-50 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-slate-200 shrink-0">
        {mentor.image ? (
          <img
            src={mentor.image}
            alt={mentor.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm mb-3"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(mentor.name);
            }}
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-sm mb-3">
            <User className="w-10 h-10 text-blue-400" />
          </div>
        )}
        <h3 className="font-bold text-gray-800 text-center leading-tight">{mentor.name}</h3>
        <p className="text-xs text-gray-500 text-center mt-1 font-medium bg-white px-2 py-0.5 rounded-full border border-gray-200">
          {mentor.branch} • {mentor.currentYear}
        </p>
        {mentor.currentYear === 'Alumni' && mentor.batch && (
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-1">
            Batch {mentor.batch}
          </p>
        )}
      </div>

      <div className="p-5 flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3">
            {mentor.experiences?.[0]?.company && (
              <span className="text-sm text-gray-600 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="font-semibold text-gray-800">{mentor.experiences[0].company}</span>
              </span>
            )}
            {mentor.email && (
              <span
                className="text-sm text-gray-600 flex items-center gap-1.5 truncate max-w-[200px]"
                title={mentor.email}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                {mentor.email}
              </span>
            )}
          </div>

          {mentor.achievements && mentor.achievements.length > 0 && (
            <div className="mb-4">
              <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Achievements
              </h4>
              <ul className="text-sm text-gray-600 space-y-0.5 list-inside list-disc">
                {mentor.achievements.map((ach, idx) => (
                  <li key={idx} title={ach} className="break-words">
                    {ach}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {mentor.tags && mentor.tags.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Expertise
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {mentor.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium border border-slate-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
          <button
            onClick={() => onEdit(mentor)}
            className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 transition"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          {mentor.linkedin && (
            <a
              href={mentor.linkedin}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 transition"
              title="LinkedIn"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          <button
            onClick={() => onDelete(mentor)}
            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
