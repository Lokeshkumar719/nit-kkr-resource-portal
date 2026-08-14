import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  MessageSquare, 
  Check, 
  X, 
  Loader
} from 'lucide-react';
import { api } from '../services/api.js';

// Matches backend constants/branches.js exactly
const BRANCHES = ['CSE', 'IT', 'ECE', 'EE', 'ME', 'PIE', 'CE'];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];
// Matches Mentor model's `year` enum exactly
const SENIOR_YEARS = ['2nd Year', '3rd Year', '4th Year', 'Alumni'];
// Matches Resource model's `resources[].type` enum exactly
const RESOURCE_TYPES = ['lecture', 'pdf', 'pyq', 'notes'];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'resources': return <ResourcesTab />;
      case 'seniors': return <SeniorsTab />;
      case 'contributions': return <ContributionsTab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen -m-4 sm:-m-6 lg:-m-8">
      {/* Sidebar */}
      <aside className="bg-white w-full md:w-64 shadow-sm border-r border-gray-200 z-10 flex flex-col md:min-h-screen">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-nit-primary">Admin Panel</h2>
          <p className="text-xs text-gray-500 mt-0.5">NIT KKR Resources</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <SidebarItem icon={<LayoutDashboard size={18}/>} label="Overview" id="overview" active={activeTab} set={setActiveTab} />
          <SidebarItem icon={<BookOpen size={18}/>} label="Manage Resources" id="resources" active={activeTab} set={setActiveTab} />
          <SidebarItem icon={<Users size={18}/>} label="Manage Seniors" id="seniors" active={activeTab} set={setActiveTab} />
          <SidebarItem icon={<MessageSquare size={18}/>} label="Contributions" id="contributions" active={activeTab} set={setActiveTab} />
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
    className={`flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
      active === id ? 'bg-nit-primary text-white' : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <span className="mr-3">{icon}</span>
    {label}
  </button>
);

// --- TABS ---

const OverviewTab = () => {
  const [stats, setStats] = useState({ totalResources: 0, pendingContributions: 0 });
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    setLoading(true);
    setErrored(false);
    try {
      const resourcesRes = await api.get('/resources/all');
      const totalResources = resourcesRes.data.data ? resourcesRes.data.data.length : 0;

      const contributionsRes = await api.get('/contributions', { params: { status: 'pending' } });
      const pendingContributions = contributionsRes.data.data ? contributionsRes.data.data.length : 0;

      setStats({ totalResources, pendingContributions });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setErrored(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <StatCard title="Active Resources" value={loading ? '—' : stats.totalResources} color="green" />
        <StatCard title="Pending Requests" value={loading ? '—' : stats.pendingContributions} color="yellow" />
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-700 mb-4">System Status</h3>
        <div className={`flex items-center text-sm ${errored ? 'text-red-600' : 'text-green-600'}`}>
          <div className={`w-2.5 h-2.5 rounded-full mr-2 ${errored ? 'bg-red-500' : 'bg-green-500'}`}></div>
          {errored ? 'Could not reach the API — endpoints may not be available yet' : 'Connected'}
        </div>
      </div>
      <button
        onClick={fetchStats}
        disabled={loading}
        className="px-4 py-2 bg-nit-primary text-white rounded-lg text-sm hover:bg-blue-900 transition disabled:opacity-50"
      >
        {loading ? 'Refreshing...' : 'Refresh Stats'}
      </button>
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
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    branch: '', semester: '1', subjectName: '', subjectCode: '',
    resourceTitle: '', resourceType: 'lecture', resourceLink: ''
  });

  const [existingSubjects, setExistingSubjects] = useState([]);

  const fetchSubjects = async () => {
    if (formData.branch && formData.semester) {
      try {
        const res = await api.get('/resources', { params: { branch: formData.branch, sem: formData.semester } });
        setExistingSubjects(res.data.data || []);
      } catch (e) { console.error(e); }
    }
  };

  useEffect(() => {
    if (mode === 'add_material') fetchSubjects();
  }, [mode, formData.branch, formData.semester]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = mode === 'create_subject'
        ? {
            branch: formData.branch,
            semester: parseInt(formData.semester),
            subjectName: formData.subjectName,
            subjectCode: formData.subjectCode,
            resources: []
          }
        : {
            action: 'add_material',
            branch: formData.branch,
            semester: parseInt(formData.semester),
            subjectName: formData.subjectName,
            resource: {
              title: formData.resourceTitle,
              type: formData.resourceType,
              link: formData.resourceLink
            }
          };

      await api.post('/resources', payload);
      setMessage({ type: 'success', text: mode === 'create_subject' ? 'Subject created.' : 'Resource added.' });

      setFormData(prev => ({ ...prev, resourceTitle: '', resourceLink: '', subjectCode: '' }));
      if (mode === 'create_subject') setFormData(prev => ({ ...prev, subjectName: '' }));
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
        <div className="flex bg-white rounded-lg shadow-sm p-1 border border-gray-200 w-fit">
          <button onClick={() => setMode('add_material')} className={`px-4 py-2 text-sm rounded-md transition ${mode === 'add_material' ? 'bg-nit-primary text-white shadow' : 'text-gray-600'}`}>
            Add Material
          </button>
          <button onClick={() => setMode('create_subject')} className={`px-4 py-2 text-sm rounded-md transition ${mode === 'create_subject' ? 'bg-nit-primary text-white shadow' : 'text-gray-600'}`}>
            Create Subject
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        {message.text && (
          <div className={`mb-4 p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <select required className="w-full p-2.5 border border-gray-300 rounded-lg" value={formData.branch} onChange={e => setFormData({ ...formData, branch: e.target.value })}>
                <option value="">Select Branch</option>
                {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
              <select required className="w-full p-2.5 border border-gray-300 rounded-lg" value={formData.semester} onChange={e => setFormData({ ...formData, semester: e.target.value })}>
                {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {mode === 'create_subject' ? (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                <input type="text" required className="w-full p-2.5 border border-gray-300 rounded-lg" value={formData.subjectName} onChange={e => setFormData({ ...formData, subjectName: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Code (Optional)</label>
                <input type="text" className="w-full p-2.5 border border-gray-300 rounded-lg" value={formData.subjectCode} onChange={e => setFormData({ ...formData, subjectCode: e.target.value })} />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Subject</label>
              <select required className="w-full p-2.5 border border-gray-300 rounded-lg disabled:bg-gray-100" value={formData.subjectName} onChange={e => setFormData({ ...formData, subjectName: e.target.value })} disabled={!formData.branch}>
                <option value="">{existingSubjects.length ? 'Select a subject' : 'No subjects found — select branch first'}</option>
                {existingSubjects.map(s => <option key={s._id} value={s.subjectName}>{s.subjectName}</option>)}
              </select>
            </div>
          )}

          {mode === 'add_material' && (
            <div className="border-t border-gray-100 pt-4 mt-4 space-y-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Link (URL)</label>
                <input type="url" required className="w-full p-2.5 border border-gray-300 rounded-lg" placeholder="https://drive.google.com/..." value={formData.resourceLink} onChange={e => setFormData({ ...formData, resourceLink: e.target.value })} />
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-nit-primary text-white py-2.5 rounded-lg hover:bg-blue-900 transition flex justify-center items-center gap-2">
            {loading ? <Loader className="animate-spin w-4 h-4" /> : (mode === 'create_subject' ? 'Create Subject' : 'Add Resource')}
          </button>
        </form>
      </div>
    </div>
  );
};

const SeniorsTab = () => {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [formData, setFormData] = useState({
    name: '', branch: '', year: 'Alumni', company: '', linkedin: '', imageUrl: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/seniors', formData);
      setMsg('Profile added successfully.');
      setFormData({ name: '', branch: '', year: 'Alumni', company: '', linkedin: '', imageUrl: '' });
    } catch (err) {
      setMsg('Failed to add profile.');
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Add Senior / Alumni</h2>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        {msg && <div className="mb-4 text-sm font-medium text-emerald-600">{msg}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" required className="w-full p-2.5 border border-gray-300 rounded-lg" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
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
          <button type="submit" disabled={loading} className="w-full bg-nit-primary text-white py-2.5 rounded-lg hover:bg-blue-900 transition flex justify-center items-center gap-2">
            {loading ? <Loader className="animate-spin w-4 h-4" /> : 'Add Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

const ContributionsTab = () => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => { fetchContributions(); }, []);

  const fetchContributions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/contributions', { params: { status: 'pending' } });
      setContributions(res.data.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleAction = async (id, status) => {
    setProcessingId(id);
    try {
      await api.put(`/contributions/${id}`, { status });
      fetchContributions();
    } catch (e) { alert('Action failed.'); }
    finally { setProcessingId(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Pending Contributions</h2>
        <button onClick={fetchContributions} className="text-sm text-blue-600 hover:underline">Refresh</button>
      </div>

      {loading && !contributions.length ? (
        <div className="flex justify-center py-10"><Loader className="animate-spin text-nit-primary" /></div>
      ) : contributions.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-200 text-center text-gray-500 text-sm">
          No pending contributions.
        </div>
      ) : (
        <div className="space-y-4">
          {contributions.map(item => (
            <div key={item._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded uppercase ${item.type === 'bug' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    {item.type}
                  </span>
                  <span className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                  <span className="text-xs text-gray-400">by {item.submittedBy}</span>
                </div>
                <p className="text-gray-800 text-sm mb-3">{item.description}</p>
                {item.type === 'resource' && item.details && (
                  <div className="bg-gray-50 p-3 rounded text-xs text-gray-600 border border-gray-100 space-y-0.5">
                    <p><strong>Branch:</strong> {item.details.branch} &nbsp;<strong>Sem:</strong> {item.details.semester}</p>
                    <p><strong>Subject:</strong> {item.details.subjectName}</p>
                    <p><strong>Link:</strong> <a href={item.details.link} target="_blank" rel="noreferrer" className="text-blue-600 underline">{item.details.link}</a></p>
                  </div>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => handleAction(item._id, 'approved')} disabled={processingId === item._id} className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition disabled:opacity-50" title="Approve">
                  {processingId === item._id ? <Loader className="animate-spin w-5 h-5" /> : <Check size={18} />}
                </button>
                <button onClick={() => handleAction(item._id, 'rejected')} disabled={processingId === item._id} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition disabled:opacity-50" title="Reject">
                  <X size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};