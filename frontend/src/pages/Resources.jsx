import React, { useState, useEffect, useMemo } from 'react';
import {
  Video, FileText, BookOpen, StickyNote,
  Search, FolderOpen, ExternalLink, Library, ChevronRight
} from 'lucide-react';
import { resourceApi } from '../services/api.js';
import { BRANCHES, SEMESTERS, RESOURCE_TYPES } from '../constants/index.js';
import { ResourceSkeleton } from '../components/ui/Skeleton.jsx';

const TYPE_ICONS = {
  lecture: Video,
  pdf: BookOpen,
  pyq: FileText,
  notes: StickyNote,
};

const TYPE_COLORS = {
  lecture: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200' },
  pdf: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  pyq: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  notes: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
};

const EmptyState = ({ icon: Icon = FolderOpen, title, message }) => (
  <div className="empty-state">
    <Icon />
    <h3>{title}</h3>
    {message && <p>{message}</p>}
  </div>
);

export default function Resources() {
  const [branch, setBranch] = useState('');
  const [sem, setSem] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('lecture');

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
      setSelectedSubject(null);
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
    return subjects.filter(s =>
      s.subjectName?.toLowerCase().includes(q) || s.subjectCode?.toLowerCase().includes(q)
    );
  }, [subjects, search]);

  const itemsForActiveType = useMemo(() => {
    if (!selectedSubject?.resources) return [];
    return selectedSubject.resources.filter(r => r.type === activeType);
  }, [selectedSubject, activeType]);

  const totalResources = useMemo(() => {
    return selectedSubject?.resources?.length || 0;
  }, [selectedSubject]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
            <Library className="w-5 h-5 text-white" />
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
            <select
              className="form-select"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              id="resource-branch-filter"
            >
              <option value="">Choose branch</option>
              {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="filter-label">Semester</label>
            <select
              className="form-select"
              value={sem}
              onChange={(e) => setSem(e.target.value)}
              id="resource-sem-filter"
            >
              <option value="">Choose semester</option>
              {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
            </select>
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
                      onClick={() => { setSelectedSubject(sub); setActiveType('lecture'); }}
                      className={`subject-item animate-fade-in ${isActive ? 'active' : ''}`}
                      style={{ animationDelay: `${i * 0.03}s` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0">
                          <div className="subject-name truncate">{sub.subjectName}</div>
                          {sub.subjectCode && (
                            <div className="subject-code">{sub.subjectCode}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {resourceCount > 0 && (
                            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                              isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {resourceCount}
                            </span>
                          )}
                          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                            isActive ? 'text-white/70' : 'text-slate-300'
                          }`} />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title="No subjects found"
                message={search ? 'Try a different search term.' : "We're still adding materials for this selection."}
              />
            )}
          </div>

          {/* Resource detail panel */}
          <div className="md:col-span-8 lg:col-span-9">
            {!selectedSubject ? (
              <div className="h-full min-h-[340px] flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 rounded-xl bg-white px-6">
                <BookOpen className="w-10 h-10 text-slate-200 mb-3" />
                <p className="text-sm font-medium text-slate-400">Select a subject to view its materials</p>
                <p className="text-xs text-slate-300 mt-1">Choose from the list on the left</p>
              </div>
            ) : (
              <div className="panel animate-slide-in-right">
                {/* Panel header */}
                <div className="panel-header">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">{selectedSubject.subjectName}</h2>
                      <div className="flex items-center gap-2 mt-0.5">
                        {selectedSubject.subjectCode && (
                          <span className="text-xs text-gray-400 font-medium">{selectedSubject.subjectCode}</span>
                        )}
                        <span className="tag tag-blue">{totalResources} resource{totalResources !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Type tabs */}
                <div className="tab-bar px-2">
                  {RESOURCE_TYPES.map(t => {
                    const Icon = TYPE_ICONS[t.value];
                    const count = selectedSubject.resources?.filter(r => r.type === t.value).length || 0;
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
                  {itemsForActiveType.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {itemsForActiveType.map((item, i) => {
                        const color = TYPE_COLORS[activeType];
                        return (
                          <a
                            key={i}
                            href={item.link}
                            target="_blank"
                            rel="noreferrer"
                            className="resource-list-item"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-8 h-8 rounded-lg ${color.bg} flex items-center justify-center shrink-0`}>
                                {React.createElement(TYPE_ICONS[activeType], {
                                  className: `w-4 h-4 ${color.text}`
                                })}
                              </div>
                              <span className="resource-title truncate">{item.title}</span>
                            </div>
                            <ExternalLink className="resource-action w-4 h-4" />
                          </a>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className={`w-12 h-12 mx-auto rounded-xl ${TYPE_COLORS[activeType].bg} flex items-center justify-center mb-3`}>
                        {React.createElement(TYPE_ICONS[activeType], {
                          className: `w-6 h-6 ${TYPE_COLORS[activeType].text}`
                        })}
                      </div>
                      <p className="text-sm font-medium text-gray-400">
                        No {RESOURCE_TYPES.find(t => t.value === activeType)?.label.toLowerCase()} available yet
                      </p>
                      <p className="text-xs text-gray-300 mt-1">Check back later or contribute resources</p>
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