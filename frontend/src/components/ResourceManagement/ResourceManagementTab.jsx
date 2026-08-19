import React, { useState, useEffect } from 'react';
import { BookOpen, LayoutDashboard, FileText } from 'lucide-react';
import { BRANCHES, SEMESTERS } from '../../constants/index.js';
import useStickyState from '../../hooks/useStickyState';
import { useResources } from './hooks/useResources.js';
import { api } from '../../services/api';
import ResourceFilters from './ResourceFilters.jsx';
import ResourceList from './ResourceList.jsx';
import EditResourceModal from './EditResourceModal.jsx';
import DeleteResourceModal from './DeleteResourceModal.jsx';
import AddResourceForm from './AddResourceForm.jsx';
import PageHeader from '../admin/common/PageHeader.jsx';

export default function ResourceManagementTab() {
  const [mode, setMode] = useStickyState('manage_existing', 'admin_res_mode');
  const [manageBranch, setManageBranch] = useStickyState('', 'admin_res_manageBranch');
  const [manageSem, setManageSem] = useStickyState('', 'admin_res_manageSem');
  const [resourceFilter, setResourceFilter] = useStickyState('ALL', 'admin_res_filter');

  // Local state for subjects list
  const [manageSubjectId, setManageSubjectId] = useState('');
  const [manageSubjects, setManageSubjects] = useState([]);

  // Modal states
  const [editingResource, setEditingResource] = useState(null);
  const [deletingResource, setDeletingResource] = useState(null);

  const {
    resources,
    isFetching,
    isSavingId,
    isDeletingId,
    fetchResources,
    updateResource,
    deleteResource,
  } = useResources();

  // Fetch subjects when branch/sem changes
  useEffect(() => {
    if (manageBranch && manageSem) {
      api
        .get('/subjects', { params: { branch: manageBranch, semester: manageSem } })
        .then((res) => {
          setManageSubjects(res.data?.data?.subjects || res.data?.data || []);
        })
        .catch(() => setManageSubjects([]));
    } else {
      setManageSubjects([]);
    }
  }, [manageBranch, manageSem]);

  // Fetch resources when subject changes
  useEffect(() => {
    fetchResources(manageSubjectId);
  }, [manageSubjectId, fetchResources]);

  const handleBranchChange = (e) => {
    setManageBranch(e.target.value);
    setManageSubjectId(''); // Clear selected subject when branch changes
  };

  const handleSemChange = (e) => {
    setManageSem(e.target.value);
    setManageSubjectId(''); // Clear selected subject when sem changes
  };

  const handleSaveEdit = async (id, payload) => {
    await updateResource(id, payload, () => setEditingResource(null));
  };

  const handleConfirmDelete = async (id) => {
    await deleteResource(id, () => setDeletingResource(null));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-gray-800">Manage Resources</h2>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setMode('manage_existing')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            mode === 'manage_existing'
              ? 'bg-nit-primary text-white shadow-sm'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" /> Manage Resources
        </button>
        <button
          onClick={() => setMode('add_material')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            mode === 'add_material'
              ? 'bg-nit-primary text-white shadow-sm'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <FileText className="w-4 h-4" /> Add Material
        </button>
      </div>

      {mode === 'add_material' ? (
        <AddResourceForm />
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-300 space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <select
                className="w-full p-2.5 border border-gray-300 rounded-lg"
                value={manageBranch}
                onChange={handleBranchChange}
              >
                <option value="">Select Branch</option>
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
              <select
                className="w-full p-2.5 border border-gray-300 rounded-lg"
                value={manageSem}
                onChange={handleSemChange}
              >
                <option value="">Select Sem</option>
                {SEMESTERS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select
                className="w-full p-2.5 border border-gray-300 rounded-lg disabled:bg-gray-100"
                disabled={!manageSubjects.length}
                value={manageSubjectId}
                onChange={(e) => setManageSubjectId(e.target.value)}
              >
                <option value="">
                  {manageSubjects.length ? 'Select Subject' : 'Select branch & sem first'}
                </option>
                {manageSubjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.subjectName} ({s.subjectCode})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {manageSubjectId && (
            <div className="border-t border-slate-200 pt-4 mt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="font-semibold text-gray-700 text-sm flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4" /> Resources ({resources.length})
                </h3>
                <ResourceFilters
                  resources={resources}
                  currentFilter={resourceFilter}
                  onFilterChange={setResourceFilter}
                />
              </div>

              <ResourceList
                resources={resources}
                isFetching={isFetching}
                currentFilter={resourceFilter}
                onEdit={setEditingResource}
                onDelete={setDeletingResource}
                isDeletingId={isDeletingId}
              />
            </div>
          )}

          {editingResource && (
            <EditResourceModal
              resource={editingResource}
              isSaving={isSavingId === editingResource._id}
              onSave={handleSaveEdit}
              onCancel={() => setEditingResource(null)}
            />
          )}

          {deletingResource && (
            <DeleteResourceModal
              resource={deletingResource}
              isDeleting={isDeletingId === deletingResource._id}
              onConfirm={handleConfirmDelete}
              onCancel={() => setDeletingResource(null)}
            />
          )}
        </div>
      )}
    </div>
  );
}
