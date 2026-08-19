import React, { useState } from 'react';
import { BookOpen, Edit2 } from 'lucide-react';
import PageHeader from '../admin/common/PageHeader.jsx';
import CreateSubjectForm from './CreateSubjectForm.jsx';
import SubjectList from './SubjectList.jsx';
import { useSubjects } from './hooks/useSubjects.js';

export default function SubjectManagementTab() {
  const [mode, setMode] = useState('manage_subjects');

  const {
    subjects,
    isFetchingSubjects,
    isSaving,
    isDeletingId,
    fetchSubjectsList,
    createSubject,
    updateSubject,
    deleteSubject,
  } = useSubjects();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-gray-800">Manage Subjects</h2>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setMode('manage_subjects')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            mode === 'manage_subjects'
              ? 'bg-nit-primary text-white shadow-sm'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Edit2 className="w-4 h-4" /> Manage Subjects
        </button>
        <button
          onClick={() => setMode('create_subject')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            mode === 'create_subject'
              ? 'bg-nit-primary text-white shadow-sm'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Create Subject
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-300">
        {mode === 'manage_subjects' ? (
          <SubjectList
            subjects={subjects}
            isFetchingSubjects={isFetchingSubjects}
            fetchSubjectsList={fetchSubjectsList}
            updateSubject={updateSubject}
            deleteSubject={deleteSubject}
            isSaving={isSaving}
            isDeletingId={isDeletingId}
          />
        ) : (
          <CreateSubjectForm createSubject={createSubject} />
        )}
      </div>
    </div>
  );
}
