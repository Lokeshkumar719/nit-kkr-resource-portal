import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ExternalLink,
  Briefcase,
  Mail,
  Users,
  Search,
  Building2,
  Award,
  GraduationCap,
  ArrowLeft,
} from 'lucide-react';
import { seniorApi } from '../services/api.js';
import { BRANCHES, BRANCH_LABELS, SENIOR_YEARS } from '../constants/index.js';
import { ProfileSkeleton } from '../components/ui/Skeleton.jsx';
import { CustomSelect } from '../components/ui/CustomSelect.jsx';

const YEAR_GRADIENTS = {
  '4th Year': 'from-nit-primary to-blue-600',
  '3rd Year': 'from-emerald-500 to-teal-600',
  '2nd Year': 'from-violet-500 to-indigo-600',
};

const YEAR_ACCENT = {
  '4th Year': { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  '3rd Year': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  '2nd Year': { bg: 'bg-violet-50', text: 'text-violet-700', dot: 'bg-violet-500' },
};

import ProfileCard from '../components/ui/ProfileCard.jsx';

const EmptyState = ({ title, message }) => (
  <div className="empty-state col-span-full">
    <Users />
    <h3>{title}</h3>
    {message && <p>{message}</p>}
  </div>
);

export default function Seniors() {
  const [branch, setBranch] = useState('');
  const [seniorsByYear, setSeniorsByYear] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (branch) {
      fetchAllYears();
    } else {
      setSeniorsByYear({});
    }
  }, [branch]);

  const fetchAllYears = async () => {
    setLoading(true);
    setError('');
    try {
      const results = await Promise.all(
        SENIOR_YEARS.map((year) => seniorApi.getByYearAndBranch(year, branch))
      );
      const grouped = {};
      SENIOR_YEARS.forEach((year, i) => {
        grouped[year] = results[i].data.data?.mentors || [];
      });
      setSeniorsByYear(grouped);
    } catch (err) {
      setError('Could not load senior profiles right now.');
      setSeniorsByYear({});
    } finally {
      setLoading(false);
    }
  };

  const totalCount = useMemo(
    () => Object.values(seniorsByYear).reduce((sum, arr) => sum + arr.length, 0),
    [seniorsByYear]
  );

  // Apply search filter across all years
  const filteredByYear = useMemo(() => {
    if (!search.trim()) return seniorsByYear;
    const q = search.trim().toLowerCase();
    const filtered = {};
    for (const year of SENIOR_YEARS) {
      const list = seniorsByYear[year] || [];
      filtered[year] = list.filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.company?.toLowerCase().includes(q) ||
          s.experiences?.some((exp) => exp.company?.toLowerCase().includes(q)) ||
          s.email?.toLowerCase().includes(q) ||
          s.tags?.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return filtered;
  }, [seniorsByYear, search]);

  const filteredTotal = useMemo(
    () => Object.values(filteredByYear).reduce((sum, arr) => sum + arr.length, 0),
    [filteredByYear]
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-1">
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-10 h-10 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-nit-primary hover:border-nit-primary/30 transition-all shadow-sm group"
              aria-label="Go Back"
              title="Go Back"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-nit-primary group-hover:-translate-x-0.5 transition-all" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Users className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h1>Senior Support</h1>
            <p>Connect with currently enrolled 2nd, 3rd, and 4th year students from your branch.</p>
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="filter-bar">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="filter-label">Branch</label>
            <CustomSelect
              value={branch}
              onChange={setBranch}
              options={BRANCHES.map((b) => ({ value: b, label: BRANCH_LABELS[b] }))}
              placeholder="Select branch"
              id="senior-branch-filter"
            />
          </div>
          {branch && (
            <div>
              <label className="filter-label">Search</label>
              <div className="search-bar">
                <Search className="search-icon w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name, company, tags..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  id="senior-search"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {!branch ? (
        <EmptyState
          title="Select a branch"
          message="Choose your branch above to see seniors organized by year."
        />
      ) : loading ? (
        <div className="space-y-8">
          <div className="year-section">
            <div className="flex items-center gap-3 mb-4 pl-1">
              <div className="h-7 w-48 bg-slate-200 rounded animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </div>
            <ProfileSkeleton count={8} />
          </div>
        </div>
      ) : error ? (
        <div className="error-banner">{error}</div>
      ) : totalCount === 0 ? (
        <EmptyState
          title="No seniors listed yet"
          message={`We're still adding senior profiles for ${branch}.`}
        />
      ) : filteredTotal === 0 && search ? (
        <EmptyState title="No matching seniors" message="Try a different search term." />
      ) : (
        <div className="space-y-8">
          {/* Year sections — displayed in reverse order (4th first) */}
          {[...SENIOR_YEARS].reverse().map((year) => {
            const list = filteredByYear[year] || [];
            if (list.length === 0) return null;
            const accent = YEAR_ACCENT[year];
            const gradient = YEAR_GRADIENTS[year];

            return (
              <div key={year} className="year-section animate-fade-in">
                {/* Year header badge */}
                <div className="flex items-center gap-3 mb-4 pl-1">
                  <div
                    className="flex items-center text-xl font-bold text-slate-800"
                    style={{ animationDelay: '0s' }}
                  >
                    <div className={`w-2.5 h-2.5 rounded-full ${accent.dot} mr-2.5`} />
                    {year}
                    <span className="text-slate-500 font-medium text-lg ml-2">
                      ({list.length} {list.length === 1 ? 'senior' : 'seniors'})
                    </span>
                  </div>
                </div>

                {/* Profile grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {list.map((senior, i) => (
                    <ProfileCard
                      key={senior._id}
                      data={senior}
                      index={i}
                      variant="senior"
                      customGradient={gradient}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
