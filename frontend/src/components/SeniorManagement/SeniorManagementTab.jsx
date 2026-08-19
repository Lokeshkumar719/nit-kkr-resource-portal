import React, { useState, useEffect } from 'react';
import { Users, LayoutDashboard } from 'lucide-react';
import useStickyState from '../../hooks/useStickyState';
import { useSeniorManagement } from './hooks/useSeniorManagement.js';
import CreateMentorForm from './CreateMentor/CreateMentorForm.jsx';
import MentorList from './MentorList/MentorList.jsx';
import EditMentorModal from './EditMentorModal/EditMentorModal.jsx';
import DeleteMentorModal from './DeleteMentorModal.jsx';

export default function SeniorManagementTab() {
  const [mode, setMode] = useStickyState('add_senior', 'admin_sen_mode');
  const [manageBranch, setManageBranch] = useStickyState('', 'admin_sen_manageBranch');
  const [manageYearFilter, setManageYearFilter] = useStickyState('ALL', 'admin_sen_manageYear');

  // Modal states
  const [editingMentor, setEditingMentor] = useState(null);
  const [deletingMentor, setDeletingMentor] = useState(null);

  const {
    mentors,
    isFetching,
    isCreating,
    isUpdatingId,
    isDeletingId,
    fetchMentors,
    createMentor,
    updateMentor,
    deleteMentor,
  } = useSeniorManagement();

  // Cleanup sticky state on unmount
  useEffect(() => {
    return () => {
      ['admin_sen_mode', 'admin_sen_manageBranch', 'admin_sen_manageYear'].forEach((k) =>
        sessionStorage.removeItem(k)
      );
    };
  }, []);

  // Fetch mentors when branch changes and in manage mode
  useEffect(() => {
    if (mode === 'manage_existing' && manageBranch) {
      fetchMentors(manageBranch);
    }
  }, [mode, manageBranch, fetchMentors]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setManageBranch('');
    setManageYearFilter('ALL');
    ['admin_sen_manageBranch', 'admin_sen_manageYear'].forEach((k) => sessionStorage.removeItem(k));
  };

  const handleSaveEdit = async (id, payload) => {
    await updateMentor(id, payload, () => setEditingMentor(null));
  };

  const handleConfirmDelete = async (id) => {
    await deleteMentor(id, () => setDeletingMentor(null));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-gray-800">Manage Seniors</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => handleModeChange('add_senior')}
          className={`flex items-center gap-2.5 p-3 rounded-xl border transition ${mode === 'add_senior' ? 'bg-nit-primary text-white border-nit-primary shadow-md' : 'bg-white text-gray-700 border-slate-300 hover:border-nit-primary hover:shadow-sm'}`}
        >
          <div
            className={`p-1.5 rounded-lg ${mode === 'add_senior' ? 'bg-white/20' : 'bg-blue-50 text-nit-primary'}`}
          >
            <Users className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="font-bold text-sm">Add Profile</p>
            <p
              className={`text-[11px] leading-tight mt-0.5 ${mode === 'add_senior' ? 'text-blue-100' : 'text-gray-500'}`}
            >
              Add a new senior or alumni
            </p>
          </div>
        </button>
        <button
          onClick={() => handleModeChange('manage_existing')}
          className={`flex items-center gap-2.5 p-3 rounded-xl border transition ${mode === 'manage_existing' ? 'bg-nit-primary text-white border-nit-primary shadow-md' : 'bg-white text-gray-700 border-slate-300 hover:border-nit-primary hover:shadow-sm'}`}
        >
          <div
            className={`p-1.5 rounded-lg ${mode === 'manage_existing' ? 'bg-white/20' : 'bg-blue-50 text-nit-primary'}`}
          >
            <LayoutDashboard className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="font-bold text-sm">Manage Existing</p>
            <p
              className={`text-[11px] leading-tight mt-0.5 ${mode === 'manage_existing' ? 'text-blue-100' : 'text-gray-500'}`}
            >
              Edit or delete profiles
            </p>
          </div>
        </button>
      </div>

      {mode === 'add_senior' && (
        <CreateMentorForm createMentor={createMentor} isCreating={isCreating} />
      )}

      {mode === 'manage_existing' && (
        <MentorList
          mentors={mentors}
          isFetching={isFetching}
          currentBranch={manageBranch}
          onBranchChange={setManageBranch}
          currentYear={manageYearFilter}
          onYearChange={setManageYearFilter}
          onEdit={setEditingMentor}
          onDelete={setDeletingMentor}
        />
      )}

      {editingMentor && (
        <EditMentorModal
          mentor={editingMentor}
          isSaving={isUpdatingId === editingMentor._id}
          onSave={handleSaveEdit}
          onCancel={() => setEditingMentor(null)}
        />
      )}

      {deletingMentor && (
        <DeleteMentorModal
          mentor={deletingMentor}
          isDeleting={isDeletingId === deletingMentor._id}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingMentor(null)}
        />
      )}
    </div>
  );
}
