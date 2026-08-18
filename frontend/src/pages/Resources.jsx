import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Video,
  FileText,
  BookOpen,
  StickyNote,
  Search,
  FolderOpen,
  ExternalLink,
  Library,
  ChevronRight,
  ArrowLeft,
  Download,
} from 'lucide-react';
import { resourceApi, getResources, getResourceDownloadUrl } from '../services/api.js';
import { BRANCHES, BRANCH_LABELS, SEMESTERS, RESOURCE_TYPES } from '../constants/index.js';
import { ResourceSkeleton } from '../components/ui/Skeleton.jsx';
import { CustomSelect } from '../components/ui/CustomSelect.jsx';
import toast from 'react-hot-toast';
import useStickyState from '../hooks/useStickyState';

const TYPE_ICONS = {
  LECTURES: Video,
  BOOKS: BookOpen,
  PYQS: FileText,
  NOTES: StickyNote,
};

const TYPE_COLORS = {
  LECTURES: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200' },
  BOOKS: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  PYQS: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  NOTES: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
};

const EmptyState = ({ icon: Icon = FolderOpen, title, message }) => (
  <div className="empty-state">
    <Icon />
    <h3>{title}</h3>
    {message && <p>{message}</p>}
  </div>
);

export default function Resources() {
  const [branch, setBranch] = useStickyState('', 'res_branch');
  const [sem, setSem] = useStickyState('', 'res_sem');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useStickyState(null, 'res_subject');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useStickyState('LECTURES', 'res_type');
  const [subjectResources, setSubjectResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      ['res_branch', 'res_sem', 'res_subject', 'res_type'].forEach((key) =>
        sessionStorage.removeItem(key)
      );
    };
  }, []);

  const handleGoBack = () => {
    ['res_branch', 'res_sem', 'res_subject', 'res_type'].forEach((key) =>
      sessionStorage.removeItem(key)
    );
    navigate(-1);
  };

  useEffect(() => {
    if (branch && sem) {
      fetchResources();
    } else {
      setSubjects([]);
      setSelectedSubject(null);
    }
  }, [branch, sem]);

  const fetchResources = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await resourceApi.getByBranchAndSem(branch, sem);
      setSubjects(res.data.data || []);
    } catch (err) {
      setSubjects([]);
      setError('Could not load resources right now.');
    } finally {
      setLoading(false);
    }
  };

  const filteredSubjects = useMemo(() => {
    if (!search.trim()) return subjects;
    const q = search.trim().toLowerCase();
    return subjects.filter(
      (s) => s.subjectName?.toLowerCase().includes(q) || s.subjectCode?.toLowerCase().includes(q)
    );
  }, [subjects, search]);

  useEffect(() => {
    if (selectedSubject) {
      fetchSubjectResources(selectedSubject._id);
    } else {
      setSubjectResources([]);
    }
  }, [selectedSubject]);

  const fetchSubjectResources = async (subjectId) => {
    setLoadingResources(true);
    try {
      const res = await getResources(subjectId);
      setSubjectResources(res.data.data || []);
    } catch (err) {
      setSubjectResources([]);
    } finally {
      setLoadingResources(false);
    }
  };

  const itemsForActiveType = useMemo(() => {
    return subjectResources.filter((r) => r.type === activeType);
  }, [subjectResources, activeType]);

  const totalResources = useMemo(() => {
    return subjectResources.length || 0;
  }, [subjectResources]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="page-header">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-1">
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleGoBack}
              className="flex items-center justify-center w-10 h-10 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-nit-primary hover:border-nit-primary/30 transition-all shadow-sm group"
              title="Go Back"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-nit-primary group-hover:-translate-x-0.5 transition-all" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Library className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h1>Study Materials</h1>
            <p>Notes, books, PYQs, and lecture links organized by branch and semester.</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="filter-label">Branch</label>
            <CustomSelect
              value={branch}
              onChange={(val) => {
                setBranch(val);
                setSelectedSubject(null);
                setActiveType('LECTURES');
              }}
              options={BRANCHES.map((b) => ({ value: b, label: BRANCH_LABELS[b] }))}
              placeholder="Choose branch"
              id="resource-branch-filter"
            />
          </div>
          <div>
            <label className="filter-label">Semester</label>
            <CustomSelect
              value={sem}
              onChange={(val) => {
                setSem(Number(val));
                setSelectedSubject(null);
                setActiveType('LECTURES');
              }}
              options={SEMESTERS.map((s) => ({ value: s, label: `Semester ${s}` }))}
              placeholder="Choose semester"
              id="resource-sem-filter"
            />
          </div>
        </div>
      </div>

      {!branch || !sem ? (
        <EmptyState
          icon={Library}
          title="Select a branch and semester"
          message="Choose both filters above to browse subjects and materials."
        />
      ) : (
        <div className="grid md:grid-cols-12 gap-6">
          {/* Subject list — library sidebar */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="search-bar mb-3">
              <Search className="search-icon w-4 h-4" />
              <input
                type="text"
                placeholder="Search subjects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                id="subject-search"
              />
            </div>

            {loading ? (
              <ResourceSkeleton rows={6} />
            ) : error ? (
              <div className="error-banner">{error}</div>
            ) : filteredSubjects.length > 0 ? (
              <div className="space-y-1.5 max-h-[560px] overflow-y-auto pr-1">
                {filteredSubjects.map((sub, i) => {
                  const isActive = selectedSubject?._id === sub._id;
                  const resourceCount = sub.resources?.length || 0;
                  return (
                    <button
                      key={sub._id}
                      onClick={() => {
                        setSelectedSubject(sub);
                        setActiveType('LECTURES');
                      }}
                      className={`subject-item animate-fade-in ${isActive ? 'active' : ''}`}
                      style={{ animationDelay: `${i * 0.03}s` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0">
                          <div className="subject-name truncate">{sub.subjectName}</div>
                          {sub.subjectCode && <div className="subject-code">{sub.subjectCode}</div>}
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Removing hardcoded resourceCount since it's not pre-fetched */}
                          {/* 
                          {resourceCount > 0 && (
                            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                              isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {resourceCount}
                            </span>
                          )} 
                          */}
                          <ChevronRight
                            className={`w-3.5 h-3.5 transition-transform ${
                              isActive ? 'text-white/70' : 'text-slate-300'
                            }`}
                          />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title="No subjects found"
                message={
                  search
                    ? 'Try a different search term.'
                    : "We're still adding materials for this selection."
                }
              />
            )}
          </div>

          {/* Resource detail panel */}
          <div className="md:col-span-8 lg:col-span-9">
            {!selectedSubject ? (
              <div className="h-full min-h-[340px] flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-300 rounded-xl bg-white px-6">
                <BookOpen className="w-10 h-10 text-slate-200 mb-3" />
                <p className="text-sm font-medium text-slate-400">
                  Select a subject to view its materials
                </p>
                <p className="text-xs text-slate-300 mt-1">Choose from the list on the left</p>
              </div>
            ) : (
              <div className="panel animate-slide-in-right">
                {/* Panel header */}
                <div className="panel-header">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">
                        {selectedSubject.subjectName}
                      </h2>
                      <div className="flex items-center gap-2 mt-0.5">
                        {selectedSubject.subjectCode && (
                          <span className="text-xs text-gray-400 font-medium">
                            {selectedSubject.subjectCode}
                          </span>
                        )}
                        <span className="tag tag-blue">
                          {totalResources} resource{totalResources !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Type tabs */}
                <div className="tab-bar px-2">
                  {RESOURCE_TYPES.map((t) => {
                    const Icon = TYPE_ICONS[t.value] || TYPE_ICONS['LECTURES'];
                    const count = subjectResources.filter((r) => r.type === t.value).length || 0;
                    const isActive = activeType === t.value;
                    return (
                      <button
                        key={t.value}
                        onClick={() => setActiveType(t.value)}
                        className={`tab-item ${isActive ? 'active' : ''}`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {t.label}
                        <span className="tab-badge">{count}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Resource rows */}
                <div className="panel-body">
                  {loadingResources ? (
                    <ResourceSkeleton rows={3} />
                  ) : itemsForActiveType.length > 0 ? (
                    <div className="space-y-0">
                      {itemsForActiveType.map((item, i) => {
                        const color = TYPE_COLORS[activeType] || TYPE_COLORS['LECTURES'];
                        const ActiveIcon = TYPE_ICONS[activeType] || TYPE_ICONS['LECTURES'];
                        return (
                          <a
                            key={i}
                            href={item.url || '#'}
                            target={item.url ? '_blank' : '_self'}
                            rel="noreferrer"
                            className="resource-list-item"
                            onClick={async (e) => {
                              if (!item.url) {
                                e.preventDefault();
                                try {
                                  const res = await getResourceDownloadUrl(item._id);
                                  if (res.data?.data?.downloadUrl) {
                                    window.location.href = res.data.data.downloadUrl;
                                  }
                                } catch (err) {
                                  toast.error(
                                    'Could not generate download link. Please try again.'
                                  );
                                }
                              }
                            }}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`w-8 h-8 rounded-lg ${color.bg} flex items-center justify-center shrink-0`}
                              >
                                {React.createElement(ActiveIcon, {
                                  className: `w-4 h-4 ${color.text}`,
                                })}
                              </div>
                              <span className="resource-title truncate">{item.title}</span>
                            </div>
                            {item.url ? (
                              <div className="resource-action">
                                <ExternalLink className="w-3.5 h-3.5" />
                              </div>
                            ) : (
                              <div className="resource-action">
                                <Download className="w-3.5 h-3.5" />
                              </div>
                            )}
                          </a>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div
                        className={`w-12 h-12 mx-auto rounded-xl ${(TYPE_COLORS[activeType] || TYPE_COLORS['LECTURES']).bg} flex items-center justify-center mb-3`}
                      >
                        {React.createElement(TYPE_ICONS[activeType] || TYPE_ICONS['LECTURES'], {
                          className: `w-6 h-6 ${(TYPE_COLORS[activeType] || TYPE_COLORS['LECTURES']).text}`,
                        })}
                      </div>
                      <p className="text-sm font-medium text-gray-400">
                        No {RESOURCE_TYPES.find((t) => t.value === activeType)?.label.toLowerCase()}{' '}
                        available yet
                      </p>
                      <p className="text-xs text-gray-300 mt-1">
                        Check back later or contribute resources
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
