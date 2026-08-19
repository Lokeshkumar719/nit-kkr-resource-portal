import React, { useState } from 'react';
import { BRANCHES, SEMESTERS } from '../../constants/index.js';
import toast from 'react-hot-toast';

export default function CreateSubjectForm({ createSubject }) {
  const [formData, setFormData] = useState({
    subjectName: '',
    subjectCode: '',
    offeredTo: [],
  });
  const [currentBranch, setCurrentBranch] = useState('');
  const [currentSemester, setCurrentSemester] = useState('1');

  const handleAddCombination = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.offeredTo.length === 0) {
      toast.error('Please add at least one branch and semester combination.');
      return;
    }
    const success = await createSubject(formData, () => {
      setFormData({ subjectName: '', subjectCode: '', offeredTo: [] });
      setCurrentBranch('');
      setCurrentSemester('1');
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-300">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
            <input
              type="text"
              required
              className="w-full p-2.5 border border-gray-300 rounded-lg"
              value={formData.subjectName}
              onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject Code</label>
            <input
              type="text"
              required
              className="w-full p-2.5 border border-gray-300 rounded-lg"
              value={formData.subjectCode}
              onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
            />
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 space-y-4">
          <label className="block text-sm font-medium text-gray-700">Offered To</label>
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <select
                className="w-full p-2.5 border border-gray-300 rounded-lg"
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
                className="w-full p-2.5 border border-gray-300 rounded-lg"
                value={currentSemester}
                onChange={(e) => setCurrentSemester(e.target.value)}
              >
                {SEMESTERS.map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={handleAddCombination}
              className="px-4 py-2.5 bg-nit-primary text-white rounded-lg hover:bg-blue-900 transition whitespace-nowrap"
            >
              + Add
            </button>
          </div>

          {formData.offeredTo.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.offeredTo.map((combo, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-nit-primary rounded-full border border-blue-100 text-sm font-medium"
                >
                  {combo.branch} • Sem {combo.semester}
                  <button
                    type="button"
                    onClick={() => handleRemoveCombination(combo.branch, combo.semester)}
                    className="text-blue-400 hover:text-red-500 transition"
                    aria-label="Remove"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-nit-primary text-white rounded-lg hover:bg-blue-900 transition font-medium"
        >
          Create Subject
        </button>
      </form>
    </div>
  );
}
