import React, { useState, useEffect, useRef } from 'react';
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
  Edit2,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api, updateSubject, deleteSubject, getBugs, resolveBug, getBugDownloadUrl } from '../services/api.js';
import { ContributionSkeleton, OverviewSkeleton } from '../components/ui/Skeleton.jsx';
import toast from 'react-hot-toast';
import { parseRateLimitError } from '../utils/rateLimitUtils.js';
import { useRateLimitCountdown } from '../hooks/useRateLimitCountdown.js';
import useStickyState from '../hooks/useStickyState.js';

import CreateSubjectForm from '../components/SubjectManagement/CreateSubjectForm.jsx';
import SubjectManagementTab from '../components/SubjectManagement/SubjectManagementTab.jsx';
import ResourceManagementTab from '../components/ResourceManagement/ResourceManagementTab.jsx';
import ContributionManagementTab from '../components/ContributionManagement/ContributionManagementTab.jsx';
import SeniorManagementTab from '../components/SeniorManagement/SeniorManagementTab.jsx';
import { useSubjects } from '../components/SubjectManagement/hooks/useSubjects.js';

// Matches backend constants/branches.js exactly
const BRANCHES = [
  'CSE',
  'IT',
  'AIDS',
  'AIML',
  'MNC',
  'ECE',
  'EE',
  'ME',
  'PIE',
  'CE',
  'IIOT',
  'SET',
  'VLSI',
  'ROBOTICS',
];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];
// Matches Mentor model's `year` enum exactly
const SENIOR_YEARS = ['2nd Year', '3rd Year', '4th Year', 'Alumni'];
// Matches Resource model's `resources[].type` enum exactly
const RESOURCE_TYPES = ['LECTURES', 'BOOKS', 'NOTES', 'PYQS'];

export default function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const VALID_TABS = ['overview', 'subjects', 'resources', 'seniors', 'contributions', 'bugs'];
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

  const handleGoBack = () => {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('admin_')) sessionStorage.removeItem(key);
    });
    navigate(-1);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'subjects':
        return <SubjectManagementTab />;
      case 'resources':
        return <ResourceManagementTab />;
      case 'seniors':
        return <SeniorManagementTab />;
      case 'contributions':
        return <ContributionManagementTab />;
      case 'bugs':
        return <BugsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen -m-4 sm:-m-6 lg:-m-8">
      {/* Sidebar */}
      <aside className="bg-white w-full md:w-64 shadow-sm border-r border-slate-300 z-10 flex flex-col md:min-h-screen">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button
              onClick={handleGoBack}
              className="flex items-center justify-center w-8 h-8 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 hover:text-nit-primary transition-all group shrink-0"
              aria-label="Go Back"
              title="Go Back"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-nit-primary leading-tight">Admin Panel</h2>
              <p className="text-xs text-gray-500 mt-0.5">NIT KKR Academic Portal</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem
            icon={<LayoutDashboard size={18} />}
            label="Overview"
            id="overview"
            active={activeTab}
            set={setActiveTab}
          />
          <SidebarItem
            icon={<BookOpen size={18} />}
            label="Manage Subjects"
            id="subjects"
            active={activeTab}
            set={setActiveTab}
          />
          <SidebarItem
            icon={<LayoutDashboard size={18} />}
            label="Manage Resources"
            id="resources"
            active={activeTab}
            set={setActiveTab}
          />
          <SidebarItem
            icon={<Users size={18} />}
            label="Manage Seniors"
            id="seniors"
            active={activeTab}
            set={setActiveTab}
          />
          <SidebarItem
            icon={<MessageSquare size={18} />}
            label="Contributions"
            id="contributions"
            active={activeTab}
            set={setActiveTab}
          />
          <SidebarItem
            icon={<Bug size={18} />}
            label="Manage Bugs"
            id="bugs"
            active={activeTab}
            set={setActiveTab}
          />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-50">{renderContent()}</main>
    </div>
  );
}

const SidebarItem = ({ icon, label, id, active, set }) => (
  <button
    onClick={() => set(id)}
    className={`flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg border transition-all ${
      active === id
        ? 'bg-nit-primary text-white border-nit-primary shadow-sm'
        : 'bg-white text-gray-700 border-slate-200 hover:border-nit-primary/40 hover:bg-slate-50 hover:shadow-sm'
    }`}
  >
    <span className={`mr-3 ${active === id ? 'text-white' : 'text-slate-500'}`}>{icon}</span>
    {label}
  </button>
);

// --- TABS ---

