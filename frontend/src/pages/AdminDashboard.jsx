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
  Bug
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api, getContributionDownloadUrl } from '../services/api.js';
import { MENTOR_TAGS } from '../constants/index.js';
import { ContributionSkeleton, OverviewSkeleton, AdminFormSkeleton } from '../components/ui/Skeleton.jsx';

// Matches backend constants/branches.js exactly
const BRANCHES = ['CSE', 'IT', 'ECE', 'EE', 'ME', 'PIE', 'CE'];
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
  const [stats, setStats] = useState({ totalResources: 0, pendingContributions: 0 });
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

      if (subjectId) {
        const resourcesRes = await api.get('/resources', { params: { subjectId } });
        totalResources = resourcesRes.data.data ? resourcesRes.data.data.length : 0;

        const contributionsRes = await api.get('/contributions', { params: { status: 'PENDING', subjectId } });
        pendingContributions = contributionsRes.data.data ? contributionsRes.data.data.length : 0;
      } else {
        const contributionsRes = await api.get('/contributions', { params: { status: 'PENDING' } });
        pendingContributions = contributionsRes.data.data ? contributionsRes.data.data.length : 0;
      }

      setStats({ totalResources, pendingContributions });
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatCard title="Active Resources" value={subjectId ? stats.totalResources : '-'} color="green" />
            <StatCard title="Pending Requests" value={stats.pendingContributions} color="yellow" />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-300">
            <h3 className="font-semibold text-gray-700 mb-4">System Status</h3>
            <div className={`flex items-center text-sm ${errored ? 'text-red-600' : 'text-green-600'}`}>
              <div className={`w-2.5 h-2.5 rounded-full mr-2 ${errored ? 'bg-red-500' : 'bg-green-500'}`}></div>
              {errored ? 'Could not reach the API — endpoints may not be available yet' : 'Connected'}
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
        <div className="flex bg-white rounded-lg shadow-sm p-1 border border-slate-300 w-fit">
          <button onClick={() => setMode('add_material')} className={`px-4 py-2 text-sm rounded-md transition ${mode === 'add_material' ? 'bg-nit-primary text-white shadow' : 'text-gray-600'}`}>
            Add Material
          </button>
          <button onClick={() => setMode('create_subject')} className={`px-4 py-2 text-sm rounded-md transition ${mode === 'create_subject' ? 'bg-nit-primary text-white shadow' : 'text-gray-600'}`}>
            Create Subject
          </button>
        </div>
      </div>

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
    </div>
  );
};

const SeniorsTab = () => {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [formData, setFormData] = useState({
    name: '', email: '', branch: '', year: '4th Year', company: '', linkedin: '', imageUrl: '', batchStart: '', batchEnd: '', achievements: '', tags: []
  });

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
      <h2 className="text-2xl font-bold text-gray-800">Add Senior / Alumni</h2>
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
    </div>
  );
};

const ContributionsTab = () => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState({ id: null, action: null });

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
    } catch (e) { alert('Approve failed: ' + (e.response?.data?.message || 'Unknown error')); }
    finally { setProcessing({ id: null, action: null }); }
  };

  const handleReject = async (id) => {
    setProcessing({ id, action: 'reject' });
    try {
      await api.delete(`/contributions/${id}`);
      fetchContributions();
    } catch (e) { alert('Reject failed: ' + (e.response?.data?.message || 'Unknown error')); }
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
            <div key={item._id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-300 flex flex-col md:flex-row justify-between items-start gap-4">
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
                  <p className="text-xs text-gray-500">Link: <a href={item.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">{item.url}</a></p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                {item.fileName && (
                  <button 
                    onClick={async () => {
                      try {
                        const res = await getContributionDownloadUrl(item._id);
                        if (res.data?.data?.downloadUrl) {
                          window.location.href = res.data.data.downloadUrl;
                        }
                      } catch (err) {
                        alert("Could not generate download link.");
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
    } catch (e) { alert('Resolve failed: ' + (e.response?.data?.message || 'Unknown error')); }
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