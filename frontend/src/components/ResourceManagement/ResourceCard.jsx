import React from 'react';
import {
  Video,
  BookOpen,
  FileText,
  StickyNote,
  Edit2,
  ExternalLink,
  Download,
  Loader,
  Trash2,
} from 'lucide-react';
import { getResourceDownloadUrl } from '../../services/api';
import toast from 'react-hot-toast';

export default function ResourceCard({ resource, onEdit, onDelete, isDeleting }) {
  const typeIcons = {
    LECTURES: Video,
    BOOKS: BookOpen,
    PYQS: FileText,
    NOTES: StickyNote,
  };
  const typeColors = {
    LECTURES: 'bg-violet-100 text-violet-700',
    BOOKS: 'bg-blue-100 text-blue-700',
    PYQS: 'bg-amber-100 text-amber-700',
    NOTES: 'bg-emerald-100 text-emerald-700',
  };

  const Icon = typeIcons[resource.type] || FileText;

  const handleDownload = async () => {
    try {
      const res = await getResourceDownloadUrl(resource._id);
      if (res.data?.data?.downloadUrl) {
        window.location.href = res.data.data.downloadUrl;
      }
    } catch (e) {
      toast.error('Download failed.');
    }
  };

  const uploadDate = resource.createdAt
    ? new Date(resource.createdAt).toLocaleDateString()
    : 'Unknown Date';

  return (
    <div className="flex items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition shadow-sm">
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${typeColors[resource.type] || 'bg-gray-100 text-gray-600'}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">{resource.title}</p>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {resource.type}
            </span>
            <span className="text-xs text-gray-400">• {uploadDate}</span>
            {resource.fileName && (
              <span
                className="text-xs text-gray-400 truncate max-w-[200px]"
                title={resource.fileName}
              >
                • {resource.fileName}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onEdit(resource)}
          disabled={isDeleting}
          className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 transition disabled:opacity-50"
          aria-label="Edit"
          title="Edit"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        {resource.url && (
          <a
            href={resource.url}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 transition"
            aria-label="Open Link"
            title="Open Link"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
        {resource.fileKey && (
          <button
            onClick={handleDownload}
            disabled={isDeleting}
            className="p-2 rounded-lg bg-nit-primary text-white hover:bg-blue-900 transition disabled:opacity-50"
            aria-label="Download"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => onDelete(resource)}
          disabled={isDeleting}
          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition disabled:opacity-50"
          aria-label="Delete"
          title="Delete"
        >
          {isDeleting ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
