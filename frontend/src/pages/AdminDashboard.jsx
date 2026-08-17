import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  MessageSquare,
  Check,
  X,
  Inbox,
  ArrowLeft,
  Loader,
  RefreshCw,
  Download,
  Bug,
  Trash2,
  ExternalLink,
  FileText,
  Video,
  StickyNote,
  Edit2
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api, getContributionDownloadUrl, deleteResource, getResourceDownloadUrl, updateResource } from '../services/api.js';
import { ContributionSkeleton, OverviewSkeleton, AdminFormSkeleton } from '../components/ui/Skeleton.jsx';
import toast from 'react-hot-toast';

// Matches backend constants/branches.js exactly
const BRANCHES = ['CSE', 'IT', 'AIDS', 'AIML', 'MNC', 'ECE', 'EE', 'ME', 'PIE', 'CE'];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];
// Matches Mentor model's `year` enum exactly
const SENIOR_YEARS = ['2nd Year', '3rd Year', '4th Year', 'Alumni'];
// Matches Resource model's `resources[].type` enum exactly
const RESOURCE_TYPES = ['LECTURES', 'BOOKS', 'NOTES', 'PYQS'];

export default function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const VALID_TABS = ['overview', 'resources', 'seniors', 'contributions', 'bugs'];
  const tabFromUrl = searchParams.get('tab');
  const activeTab = VALID_TABS.includes(tabFromUrl) ? tabFromUrl : 'overview';
  const setActiveTab = (tab) => {
    if (tab === 'overview') {
      setSearchParams({}, { replace: true });
    } else {
      setSearchParams({ tab }, { replace: true });
    }
  };
  const navigate = useNavigate();

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'resources': return <ResourcesTab />;
      case 'seniors': return <SeniorsTab />;
      case 'contributions': return <ContributionsTab />;
      case 'bugs': return <BugsTab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen -m-4 sm:-m-6 lg:-m-8">
      {/* Sidebar */}
      <aside className="bg-white w-full md:w-64 shadow-sm border-r border-slate-300 z-10 flex flex-col md:min-h-screen">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="flex items-center justify-center w-8 h-8 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 hover:text-nit-primary transition-all group shrink-0" title="Go Back">
              <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-nit-primary leading-tight">Admin Panel</h2>
              <p className="text-xs text-gray-500 mt-0.5">NIT KKR Resource Portal</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <SidebarItem icon={<LayoutDashboard size={18} />} label="Overview" id="overview" active={activeTab} set={setActiveTab} />
          <SidebarItem icon={<BookOpen size={18} />} label="Manage Resources" id="resources" active={activeTab} set={setActiveTab} />
          <SidebarItem icon={<Users size={18} />} label="Manage Seniors" id="seniors" active={activeTab} set={setActiveTab} />
          <SidebarItem icon={<MessageSquare size={18} />} label="Contributions" id="contributions" active={activeTab} set={setActiveTab} />
          <SidebarItem icon={<Bug size={18} />} label="Manage Bugs" id="bugs" active={activeTab} set={setActiveTab} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-50">
        {renderContent()}
      </main>
    </div>
  );
}

const SidebarItem = ({ icon, label, id, active, set }) => (
  <button
    onClick={() => set(id)}
    className={`flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${active === id ? 'bg-nit-primary text-white' : 'text-gray-600 hover:bg-gray-100'
      }`}
  >
    <span className="mr-3">{icon}</span>
    {label}
  </button>
);

// --- TABS ---

