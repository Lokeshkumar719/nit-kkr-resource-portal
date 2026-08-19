import React, { useState, useRef, useEffect } from 'react';
import { Loader } from 'lucide-react';
import { BRANCHES, SEMESTERS } from '../../constants/index.js';
import { api } from '../../services/api';
import toast from 'react-hot-toast';
import { parseRateLimitError } from '../../utils/rateLimitUtils.js';
import { useRateLimitCountdown } from '../../hooks/useRateLimitCountdown.js';

export default function AddResourceForm() {
  const [loading, setLoading] = useState(false);
  const [isFetchingSubjects, setIsFetchingSubjects] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [existingSubjects, setExistingSubjects] = useState([]);

  const resourceRateLimit = useRateLimitCountdown('resource');

  const [formData, setFormData] = useState({
    branch: '',
    semester: '1',
    subjectId: '',
    resourceTitle: '',
    resourceType: 'LECTURES',
    resourceLink: '',
  });
  const [resourceFile, setResourceFile] = useState(null);
  const fileInputRef = useRef(null);

  const fetchSubjects = async () => {
    if (formData.branch && formData.semester) {
      setIsFetchingSubjects(true);
      try {
        const res = await api.get('/subjects', {
          params: { branch: formData.branch, semester: formData.semester },
        });
        setExistingSubjects(res.data?.data?.subjects || res.data?.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setIsFetchingSubjects(false);
      }
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [formData.branch, formData.semester]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const fd = new FormData();
      fd.append('subjectId', formData.subjectId);
      fd.append('title', formData.resourceTitle);
      fd.append('type', formData.resourceType);

      if (formData.resourceType === 'LECTURES') {
        fd.append('url', formData.resourceLink);
      } else {
        fd.append('resource', resourceFile);
      }

      await api.post('/resources', fd);
      toast.success('Resource added.');
      setFormData((prev) => ({ ...prev, resourceTitle: '', resourceLink: '' }));
      setResourceFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      const { isRateLimited, retryAfterSeconds } = parseRateLimitError(err);
      if (isRateLimited) {
        resourceRateLimit.triggerRateLimit(retryAfterSeconds);
        toast.error(`Rate limit reached. Please wait ${retryAfterSeconds} seconds.`);
      } else {
        const errorMsg = err.response?.data?.message || 'Operation failed.';
        setMessage({ type: 'error', text: errorMsg });
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-300">
      {message.text && (
        <div
          className={`mb-4 p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4 items-end mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
            <select
              required
              className="w-full p-2.5 border border-gray-300 rounded-lg"
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
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
              <select
                required
                className="w-full p-2.5 border border-gray-300 rounded-lg"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              >
                {SEMESTERS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Subject</label>
              <select
                required
                className="w-full p-2.5 border border-gray-300 rounded-lg disabled:bg-gray-100"
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                disabled={!formData.branch || isFetchingSubjects}
              >
                <option value="">
                  {existingSubjects.length
                    ? 'Select a subject'
                    : 'No subjects found for this branch/semester'}
                </option>
                {existingSubjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.subjectName} ({s.subjectCode})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resource Type</label>
              <select
                required
                className="w-full p-2.5 border border-gray-300 rounded-lg"
                value={formData.resourceType}
                onChange={(e) => setFormData({ ...formData, resourceType: e.target.value })}
              >
                <option value="LECTURES">Lectures (URL)</option>
                <option value="BOOKS">Books (File)</option>
                <option value="NOTES">Notes (File)</option>
                <option value="PYQS">PYQs (File)</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Resource Title</label>
              <input
                type="text"
                required
                className="w-full p-2.5 border border-gray-300 rounded-lg"
                value={formData.resourceTitle}
                onChange={(e) => setFormData({ ...formData, resourceTitle: e.target.value })}
                placeholder="e.g. Midsem Notes"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.resourceType === 'LECTURES' ? 'Resource Link' : 'Upload File'}
              </label>
              {formData.resourceType === 'LECTURES' ? (
                <input
                  type="url"
                  required
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nit-primary outline-none transition"
                  placeholder="https://youtube.com/watch?v=..."
                  value={formData.resourceLink}
                  onChange={(e) => setFormData({ ...formData, resourceLink: e.target.value })}
                />
              ) : (
                <input
                  ref={fileInputRef}
                  type="file"
                  required
                  accept=".pdf,.zip,.rar,.doc,.docx"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-nit-primary outline-none transition"
                  onChange={(e) => setResourceFile(e.target.files?.[0] || null)}
                />
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || resourceRateLimit.isRateLimited}
          className="w-full bg-nit-primary text-white py-2.5 rounded-lg hover:bg-blue-900 transition flex justify-center items-center gap-2 mt-6 disabled:opacity-60 disabled:hover:bg-nit-primary"
        >
          {loading ? (
            <Loader className="animate-spin w-4 h-4" />
          ) : resourceRateLimit.isRateLimited ? (
            `Upload Available in ${resourceRateLimit.formattedCountdown}`
          ) : (
            'Add Resource'
          )}
        </button>
      </form>
    </div>
  );
}
