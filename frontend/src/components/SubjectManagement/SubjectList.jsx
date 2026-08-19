import React, { useState, useEffect } from 'react';
import { BookOpen, Loader, Filter } from 'lucide-react';
import { BRANCHES, SEMESTERS } from '../../constants/index.js';
import SubjectCard from './SubjectCard.jsx';
import EditSubjectModal from './EditSubjectModal.jsx';
import DeleteSubjectModal from './DeleteSubjectModal.jsx';
import EmptyState from '../admin/common/EmptyState.jsx';

export default function SubjectList({
  subjects,
  isFetchingSubjects,
  fetchSubjectsList,
  updateSubject,
  deleteSubject,
  isSaving,
  isDeletingId,
}) {
  const [editingSubject, setEditingSubject] = useState(null);
  const [deletingSubject, setDeletingSubject] = useState(null);

  const [filterBranch, setFilterBranch] = useState('');
  const [filterSemester, setFilterSemester] = useState('');

  useEffect(() => {
    fetchSubjectsList(filterBranch, filterSemester);
  }, [fetchSubjectsList, filterBranch, filterSemester]);

  const handleSaveEdit = async (id, formData) => {
    await updateSubject(id, formData, () => setEditingSubject(null), filterBranch, filterSemester);
  };

  const handleConfirmDelete = async (id) => {
    await deleteSubject(id, () => setDeletingSubject(null), filterBranch, filterSemester);
  };

  const hasSelectedFilters = filterBranch && filterSemester;

  return (
    <div className="mt-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-nit-primary" />
          {hasSelectedFilters
            ? `Subjects for ${filterBranch} • Semester ${filterSemester}`
            : 'Manage Subjects'}
        </h3>
        <div className="flex gap-3">
          <select
            className="p-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white transition min-w-[140px]"
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
          >
            <option value="">Select Branch</option>
            {BRANCHES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <select
            className="p-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white transition min-w-[140px]"
            value={filterSemester}
            onChange={(e) => setFilterSemester(e.target.value)}
          >
            <option value="">Select Semester</option>
            {SEMESTERS.map((s) => (
              <option key={s} value={s}>
                Sem {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!hasSelectedFilters ? (
        <EmptyState
          icon={Filter}
          description="Select a branch and semester to manage subjects."
          className="text-slate-500"
        />
      ) : isFetchingSubjects ? (
        <div className="flex justify-center py-12">
          <Loader className="w-6 h-6 animate-spin text-nit-primary" />
        </div>
      ) : subjects.length === 0 ? (
        <EmptyState description="No subjects found. Create one above!" />
      ) : (
        <div className="grid gap-3">
          {subjects.map((sub) => (
            <SubjectCard
              key={sub._id}
              subject={sub}
              onEdit={setEditingSubject}
              onDelete={setDeletingSubject}
            />
          ))}
        </div>
      )}

      {editingSubject && (
        <EditSubjectModal
          subject={editingSubject}
          isSaving={isSaving}
          onSave={handleSaveEdit}
          onCancel={() => setEditingSubject(null)}
        />
      )}

      {deletingSubject && (
        <DeleteSubjectModal
          subject={deletingSubject}
          isDeleting={isDeletingId === deletingSubject._id}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingSubject(null)}
        />
      )}
    </div>
  );
}
