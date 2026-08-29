import React, { useState, useEffect } from 'react';
import { BRANCHES, SEMESTERS } from '../../constants/index.js';
import { Check, Loader } from 'lucide-react';
import ModalLayout from '../admin/modals/ModalLayout.jsx';
import toast from 'react-hot-toast';

export default function EditSubjectModal({ subject, onSave, onCancel, isSaving }) {
  const [formData, setFormData] = useState({
    subjectName: '',
    subjectCode: '',
    offeredTo: [],
  });
  const [currentBranch, setCurrentBranch] = useState('');
  const [currentSemester, setCurrentSemester] = useState('1');

  // Pre-populate data securely on mount/subject change
  useEffect(() => {
    if (subject) {
      setFormData({
        subjectName: subject.subjectName,
        subjectCode: subject.subjectCode,
        offeredTo: [...(subject.offeredTo || []).map((c) => ({ ...c }))],
      });
      setCurrentBranch('');
      setCurrentSemester('1');
    }
  }, [subject]);

  const handleAddCombination = (e) => {
    e.preventDefault();
    if (!currentBranch || !currentSemester) return;

    const exists = formData.offeredTo.some(
      (c) => c.branch === currentBranch && c.semester === parseInt(currentSemester)
    );
    if (!exists) {
      setFormData((prev) => ({
        ...prev,
        offeredTo: [
          ...prev.offeredTo,
          { branch: currentBranch, semester: parseInt(currentSemester) },
        ],
      }));
    } else {
      toast.error('This combination is already added.');
    }
  };

  const handleRemoveCombination = (branch, semester) => {
    setFormData((prev) => ({
      ...prev,
      offeredTo: prev.offeredTo.filter((c) => !(c.branch === branch && c.semester === semester)),
    }));
  };

  const handleSave = () => {
    if (formData.offeredTo.length === 0) {
      toast.error('At least one branch-semester combination is required.');
      return;
    }
    onSave(subject._id, formData);
  };

  if (!subject) return null;

  return (
    <ModalLayout className="max-w-2xl">
      <div className="flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">Edit Subject</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition p-1"
            aria-label="Close modal"
          >
            <span className="text-xl leading-none">&times;</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
              <input
                type="text"
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
                value={formData.subjectName}
                onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                placeholder="Subject Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject Code</label>
              <input
                type="text"
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
                value={formData.subjectCode}
                onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
                placeholder="Subject Code"
              />
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 space-y-4 bg-slate-50/50">
            <label className="block text-sm font-medium text-gray-700">Offered To</label>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <select
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
                  value={currentBranch}
                  onChange={(e) => setCurrentBranch(e.target.value)}
                >
                  <option value="">Select Branch</option>
                  {BRANCHES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <select
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
                  value={currentSemester}
                  onChange={(e) => setCurrentSemester(e.target.value)}
                >
                  {SEMESTERS.map((s) => (
                    <option key={s} value={s}>
                      Sem {s}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={handleAddCombination}
                className="px-4 py-2.5 bg-nit-primary text-white rounded-lg hover:bg-blue-900 transition text-sm font-medium"
              >
                + Add
              </button>
            </div>

            {formData.offeredTo && formData.offeredTo.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.offeredTo.map((combo, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 text-nit-primary rounded-md border border-blue-100 text-xs font-medium"
                  >
                    {combo.branch} • Sem {combo.semester}
                    <button
                      type="button"
                      onClick={() => handleRemoveCombination(combo.branch, combo.semester)}
                      className="text-blue-400 hover:text-red-500 transition ml-1"
                      aria-label="Remove"
                      title="Remove"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 mt-auto">
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 text-sm font-medium bg-nit-primary text-white rounded-lg hover:bg-blue-900 transition flex items-center gap-2"
          >
            {isSaving ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}{' '}
            Save Changes
          </button>
        </div>
      </div>
    </ModalLayout>
  );
}