const OverviewTab = () => {
  const [stats, setStats] = useState({ totalResources: 0, pendingContributions: 0, pendingBugs: 0 });
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);

  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    if (branch && semester) {
      api.get('/subjects', { params: { branch, semester } })
        .then(res => setSubjects(res.data?.data?.subjects || res.data?.data || []))
        .catch(() => setSubjects([]));
    } else {
      setSubjects([]);
      setSubjectId('');
    }
  }, [branch, semester]);

  useEffect(() => {
    fetchStats();
  }, [subjectId]);

  const fetchStats = async () => {
    setLoading(true);
    setErrored(false);
    try {
      let totalResources = 0;
      let pendingContributions = 0;
      let pendingBugs = 0;

      if (subjectId) {
        const resourcesRes = await api.get('/resources', { params: { subjectId } });
        totalResources = resourcesRes.data.data ? resourcesRes.data.data.length : 0;

        const contributionsRes = await api.get('/contributions', { params: { status: 'PENDING', subjectId } });
        pendingContributions = contributionsRes.data.data ? contributionsRes.data.data.length : 0;
      } else {
        const statsRes = await api.get('/resources/stats');
        totalResources = statsRes.data.data ? statsRes.data.data.total : 0;

        const contributionsRes = await api.get('/contributions', { params: { status: 'PENDING' } });
        pendingContributions = contributionsRes.data.data ? contributionsRes.data.data.length : 0;
      }

      try {
        const bugsRes = await api.get('/bugs', { params: { status: 'OPEN' } });
        pendingBugs = bugsRes.data.data ? bugsRes.data.data.length : 0;
      } catch (e) {
        console.error('Failed to fetch bugs count:', e);
      }

      setStats({ totalResources, pendingContributions, pendingBugs });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setErrored(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800">Overview</h2>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-300 space-y-4">
        <h3 className="font-semibold text-gray-700">Filter by Subject</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <select className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white" value={branch} onChange={e => setBranch(e.target.value)}>
              <option value="">Select Branch</option>
              {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <select className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white" value={semester} onChange={e => setSemester(e.target.value)}>
              <option value="">Select Sem</option>
              {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <select className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white disabled:opacity-50" value={subjectId} onChange={e => setSubjectId(e.target.value)} disabled={!subjects.length}>
              <option value="">{subjects.length ? "Select Subject" : "Select Branch & Sem first"}</option>
              {subjects.map(s => <option key={s._id} value={s._id}>{s.subjectName} ({s.subjectCode})</option>)}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <OverviewSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <StatCard title="Active Resources" value={stats.totalResources} color="green" />
            <StatCard title="Pending Requests" value={stats.pendingContributions} color="yellow" />
          </div>

          <div className="border-t border-slate-200 pt-8 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">System Health (Global)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatCard title="Pending Bugs" value={stats.pendingBugs} color="red" />
            </div>
          </div>
          <button
            onClick={fetchStats}
            disabled={loading}
            className="px-4 py-2 bg-nit-primary text-white rounded-lg text-sm hover:bg-blue-900 transition disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader className="w-4 h-4 animate-spin" />}
            Refresh Stats
          </button>
        </>
      )}
    </div>
  );
};

const StatCard = ({ title, value, color }) => {
  const valueColor = { green: 'text-emerald-600', yellow: 'text-amber-600' }[color] || 'text-gray-800';
  const borderColor = { green: 'border-emerald-500', yellow: 'border-amber-500' }[color] || 'border-gray-300';
  return (
    <div className={`p-6 rounded-xl border-l-4 shadow-sm bg-white ${borderColor}`}>
      <h3 className="text-gray-500 font-semibold uppercase text-xs tracking-wider">{title}</h3>
      <p className={`text-3xl font-extrabold mt-2 ${valueColor}`}>{value}</p>
    </div>
  );
};

const ResourcesTab = () => {
  const [mode, setMode] = useState('add_material');
  const [loading, setLoading] = useState(false);
  const [isFetchingSubjects, setIsFetchingSubjects] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    branch: '', semester: '1', subjectId: '', subjectName: '', subjectCode: '',
    resourceTitle: '', resourceType: 'LECTURES', resourceLink: ''
  });
  const [resourceFile, setResourceFile] = useState(null);

  const [existingSubjects, setExistingSubjects] = useState([]);

  // Manage existing state
  const [manageBranch, setManageBranch] = useState('');
  const [manageSem, setManageSem] = useState('');
  const [manageSubjectId, setManageSubjectId] = useState('');
  const [manageSubjects, setManageSubjects] = useState([]);
  const [manageResources, setManageResources] = useState([]);
  const [loadingManage, setLoadingManage] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [manageMsg, setManageMsg] = useState({ type: '', text: '' });
  
  const [editingResource, setEditingResource] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: '', type: '', url: '' });
  const [savingEditId, setSavingEditId] = useState(null);
  const [resourceFilter, setResourceFilter] = useState('ALL');

  const fetchSubjects = async () => {
    if (formData.branch && formData.semester) {
      setIsFetchingSubjects(true);
      try {
        const res = await api.get('/subjects', { params: { branch: formData.branch, semester: formData.semester } });
        setExistingSubjects(res.data.data || []);
      } catch (e) { console.error(e); }
      finally { setIsFetchingSubjects(false); }
    }
  };

  useEffect(() => {
    if (mode === 'add_material') fetchSubjects();
  }, [mode, formData.branch, formData.semester]);

  // Fetch subjects for manage mode
  useEffect(() => {
    if (mode === 'manage_existing' && manageBranch && manageSem) {
      api.get('/subjects', { params: { branch: manageBranch, semester: manageSem } })
        .then(res => setManageSubjects(res.data.data || []))
        .catch(() => setManageSubjects([]));
    } else {
      setManageSubjects([]);
      setManageSubjectId('');
      setManageResources([]);
    }
  }, [mode, manageBranch, manageSem]);

  // Fetch resources for selected subject in manage mode
  useEffect(() => {
    if (mode === 'manage_existing' && manageSubjectId) {
      setLoadingManage(true);
      api.get('/resources', { params: { subjectId: manageSubjectId } })
        .then(res => setManageResources(res.data.data || []))
        .catch(() => setManageResources([]))
        .finally(() => setLoadingManage(false));
    } else {
      setManageResources([]);
    }
  }, [manageSubjectId]);

  const handleDeleteResource = async (id) => {
    setDeletingId(id);
    try {
      await deleteResource(id);
      setManageResources(prev => prev.filter(r => r._id !== id));
      setManageMsg({ type: 'success', text: 'Resource deleted successfully.' });
      setTimeout(() => setManageMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      setManageMsg({ type: 'error', text: err.response?.data?.message || 'Delete failed.' });
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const handleEditClick = (r) => {
    setEditingResource(r._id);
    setEditFormData({ title: r.title, type: r.type, url: r.url || '' });
  };

  const handleSaveEdit = async (id) => {
    setSavingEditId(id);
    try {
      await updateResource(id, editFormData);
      setManageResources(prev => prev.map(r => r._id === id ? { ...r, ...editFormData } : r));
      setEditingResource(null);
      setManageMsg({ type: 'success', text: 'Resource updated successfully.' });
      setTimeout(() => setManageMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      setManageMsg({ type: 'error', text: err.response?.data?.message || 'Update failed.' });
    } finally {
      setSavingEditId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (mode === 'create_subject') {
        const payload = {
          branch: formData.branch,
          semester: parseInt(formData.semester),
          subjectName: formData.subjectName,
          subjectCode: formData.subjectCode
        };
        await api.post('/subjects', payload);
        setMessage({ type: 'success', text: 'Subject created.' });
        setFormData(prev => ({ ...prev, subjectName: '', subjectCode: '' }));
      } else {
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
        setMessage({ type: 'success', text: 'Resource added.' });
        setFormData(prev => ({ ...prev, resourceTitle: '', resourceLink: '' }));
        setResourceFile(null);
      }

      if (formData.branch && formData.semester) fetchSubjects();

    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Operation failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-gray-800">Manage Resources</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button onClick={() => setMode('add_material')} className={`flex items-center gap-3 p-4 rounded-xl border transition ${mode === 'add_material' ? 'bg-nit-primary text-white border-nit-primary shadow-md' : 'bg-white text-gray-700 border-slate-300 hover:border-nit-primary hover:shadow-sm'}`}>
          <div className={`p-2 rounded-lg ${mode === 'add_material' ? 'bg-white/20' : 'bg-blue-50 text-nit-primary'}`}><FileText className="w-5 h-5" /></div>
          <div className="text-left"><p className="font-bold">Add Material</p><p className={`text-xs ${mode === 'add_material' ? 'text-blue-100' : 'text-gray-500'}`}>Upload new resources</p></div>
        </button>
        <button onClick={() => setMode('create_subject')} className={`flex items-center gap-3 p-4 rounded-xl border transition ${mode === 'create_subject' ? 'bg-nit-primary text-white border-nit-primary shadow-md' : 'bg-white text-gray-700 border-slate-300 hover:border-nit-primary hover:shadow-sm'}`}>
          <div className={`p-2 rounded-lg ${mode === 'create_subject' ? 'bg-white/20' : 'bg-blue-50 text-nit-primary'}`}><BookOpen className="w-5 h-5" /></div>
          <div className="text-left"><p className="font-bold">Create Subject</p><p className={`text-xs ${mode === 'create_subject' ? 'text-blue-100' : 'text-gray-500'}`}>Add a new course</p></div>
        </button>
        <button onClick={() => setMode('manage_existing')} className={`flex items-center gap-3 p-4 rounded-xl border transition ${mode === 'manage_existing' ? 'bg-nit-primary text-white border-nit-primary shadow-md' : 'bg-white text-gray-700 border-slate-300 hover:border-nit-primary hover:shadow-sm'}`}>
          <div className={`p-2 rounded-lg ${mode === 'manage_existing' ? 'bg-white/20' : 'bg-blue-50 text-nit-primary'}`}><LayoutDashboard className="w-5 h-5" /></div>
          <div className="text-left"><p className="font-bold">Manage Existing</p><p className={`text-xs ${mode === 'manage_existing' ? 'text-blue-100' : 'text-gray-500'}`}>Edit or delete resources</p></div>
        </button>
      </div>

      {mode !== 'manage_existing' && (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-300">
        {message.text && (
          <div className={`mb-4 p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <select required className="w-full p-2.5 border border-gray-300 rounded-lg" value={formData.branch} onChange={e => setFormData({ ...formData, branch: e.target.value })}>
                <option value="">Select Branch</option>
                {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                <select required className="w-full p-2.5 border border-gray-300 rounded-lg" value={formData.semester} onChange={e => setFormData({ ...formData, semester: e.target.value })}>
                  {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {mode === 'create_subject' ? (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                <input type="text" required className="w-full p-2.5 border border-gray-300 rounded-lg" value={formData.subjectName} onChange={e => setFormData({ ...formData, subjectName: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Code</label>
                <input type="text" required className="w-full p-2.5 border border-gray-300 rounded-lg" value={formData.subjectCode} onChange={e => setFormData({ ...formData, subjectCode: e.target.value })} />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Subject</label>
              <select required className="w-full p-2.5 border border-gray-300 rounded-lg disabled:bg-gray-100" value={formData.subjectId} onChange={e => setFormData({ ...formData, subjectId: e.target.value })} disabled={!formData.branch}>
                <option value="">{existingSubjects.length ? 'Select a subject' : 'No subjects found for this branch/semester'}</option>
                {existingSubjects.map(s => <option key={s._id} value={s._id}>{s.subjectName} ({s.subjectCode})</option>)}
              </select>
            </div>
          )}

          {mode === 'add_material' && (
            <div className="border-t border-slate-200 pt-4 mt-4 space-y-4">
              <h3 className="font-semibold text-gray-700 text-sm">Resource Details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input type="text" required className="w-full p-2.5 border border-gray-300 rounded-lg" placeholder="e.g. Unit 1 Lecture Notes" value={formData.resourceTitle} onChange={e => setFormData({ ...formData, resourceTitle: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select className="w-full p-2.5 border border-gray-300 rounded-lg" value={formData.resourceType} onChange={e => setFormData({ ...formData, resourceType: e.target.value })}>
                    {RESOURCE_TYPES.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.resourceType === 'LECTURES' ? 'Link (URL)' : 'Resource File (ZIP)'}
                </label>
                {formData.resourceType === 'LECTURES' ? (
                  <input type="url" required className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nit-primary outline-none transition" placeholder="https://youtube.com/watch?v=..." value={formData.resourceLink} onChange={e => setFormData({ ...formData, resourceLink: e.target.value })} />
                ) : (
                  <input type="file" required accept=".zip" className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-nit-primary outline-none transition" onChange={e => setResourceFile(e.target.files[0])} />
                )}
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-nit-primary text-white py-2.5 rounded-lg hover:bg-blue-900 transition flex justify-center items-center gap-2">
            {loading ? <Loader className="animate-spin w-4 h-4" /> : (mode === 'create_subject' ? 'Create Subject' : 'Add Resource')}
          </button>
        </form>
      </div>
      )}

      {/* ── Manage Existing Resources ── */}
      {mode === 'manage_existing' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-300 space-y-4">
          {manageMsg.text && (
            <div className={`p-3 rounded-md text-sm ${manageMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{manageMsg.text}</div>
          )}
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <select className="w-full p-2.5 border border-gray-300 rounded-lg" value={manageBranch} onChange={e => { setManageBranch(e.target.value); setManageSubjectId(''); }}>
                <option value="">Select Branch</option>
                {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
              <select className="w-full p-2.5 border border-gray-300 rounded-lg" value={manageSem} onChange={e => { setManageSem(e.target.value); setManageSubjectId(''); }}>
                <option value="">Select Sem</option>
                {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select className="w-full p-2.5 border border-gray-300 rounded-lg disabled:bg-gray-100" disabled={!manageSubjects.length} value={manageSubjectId} onChange={e => setManageSubjectId(e.target.value)}>
                <option value="">{manageSubjects.length ? 'Select Subject' : 'Select branch & sem first'}</option>
                {manageSubjects.map(s => <option key={s._id} value={s._id}>{s.subjectName} ({s.subjectCode})</option>)}
              </select>
            </div>
          </div>

          {manageSubjectId && (
            <div className="border-t border-slate-200 pt-4 mt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h3 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Resources ({manageResources.length})
                </h3>
                <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200 w-fit overflow-x-auto">
                  {['ALL', ...RESOURCE_TYPES].map(type => (
                    <button 
                      key={type}
                      onClick={(e) => { e.preventDefault(); setResourceFilter(type); }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition ${resourceFilter === type ? 'bg-white text-nit-primary shadow-sm border border-slate-200' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {loadingManage ? (
                <div className="flex justify-center py-8"><Loader className="w-5 h-5 animate-spin text-nit-primary" /></div>
              ) : manageResources.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">No resources found for this subject.</div>
              ) : (
                <div className="space-y-2">
                  {(resourceFilter === 'ALL' ? manageResources : manageResources.filter(r => r.type === resourceFilter)).map(r => {
                    const typeIcons = { LECTURES: Video, BOOKS: BookOpen, PYQS: FileText, NOTES: StickyNote };
                    const typeColors = { LECTURES: 'bg-violet-100 text-violet-700', BOOKS: 'bg-blue-100 text-blue-700', PYQS: 'bg-amber-100 text-amber-700', NOTES: 'bg-emerald-100 text-emerald-700' };
                    const Icon = typeIcons[r.type] || FileText;

                    if (editingResource === r._id) {
                      return (
                        <div key={r._id} className="p-4 rounded-lg border border-nit-primary bg-blue-50/50 space-y-3">
                          <div className="grid sm:grid-cols-2 gap-3">
                            <input type="text" className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-nit-primary" value={editFormData.title} onChange={e => setEditFormData({...editFormData, title: e.target.value})} placeholder="Title" />
                            <select className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-nit-primary" value={editFormData.type} onChange={e => setEditFormData({...editFormData, type: e.target.value})}>
                              {RESOURCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                          {editFormData.type === 'LECTURES' && (
                            <input type="url" className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-nit-primary" value={editFormData.url} onChange={e => setEditFormData({...editFormData, url: e.target.value})} placeholder="URL" />
                          )}
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => setEditingResource(null)} className="px-3 py-1.5 text-sm rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition">Cancel</button>
                            <button onClick={() => handleSaveEdit(r._id)} disabled={savingEditId === r._id} className="px-3 py-1.5 text-sm rounded-md bg-nit-primary text-white hover:bg-blue-900 transition flex items-center gap-2">
                              {savingEditId === r._id ? <Loader className="w-4 h-4 animate-spin"/> : 'Save'}
                            </button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={r._id} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:border-slate-300 transition">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${typeColors[r.type] || 'bg-gray-100 text-gray-600'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{r.title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-gray-400 uppercase font-semibold">{r.type}</span>
                              {r.fileName && <span className="text-xs text-gray-400">• {r.fileName}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => handleEditClick(r)} className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 transition" title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {r.url && (
                            <a href={r.url} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 transition" title="Open Link">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          {r.fileKey && (
                            <button onClick={async () => { try { const res = await getResourceDownloadUrl(r._id); if(res.data?.data?.downloadUrl) window.location.href = res.data.data.downloadUrl; } catch(e) { toast.error('Download failed.'); }}} className="p-2 rounded-lg bg-nit-primary text-white hover:bg-blue-900 transition" title="Download">
                              <Download className="w-4 h-4" />
                            </button>
                          )}
                          {confirmDeleteId === r._id ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleDeleteResource(r._id)} disabled={deletingId === r._id} className="px-2 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition disabled:opacity-50">
                                {deletingId === r._id ? <Loader className="w-3 h-3 animate-spin" /> : 'Yes'}
                              </button>
                              <button onClick={() => setConfirmDeleteId(null)} className="px-2 py-1.5 rounded-lg bg-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-300 transition">No</button>
                            </div>
                          ) : (
                            <button onClick={() => setConfirmDeleteId(r._id)} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SeniorsTab = () => {
  const [mode, setMode] = useState('add_senior');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [formData, setFormData] = useState({
    name: '', email: '', branch: '', year: '4th Year', company: '', linkedin: '', imageUrl: '', batchStart: '', batchEnd: '', achievements: '', tags: []
  });

  const [manageBranch, setManageBranch] = useState('');
  const [manageYearFilter, setManageYearFilter] = useState('ALL');
  const [manageMentors, setManageMentors] = useState([]);
  const [loadingManage, setLoadingManage] = useState(false);
  const [manageMsg, setManageMsg] = useState({ type: '', text: '' });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ 
    name: '', email: '', branch: '', year: '4th Year', company: '', linkedin: '', imageUrl: '', batchStart: '', batchEnd: '', achievements: '', tags: [] 
  });
  const [savingEditId, setSavingEditId] = useState(null);

  useEffect(() => {
    if (mode === 'manage_existing' && manageBranch) {
      setLoadingManage(true);
      api.get('/mentors', { params: { branch: manageBranch } })
        .then(res => setManageMentors(res.data.data?.mentors || res.data.data || []))
        .catch(() => setManageMentors([]))
        .finally(() => setLoadingManage(false));
    } else {
      setManageMentors([]);
    }
  }, [mode, manageBranch]);

  const handleDeleteMentor = async (id) => {
    setDeletingId(id);
    try {
      await deleteMentor(id);
      setManageMentors(prev => prev.filter(m => m._id !== id));
      setManageMsg({ type: 'success', text: 'Profile deleted successfully.' });
      setTimeout(() => setManageMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      setManageMsg({ type: 'error', text: err.response?.data?.message || 'Delete failed.' });
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const handleEditClick = (m) => {
    setEditingId(m._id);
    let batchStart = '', batchEnd = '';
    if (m.currentYear === 'Alumni' && m.batch) {
      const parts = m.batch.split('-');
      if (parts.length === 2) {
        batchStart = parts[0];
        batchEnd = parts[1];
      }
    }
    setEditFormData({ 
      name: m.name, 
      email: m.email || '',
      branch: m.branch,
      year: m.currentYear,
      company: m.experiences?.[0]?.company || '',
      linkedin: m.linkedin || '', 
      imageUrl: m.image || '',
      achievements: m.achievements ? m.achievements.join(', ') : '',
      tags: m.tags || [],
      batchStart,
      batchEnd
    });
  };

  const handleSaveEdit = async (id) => {
    setSavingEditId(id);
    try {
      const payload = {
        name: editFormData.name.trim(),
        branch: editFormData.branch,
        currentYear: editFormData.year,
      };

      if (editFormData.year === 'Alumni' && editFormData.batchStart && editFormData.batchEnd) {
        payload.batch = `${editFormData.batchStart}-${editFormData.batchEnd}`;
      } else {
        payload.batch = '';
      }

      if (editFormData.email?.trim()) payload.email = editFormData.email.trim();
      else payload.email = '';

      if (editFormData.imageUrl?.trim()) payload.image = editFormData.imageUrl.trim();
      else payload.image = '';

      if (editFormData.linkedin?.trim()) payload.linkedin = editFormData.linkedin.trim();
      else payload.linkedin = '';

      if (editFormData.company?.trim()) {
        payload.experiences = [{ company: editFormData.company.trim(), role: 'Employee', type: 'Placement' }];
      } else {
        payload.experiences = [];
      }

      if (editFormData.achievements?.trim()) {
        payload.achievements = editFormData.achievements.split(',').map(a => a.trim()).filter(a => a);
      } else {
        payload.achievements = [];
      }

      if (editFormData.tags) {
        payload.tags = editFormData.tags;
      } else {
        payload.tags = [];
      }

      const res = await updateMentor(id, payload);
      setManageMentors(prev => prev.map(m => m._id === id ? { ...m, ...res.data.data } : m));
      setEditingId(null);
      setManageMsg({ type: 'success', text: 'Profile updated successfully.' });
      setTimeout(() => setManageMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      setManageMsg({ type: 'error', text: err.response?.data?.message || 'Update failed.' });
    } finally {
      setSavingEditId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        branch: formData.branch,
        currentYear: formData.year,
      };

      if (formData.year === 'Alumni' && formData.batchStart && formData.batchEnd) {
        payload.batch = `${formData.batchStart}-${formData.batchEnd}`;
      }

      if (formData.email?.trim()) payload.email = formData.email.trim();
      if (formData.imageUrl?.trim()) payload.image = formData.imageUrl.trim();
      if (formData.linkedin?.trim()) payload.linkedin = formData.linkedin.trim();
      if (formData.company?.trim()) {
        payload.experiences = [{ company: formData.company.trim(), role: 'Employee', type: 'Placement' }];
      }
      if (formData.achievements?.trim()) {
        payload.achievements = formData.achievements.split(',').map(a => a.trim()).filter(a => a);
      }
      if (formData.tags && formData.tags.length > 0) {
        payload.tags = formData.tags;
      }

      await api.post('/mentors', payload);
      setMsg('Profile added successfully.');
      setFormData({ name: '', email: '', branch: '', year: '4th Year', company: '', linkedin: '', imageUrl: '', batchStart: '', batchEnd: '', achievements: '', tags: [] });
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to add profile.');
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-gray-800">Manage Seniors</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button onClick={() => setMode('add_senior')} className={`flex items-center gap-3 p-4 rounded-xl border transition ${mode === 'add_senior' ? 'bg-nit-primary text-white border-nit-primary shadow-md' : 'bg-white text-gray-700 border-slate-300 hover:border-nit-primary hover:shadow-sm'}`}>
          <div className={`p-2 rounded-lg ${mode === 'add_senior' ? 'bg-white/20' : 'bg-blue-50 text-nit-primary'}`}><Users className="w-5 h-5" /></div>
          <div className="text-left"><p className="font-bold">Add Profile</p><p className={`text-xs ${mode === 'add_senior' ? 'text-blue-100' : 'text-gray-500'}`}>Add a new senior or alumni</p></div>
        </button>
        <button onClick={() => setMode('manage_existing')} className={`flex items-center gap-3 p-4 rounded-xl border transition ${mode === 'manage_existing' ? 'bg-nit-primary text-white border-nit-primary shadow-md' : 'bg-white text-gray-700 border-slate-300 hover:border-nit-primary hover:shadow-sm'}`}>
          <div className={`p-2 rounded-lg ${mode === 'manage_existing' ? 'bg-white/20' : 'bg-blue-50 text-nit-primary'}`}><LayoutDashboard className="w-5 h-5" /></div>
          <div className="text-left"><p className="font-bold">Manage Existing</p><p className={`text-xs ${mode === 'manage_existing' ? 'text-blue-100' : 'text-gray-500'}`}>Edit or delete profiles</p></div>
        </button>
      </div>

      {mode === 'add_senior' && (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-300">
        {msg && <div className="mb-4 text-sm font-medium text-emerald-600">{msg}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" required className="w-full p-2.5 border border-gray-300 rounded-lg" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
              <input type="email" className="w-full p-2.5 border border-gray-300 rounded-lg" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <select required className="w-full p-2.5 border border-gray-300 rounded-lg" value={formData.branch} onChange={e => setFormData({ ...formData, branch: e.target.value })}>
                <option value="">Select</option>
                {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select required className="w-full p-2.5 border border-gray-300 rounded-lg" value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })}>
                {SENIOR_YEARS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company (Optional)</label>
              <input type="text" className="w-full p-2.5 border border-gray-300 rounded-lg" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} />
            </div>
            {formData.year === 'Alumni' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Starting Year</label>
                  <input type="number" required min="1950" max="2100" placeholder="e.g. 2020" className="w-full p-2.5 border border-gray-300 rounded-lg" value={formData.batchStart} onChange={e => setFormData({ ...formData, batchStart: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ending Year</label>
                  <input type="number" required min="1950" max="2100" placeholder="e.g. 2024" className="w-full p-2.5 border border-gray-300 rounded-lg" value={formData.batchEnd} onChange={e => setFormData({ ...formData, batchEnd: e.target.value })} />
                </div>
              </>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
            <input type="url" className="w-full p-2.5 border border-gray-300 rounded-lg" value={formData.linkedin} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image URL</label>
            <input type="url" className="w-full p-2.5 border border-gray-300 rounded-lg" placeholder="https://..." value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
            <p className="text-xs text-gray-500 mt-1">Leave blank for a default avatar</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Achievements (Comma-separated)</label>
            <input type="text" className="w-full p-2.5 border border-gray-300 rounded-lg" placeholder="e.g. Codeforces Expert, GSOC'22" value={formData.achievements} onChange={e => setFormData({ ...formData, achievements: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skills / Expertise</label>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-4 border border-slate-300 rounded-lg bg-slate-50/50">
              {MENTOR_TAGS.map(t => {
                const isSelected = formData.tags.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== t) });
                      } else {
                        setFormData({ ...formData, tags: [...formData.tags, t] });
                      }
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${isSelected
                        ? 'bg-blue-100 text-blue-700 border-blue-200 shadow-sm shadow-blue-500/10'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-nit-primary text-white py-2.5 rounded-lg font-medium hover:bg-blue-900 transition flex justify-center items-center h-[46px] mt-6 disabled:opacity-70 gap-2">
            {loading ? <Loader className="animate-spin w-4 h-4" /> : 'Add Profile'}
          </button>
        </form>
      </div>
      )}

      {/* ── Manage Existing Seniors ── */}
      {mode === 'manage_existing' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-300 space-y-4">
          {manageMsg.text && (
            <div className={`p-3 rounded-md text-sm ${manageMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{manageMsg.text}</div>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <select className="w-full p-2.5 border border-gray-300 rounded-lg" value={manageBranch} onChange={e => setManageBranch(e.target.value)}>
                <option value="">Select Branch</option>
                {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>

          {manageBranch && (
            <div className="border-t border-slate-200 pt-4 mt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h3 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4" /> Profiles ({manageMentors.length})
                </h3>
                <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200 w-fit overflow-x-auto">
                  {['ALL', ...SENIOR_YEARS].map(year => (
                    <button 
                      key={year}
                      onClick={(e) => { e.preventDefault(); setManageYearFilter(year); }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition ${manageYearFilter === year ? 'bg-white text-nit-primary shadow-sm border border-slate-200' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              {loadingManage ? (
                <div className="flex justify-center py-8"><Loader className="w-5 h-5 animate-spin text-nit-primary" /></div>
              ) : manageMentors.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">No profiles found for this branch.</div>
              ) : (
                <div className="space-y-2">
                  {(manageYearFilter === 'ALL' ? manageMentors : manageMentors.filter(m => m.currentYear === manageYearFilter)).map(m => {
                    if (editingId === m._id) {
                      return (
                        <div key={m._id} className="p-4 rounded-lg border border-nit-primary bg-blue-50/50 space-y-3">
                          <div className="grid sm:grid-cols-2 gap-3">
                            <input type="text" className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-nit-primary" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} placeholder="Full Name" />
                            <input type="email" className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-nit-primary" value={editFormData.email} onChange={e => setEditFormData({...editFormData, email: e.target.value})} placeholder="Email (Optional)" />
                            
                            <select className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-nit-primary" value={editFormData.branch} onChange={e => setEditFormData({...editFormData, branch: e.target.value})}>
                              {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                            <select className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-nit-primary" value={editFormData.year} onChange={e => setEditFormData({...editFormData, year: e.target.value})}>
                              {SENIOR_YEARS.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>

                            <input type="text" className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-nit-primary" value={editFormData.company} onChange={e => setEditFormData({...editFormData, company: e.target.value})} placeholder="Company (Optional)" />
                            <input type="url" className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-nit-primary" value={editFormData.linkedin} onChange={e => setEditFormData({...editFormData, linkedin: e.target.value})} placeholder="LinkedIn URL" />

                            {editFormData.year === 'Alumni' && (
                              <>
                                <input type="number" placeholder="Start Year" className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-nit-primary" value={editFormData.batchStart} onChange={e => setEditFormData({...editFormData, batchStart: e.target.value})} />
                                <input type="number" placeholder="End Year" className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-nit-primary" value={editFormData.batchEnd} onChange={e => setEditFormData({...editFormData, batchEnd: e.target.value})} />
                              </>
                            )}
                          </div>

                          <div className="grid sm:grid-cols-2 gap-3">
                            <input type="url" className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-nit-primary" value={editFormData.imageUrl} onChange={e => setEditFormData({...editFormData, imageUrl: e.target.value})} placeholder="Profile Image URL" />
                            <input type="text" className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-nit-primary" value={editFormData.achievements} onChange={e => setEditFormData({...editFormData, achievements: e.target.value})} placeholder="Achievements (Comma-separated)" />
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mt-2 p-2 border border-slate-300 rounded-lg bg-white max-h-32 overflow-y-auto">
                            {MENTOR_TAGS.map(t => {
                              const isSelected = editFormData.tags.includes(t);
                              return (
                                <button
                                  key={t}
                                  type="button"
                                  onClick={() => {
                                    if (isSelected) setEditFormData({ ...editFormData, tags: editFormData.tags.filter(tag => tag !== t) });
                                    else setEditFormData({ ...editFormData, tags: [...editFormData.tags, t] });
                                  }}
                                  className={`px-2 py-1 rounded text-[10px] font-medium transition-all border ${isSelected ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                                >
                                  {t}
                                </button>
                              );
                            })}
                          </div>

                          <div className="flex gap-2 justify-end mt-3 border-t border-blue-200 pt-3">
                            <button onClick={() => setEditingId(null)} className="px-4 py-2 text-sm rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition">Cancel</button>
                            <button onClick={() => handleSaveEdit(m._id)} disabled={savingEditId === m._id} className="px-4 py-2 text-sm rounded-md bg-nit-primary text-white hover:bg-blue-900 transition flex items-center gap-2 font-medium">
                              {savingEditId === m._id ? <Loader className="w-4 h-4 animate-spin"/> : 'Save Changes'}
                            </button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={m._id} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:border-slate-300 transition">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <img src={m.image || 'https://via.placeholder.com/150'} alt={m.name} className="w-8 h-8 rounded-full object-cover bg-gray-200 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{m.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-gray-400 font-semibold">{m.currentYear}</span>
                              {m.experiences?.[0]?.company && <span className="text-xs text-gray-400">• {m.experiences[0].company}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => handleEditClick(m)} className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 transition" title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {m.linkedin && (
                            <a href={m.linkedin} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 transition" title="LinkedIn">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          {confirmDeleteId === m._id ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleDeleteMentor(m._id)} disabled={deletingId === m._id} className="px-2 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition disabled:opacity-50">
                                {deletingId === m._id ? <Loader className="w-3 h-3 animate-spin" /> : 'Yes'}
                              </button>
                              <button onClick={() => setConfirmDeleteId(null)} className="px-2 py-1.5 rounded-lg bg-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-300 transition">No</button>
                            </div>
                          ) : (
                            <button onClick={() => setConfirmDeleteId(m._id)} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ContributionsTab = () => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState({ id: null, action: null });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', type: '', url: '' });

  useEffect(() => { fetchContributions(); }, []);

  const fetchContributions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/contributions', { params: { status: 'PENDING' } });
      setContributions(res.data.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleApprove = async (id) => {
    setProcessing({ id, action: 'approve' });
    try {
      await api.patch(`/contributions/${id}/approve`);
      fetchContributions();
    } catch (e) { toast.error('Approve failed: ' + (e.response?.data?.message || 'Unknown error')); }
    finally { setProcessing({ id: null, action: null }); }
  };

  const handleReject = async (id) => {
    setProcessing({ id, action: 'reject' });
    try {
      await api.delete(`/contributions/${id}`);
      fetchContributions();
    } catch (e) { toast.error('Reject failed: ' + (e.response?.data?.message || 'Unknown error')); }
    finally { setProcessing({ id: null, action: null }); }
  };

  const handleEditClick = (item) => {
    setEditingId(item._id);
    setEditForm({ title: item.title, type: item.type, url: item.url || '' });
  };

  const handleSaveEdit = async (id) => {
    if (!editForm.title.trim()) return toast.error("Title is required");
    setProcessing({ id, action: 'edit' });
    try {
      await api.patch(`/contributions/${id}`, editForm);
      setEditingId(null);
      fetchContributions();
    } catch (e) { toast.error('Update failed: ' + (e.response?.data?.message || 'Unknown error')); }
    finally { setProcessing({ id: null, action: null }); }
  };

  const TYPE_LABELS = { LECTURES: 'Lecture', BOOKS: 'Book', PYQS: 'PYQ', NOTES: 'Notes' };
  const TYPE_COLORS = { LECTURES: 'bg-violet-100 text-violet-700', BOOKS: 'bg-blue-100 text-blue-700', PYQS: 'bg-amber-100 text-amber-700', NOTES: 'bg-emerald-100 text-emerald-700' };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-300">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-nit-primary" /> Pending Contributions
        </h2>
        <button
          onClick={fetchContributions}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {loading && !contributions.length ? (
        <ContributionSkeleton rows={3} />
      ) : contributions.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-300 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
            <Inbox className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">All caught up!</h3>
          <p className="text-gray-500 text-sm max-w-sm">There are no pending contributions to review at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contributions.map(item => (
            <div key={item._id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-300 flex flex-col md:flex-row justify-between items-start gap-4 transition-all hover:border-slate-400">
              {editingId === item._id ? (
                <div className="flex-1 min-w-0 space-y-3 w-full">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Title</label>
                    <input type="text" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} className="form-input" />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col gap-1 w-1/3">
                      <label className="text-xs font-semibold text-gray-500 uppercase">Type</label>
                      <select value={editForm.type} onChange={e => setEditForm({...editForm, type: e.target.value})} className="form-input">
                        {Object.entries(TYPE_LABELS).map(([val, label]) => (
                          <option key={val} value={val}>{label}</option>
                        ))}
                      </select>
                    </div>
                    {editForm.type === 'LECTURES' && (
                      <div className="flex flex-col gap-1 w-2/3">
                        <label className="text-xs font-semibold text-gray-500 uppercase">URL</label>
                        <input type="text" value={editForm.url} onChange={e => setEditForm({...editForm, url: e.target.value})} className="form-input" />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => handleSaveEdit(item._id)} disabled={processing.id === item._id} className="px-3 py-1.5 bg-nit-primary text-white text-sm font-medium rounded-lg hover:bg-blue-900 transition flex items-center gap-2 disabled:opacity-50">
                      {processing.id === item._id && processing.action === 'edit' ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                      Save
                    </button>
                    <button onClick={() => setEditingId(null)} disabled={processing.id === item._id} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-200 transition disabled:opacity-50">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded uppercase ${TYPE_COLORS[item.type] || 'bg-gray-100 text-gray-700'}`}>
                        {TYPE_LABELS[item.type] || item.type}
                      </span>
                      <span className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-800 text-sm font-medium mb-1">{item.title}</p>
                    {item.fileName && (
                      <p className="text-xs text-gray-500">File: {item.fileName}</p>
                    )}
                    {item.url && (
                      <p className="text-xs text-gray-500">Link: <a href={item.url} target="_blank" rel="noreferrer" className="text-blue-600 underline truncate block max-w-full">{item.url}</a></p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => handleEditClick(item)} className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition" title="Edit">
                      <Edit2 size={18} />
                    </button>
                    {item.fileName && (
                      <button 
                        onClick={async () => {
                          try {
                            const res = await getContributionDownloadUrl(item._id);
                            if (res.data?.data?.downloadUrl) {
                              window.location.href = res.data.data.downloadUrl;
                            }
                          } catch (err) {
                            toast.error("Could not generate download link.");
                          }
                        }}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition" 
                        title="Download File"
                      >
                        <Download size={18} />
                      </button>
                    )}
                    <button onClick={() => handleApprove(item._id)} disabled={processing.id === item._id} className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition disabled:opacity-50" title="Approve">
                      {processing.id === item._id && processing.action === 'approve' ? <Loader className="animate-spin w-5 h-5" /> : <Check size={18} />}
                    </button>
                    <button onClick={() => handleReject(item._id)} disabled={processing.id === item._id} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition disabled:opacity-50" title="Reject">
                      {processing.id === item._id && processing.action === 'reject' ? <Loader className="animate-spin w-5 h-5" /> : <X size={18} />}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const BugsTab = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => { fetchBugs(); }, []);

  const fetchBugs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bugs', { params: { status: 'OPEN' } });
      setBugs(res.data.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleResolve = async (id) => {
    setProcessingId(id);
    try {
      await api.patch(`/bugs/${id}/resolve`);
      fetchBugs();
    } catch (e) { toast.error('Resolve failed: ' + (e.response?.data?.message || 'Unknown error')); }
    finally { setProcessingId(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-300">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Bug className="w-5 h-5 text-red-600" /> Pending Bugs
        </h2>
        <button
          onClick={fetchBugs}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {loading && !bugs.length ? (
        <ContributionSkeleton rows={3} />
      ) : bugs.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-300 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
            <Check className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">No Pending Bugs!</h3>
          <p className="text-gray-500 text-sm max-w-sm">Your platform is running smoothly with no unresolved bug reports.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bugs.map(bug => (
            <div key={bug._id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-300 flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="px-2 py-0.5 text-xs font-semibold rounded uppercase bg-red-100 text-red-700">
                    BUG REPORT
                  </span>
                  <span className="text-xs text-gray-500">{new Date(bug.createdAt).toLocaleDateString()}</span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-gray-600 font-medium">Reported by: {bug.reportedBy?.username || bug.reportedBy?.email || 'Unknown'}</span>
                </div>
                <p className="text-gray-800 text-sm mb-1 whitespace-pre-wrap">{bug.description}</p>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto shrink-0 mt-2 md:mt-0">
                <button
                  onClick={() => handleResolve(bug._id)}
                  disabled={processingId === bug._id}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-sm font-medium transition disabled:opacity-50"
                >
                  {processingId === bug._id ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Resolve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};