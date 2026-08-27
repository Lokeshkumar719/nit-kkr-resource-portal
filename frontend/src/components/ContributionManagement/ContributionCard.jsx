import React from 'react';
import {
  Video,
  BookOpen,
  FileText,
  StickyNote,
  Edit2,
  ExternalLink,
  Download,
  Check,
  X,
  Loader,
} from 'lucide-react';
import { getContributionDownloadUrl } from '../../services/api';
import toast from 'react-hot-toast';

const TYPE_LABELS = { LECTURES: 'Lecture', BOOKS: 'Book', PYQS: 'PYQ', NOTES: 'Notes' };
const TYPE_COLORS = {
  LECTURES: 'bg-violet-100 text-violet-700',
  BOOKS: 'bg-blue-100 text-blue-700',
  PYQS: 'bg-amber-100 text-amber-700',
  NOTES: 'bg-emerald-100 text-emerald-700',
};

const getSemesterLabel = (sem) => {
  if (sem === 1) return '1st Semester';
  if (sem === 2) return '2nd Semester';
  if (sem === 3) return '3rd Semester';
  return `${sem}th Semester`;
};

export default function ContributionCard({
  contribution,
  onEdit,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}) {
  const Icon =
    { LECTURES: Video, BOOKS: BookOpen, PYQS: FileText, NOTES: StickyNote }[contribution.type] ||
    FileText;

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start gap-4 transition-all hover:border-slate-300">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span
            className={`px-2 py-0.5 text-xs font-semibold rounded uppercase flex items-center gap-1.5 ${TYPE_COLORS[contribution.type] || 'bg-gray-100 text-gray-700'}`}
          >
            <Icon className="w-3 h-3" />
            {TYPE_LABELS[contribution.type] || contribution.type}
          </span>
          <span className="text-xs text-gray-500 font-medium">
            {new Date(contribution.createdAt).toLocaleDateString()}
          </span>
          {contribution.contributedBy && (
            <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
              Contributed by: {contribution.contributedBy?.email || 'Unknown'}
            </span>
          )}
        </div>
        <p className="text-gray-800 text-sm font-medium mb-1 truncate">{contribution.title}</p>

        {contribution.fileName && (
          <p className="text-xs text-gray-500 truncate mb-1">
            <span className="font-semibold text-gray-600">File:</span> {contribution.fileName}
          </p>
        )}

        {contribution.url && (
          <p className="text-xs text-gray-500 truncate max-w-full">
            <span className="font-semibold text-gray-600">Link:</span>{' '}
            <a
              href={contribution.url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              {contribution.url}
            </a>
          </p>
        )}

        {contribution.subjectId?.offeredTo && contribution.subjectId.offeredTo.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-2">
            {contribution.subjectId.offeredTo.map((offer, idx) => (
              <span key={idx} className="text-xs text-gray-600 bg-gray-50 border border-gray-200 px-2 py-1 rounded-md font-medium">
                {offer.branch} • {getSemesterLabel(offer.semester)}
              </span>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-xs text-gray-500 bg-gray-50 border border-gray-200 px-2 py-1 rounded-md italic">
              Branch & Semester not specified
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => onEdit(contribution)}
          disabled={isApproving || isRejecting}
          className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 border border-amber-200 transition disabled:opacity-50"
          title="Edit"
        >
          <Edit2 className="w-4 h-4" />
        </button>

        {contribution.fileName && (
          <button
            onClick={async () => {
              try {
                const res = await getContributionDownloadUrl(contribution._id);
                if (res.data?.data?.downloadUrl) window.location.href = res.data.data.downloadUrl;
              } catch (err) {
                toast.error('Could not generate download link.');
              }
            }}
            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 border border-blue-200 transition disabled:opacity-50"
            title="Download File"
          >
            <Download className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => onApprove(contribution)}
          disabled={isApproving || isRejecting}
          className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 border border-emerald-200 transition disabled:opacity-50"
          title="Approve"
        >
          {isApproving ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
        </button>

        <button
          onClick={() => onReject(contribution)}
          disabled={isApproving || isRejecting}
          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 border border-red-200 transition disabled:opacity-50"
          title="Reject"
        >
          {isRejecting ? <Loader className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