const OverviewTab = () => {
  const [stats, setStats] = useState({
    totalResources: 0,
    pendingContributions: 0,
    pendingBugs: 0,
  });
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);

  const [branch, setBranch] = useStickyState('', 'admin_overview_branch');
  const [semester, setSemester] = useStickyState('', 'admin_overview_sem');
  const [subjectId, setSubjectId] = useStickyState('', 'admin_overview_subject');
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    return () => {
      ['admin_overview_branch', 'admin_overview_sem', 'admin_overview_subject'].forEach((k) =>
        sessionStorage.removeItem(k)
      );
    };
  }, []);

  useEffect(() => {
    setSubjectId('');
    const params = {};
    if (branch) params.branch = branch;
    if (semester) params.semester = semester;

    api
      .get('/subjects', { params })
      .then((res) => setSubjects(res.data?.data?.subjects || res.data?.data || []))
      .catch(() => setSubjects([]));
  }, [branch, semester, setSubjectId]);

  const fetchStats = React.useCallback(async () => {
    setLoading(true);
    setErrored(false);
    try {
      let totalResources = 0;
      let pendingContributions = 0;
      let pendingBugs = 0;

      const params = {};
      if (subjectId) params.subjectId = subjectId;
      else {
        if (branch) params.branch = branch;
        if (semester) params.semester = semester;
      }

      const statsRes = await api.get('/resources/stats', { params });
      totalResources = statsRes.data.data ? statsRes.data.data.total : 0;

      const contributionsRes = await api.get('/contributions', {
        params: { status: 'PENDING', ...params },
      });
      pendingContributions = contributionsRes.data.data ? contributionsRes.data.data.length : 0;

      try {
        const bugsRes = await getBugs({ status: 'OPEN' });
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
  }, [subjectId, branch, semester]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800">Overview</h2>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-300 space-y-4">
        <h3 className="font-semibold text-gray-700">Filter by Subject</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <select
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
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
            <select
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
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
            <select
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white disabled:opacity-50"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              disabled={!subjects.length && !loading}
            >
              <option value="">{subjects.length ? 'Select Subject' : 'No subjects found'}</option>
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.subjectName} ({s.subjectCode})
                </option>
              ))}
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
  const valueColor =
    { green: 'text-emerald-600', yellow: 'text-amber-600' }[color] || 'text-gray-800';
  const borderColor =
    { green: 'border-emerald-500', yellow: 'border-amber-500' }[color] || 'border-gray-300';
  return (
    <div className={`p-6 rounded-xl border-l-4 shadow-sm bg-white ${borderColor}`}>
      <h3 className="text-gray-500 font-semibold uppercase text-xs tracking-wider">{title}</h3>
      <p className={`text-3xl font-extrabold mt-2 ${valueColor}`}>{value}</p>
    </div>
  );
};

const BugsTab = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchBugs();
  }, []);

  const fetchBugs = async () => {
    setLoading(true);
    try {
      const res = await getBugs({ status: 'OPEN' });
      setBugs(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveBug = async (id) => {
    setProcessingId(id);
    try {
      await resolveBug(id);
      toast.success('Bug marked as resolved.');
      fetchBugs();
    } catch (e) {
      toast.error('Resolve failed: ' + (e.response?.data?.message || 'Unknown error'));
    } finally {
      setProcessingId(null);
    }
  };

  const handleDownloadAttachment = async (bugId) => {
    try {
      const res = await getBugDownloadUrl(bugId);
      const url = res.data?.data?.downloadUrl;
      if (url) {
        window.open(url, '_blank');
      }
    } catch (e) {
      toast.error('Failed to get download link: ' + (e.response?.data?.message || e.message));
    }
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
          <p className="text-gray-500 text-sm max-w-sm">
            Your platform is running smoothly with no unresolved bug reports.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bugs.map((bug) => (
            <div
              key={bug._id}
              className="bg-white p-5 rounded-xl shadow-sm border border-slate-300 flex flex-col md:flex-row justify-between items-start gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="px-2 py-0.5 text-xs font-semibold rounded uppercase bg-red-100 text-red-700">
                    BUG REPORT
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(bug.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-gray-600 font-medium">
                    Reported by: {bug.reportedBy?.username || bug.reportedBy?.email || 'Unknown'}
                  </span>
                </div>
                <p className="text-gray-800 text-sm mb-1 whitespace-pre-wrap">{bug.description}</p>
                {bug.fileKey && (
                  <button
                    onClick={() => handleDownloadAttachment(bug._id)}
                    className="mt-2 flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <Download className="w-3.5 h-3.5" />
                    View Attachment ({bug.fileName})
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto shrink-0 mt-2 md:mt-0">
                <button
                  onClick={() => handleResolveBug(bug._id)}
                  disabled={processingId === bug._id}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-sm font-medium transition disabled:opacity-50"
                >
                  {processingId === bug._id ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
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
