import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

export default function SubjectCard({ subject, onEdit, onDelete }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-nit-primary/30 transition-all gap-4">
      <div>
        <p className="font-bold text-gray-800 text-sm">{subject.subjectName}</p>
        <p className="text-xs text-gray-500 mt-1 font-mono">{subject.subjectCode}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {subject.offeredTo &&
            subject.offeredTo.map((combo, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full border border-slate-200"
              >
                {combo.branch} • Sem {combo.semester}
              </span>
            ))}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onEdit(subject)}
          className="p-2 text-gray-500 hover:text-nit-primary hover:bg-blue-50 rounded-lg transition"
          aria-label="Edit Subject"
          title="Edit Subject"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(subject)}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
          aria-label="Delete Subject"
          title="Delete Subject"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
