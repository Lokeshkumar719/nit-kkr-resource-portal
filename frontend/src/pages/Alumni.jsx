import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ExternalLink,
  Briefcase,
  Mail,
  GraduationCap,
  Search,
  Building2,
  MapPin,
  Award,
  Calendar,
  ArrowLeft,
} from 'lucide-react';
import { seniorApi } from '../services/api.js';
import { BRANCHES, BRANCH_LABELS, ALUMNI_YEAR_VALUE } from '../constants/index.js';
import { ProfileSkeleton } from '../components/ui/Skeleton.jsx';
import { CustomSelect } from '../components/ui/CustomSelect.jsx';

import ProfileCard from '../components/ui/ProfileCard.jsx';

const EmptyState = ({ title, message }) => (
  <div className="empty-state col-span-full">
    <GraduationCap />
    <h3>{title}</h3>
    {message && <p>{message}</p>}
  </div>
);

export default function Alumni() {
  const [branch, setBranch] = useState('');
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (branch) {
      fetchAlumni();
    } else {
      setAlumni([]);
    }
  }, [branch]);

  const fetchAlumni = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await seniorApi.getByYearAndBranch(ALUMNI_YEAR_VALUE, branch);
      setAlumni(res.data.data?.mentors || []);
    } catch (err) {
      setError('Could not load alumni profiles right now.');
      setAlumni([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAlumni = useMemo(() => {
    if (!search.trim()) return alumni;
    const q = search.trim().toLowerCase();
    return alumni.filter(
      (a) =>
        a.name?.toLowerCase().includes(q) ||
        a.company?.toLowerCase().includes(q) ||
        a.email?.toLowerCase().includes(q)
    );
  }, [alumni, search]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-1">
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-10 h-10 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-nit-primary hover:border-nit-primary/30 transition-all shadow-sm group"
              title="Go Back"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-nit-primary group-hover:-translate-x-0.5 transition-all" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-amber-500/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h1>Alumni Network</h1>
            <p>
              Connect with NIT KKR graduates — see where they are now and reach out for guidance.
            </p>
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
              id="alumni-branch-filter"
            />
          </div>
          {branch && (
            <div>
              <label className="filter-label">Search</label>
              <div className="search-bar">
                <Search className="search-icon w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name, company..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  id="alumni-search"
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
          message="Choose your branch above to browse alumni profiles."
        />
      ) : loading ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="h-5 w-32 bg-slate-200 rounded animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
          <ProfileSkeleton count={8} />
        </>
      ) : error ? (
        <div className="error-banner">{error}</div>
      ) : filteredAlumni.length === 0 ? (
        <EmptyState
          title={search ? 'No matching alumni' : 'No alumni listed yet'}
          message={
            search
              ? 'Try a different search term.'
              : `We're still adding alumni profiles for ${branch}.`
          }
        />
      ) : (
        <>
          {/* Results count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 font-medium">
              {filteredAlumni.length} alumni profile{filteredAlumni.length !== 1 ? 's' : ''}
              {search && ` matching "${search}"`}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredAlumni.map((person, i) => (
              <ProfileCard key={person._id} data={person} index={i} variant="alumni" />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
