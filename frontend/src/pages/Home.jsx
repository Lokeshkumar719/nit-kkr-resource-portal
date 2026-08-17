import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Users, Upload, Shield, GraduationCap, ArrowRight, Sparkles, FileText, Video } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { BRANCHES, SEMESTERS } from '../constants';
import toast from 'react-hot-toast';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const dashboardLink = user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard';

  const [resourceStats, setResourceStats] = useState({ total: 0, notes: 0, books: 0, pyqs: 0, lectures: 0 });

  useEffect(() => {
    api.get('/resources/stats')
      .then(res => {
        if (res.data && res.data.data) {
          setResourceStats(res.data.data);
        }
      })
      .catch(console.error);
  }, []);
  return (
    <div className="home-page">
      {/* ── Navbar ──────────────────────────── */}
      <nav className="home-nav">
        <div className="home-nav-inner">
          <Link to="/" className="home-logo-link">
            <div className="home-logo-icon">
              <img src="https://upload.wikimedia.org/wikipedia/en/7/75/National_Institute_of_Technology%2C_Kurukshetra_Logo.png" alt="NIT KKR Logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="home-logo-text">NIT KKR Academic Portal</span>
          </Link>
          <div className="home-nav-actions">
            {user ? (
              <Link to={dashboardLink} className="home-btn-primary">
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link to="/login" className="home-btn-primary">
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero Section ──────────────────────────── */}
      <section className="home-hero">
        <div className="home-hero-bg" />
        <div className="home-hero-content">
          <div className="home-hero-badge">
            <Sparkles className="w-4 h-4" />
            <span>Built by Students, for Students</span>
          </div>
          <h1 className="home-hero-title">
            Your Academic <span className="home-hero-highlight">Resource Hub</span> at NIT Kurukshetra
          </h1>
          <p className="home-hero-subtitle">
            Access notes, books, previous year papers, and lecture links — all organized by branch and semester. 
            Contribute resources, connect with seniors, and help your juniors thrive.
          </p>
          <div className="home-hero-actions">
            <Link to={user ? dashboardLink : "/login"} className="home-btn-hero-primary">
              {user ? 'Go to Dashboard' : 'Start Exploring'} <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#features" className="home-btn-hero-secondary">
              See Features
            </a>
          </div>
          <div className="home-hero-stats">
            <div className="home-stat">
              <span className="home-stat-value">{BRANCHES.length}+</span>
              <span className="home-stat-label">Branches</span>
            </div>
            <div className="home-stat-divider" />
            <div className="home-stat">
              <span className="home-stat-value">{SEMESTERS.length}</span>
              <span className="home-stat-label">Semesters</span>
            </div>
            <div className="home-stat-divider" />
            <div className="home-stat">
              <span className="home-stat-value">{resourceStats.total}</span>
              <span className="home-stat-label">Total Resources</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-8 mt-6 pt-6 border-t border-slate-200 w-full max-w-2xl mx-auto">
            <div className="home-stat">
              <span className="home-stat-value text-2xl">{resourceStats.notes}</span>
              <span className="home-stat-label mt-1">Notes</span>
            </div>
            <div className="home-stat">
              <span className="home-stat-value text-2xl">{resourceStats.books}</span>
              <span className="home-stat-label mt-1">Books</span>
            </div>
            <div className="home-stat">
              <span className="home-stat-value text-2xl">{resourceStats.pyqs}</span>
              <span className="home-stat-label mt-1">PYQs</span>
            </div>
            <div className="home-stat">
              <span className="home-stat-value text-2xl">{resourceStats.lectures}</span>
              <span className="home-stat-label mt-1">Lectures</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ──────────────────────────── */}
      <section id="features" className="home-features">
        <div className="home-section-inner">
          <div className="home-section-header">
            <h2 className="home-section-title">Everything You Need to Ace Your Semesters</h2>
            <p className="home-section-subtitle">One platform for all your academic needs — meticulously organized and community-driven.</p>
          </div>
          <div className="home-features-grid">
            <FeatureCard
              icon={<FileText className="w-6 h-6" />}
              title="Notes & Books"
              description="Access comprehensive study materials uploaded and verified by your peers and seniors."
              color="blue"
            />
            <FeatureCard
              icon={<BookOpen className="w-6 h-6" />}
              title="Previous Year Papers"
              description="Never go into an exam unprepared. Browse PYQs organized by subject and semester."
              color="amber"
            />
            <FeatureCard
              icon={<Video className="w-6 h-6" />}
              title="Lecture Links"
              description="Curated YouTube lectures and playlists to supplement your classroom learning."
              color="violet"
            />
            <FeatureCard
              icon={<Upload className="w-6 h-6" />}
              title="Student Contributions"
              description="Upload your own notes, books, PYQs, or lecture links. Every contribution helps the community."
              color="emerald"
            />
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Senior Connect"
              description="Find and connect with your seniors and alumni for mentorship and guidance."
              color="rose"
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Admin Moderation"
              description="All contributions are reviewed by admins before going live, ensuring quality and accuracy."
              color="indigo"
            />
          </div>
        </div>
      </section>

      {/* ── CTA Section ──────────────────────────── */}
      <section className="home-cta">
        <div className="home-cta-inner">
          <div className="home-cta-card">
            <GraduationCap className="w-12 h-12 text-white/90 mb-4" />
            <h2 className="home-cta-title">Ready to Get Started?</h2>
            <p className="home-cta-subtitle">
              Join your fellow NITians. Sign up with your college email, and start accessing resources instantly.
            </p>
            <Link to={user ? dashboardLink : "/login"} className="home-btn-cta">
              {user ? 'Go to Dashboard' : 'Create Your Account'} <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────── */}
      <footer className="home-footer">
        <div className="home-footer-inner">
          <div className="home-footer-brand">
            <div className="home-logo-icon-sm">
              <img src="https://upload.wikimedia.org/wikipedia/en/7/75/National_Institute_of_Technology%2C_Kurukshetra_Logo.png" alt="Logo" className="w-6 h-6 object-contain" />
            </div>
            <span className="font-semibold text-gray-700">NIT KKR Academic Portal</span>
          </div>
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} NIT Kurukshetra. Academic Resource Portal.</p>
        </div>
      </footer>
    </div>
  );
}

const FeatureCard = ({ icon, title, description, color }) => {
  const colorMap = {
    blue: 'home-feature-blue',
    amber: 'home-feature-amber',
    violet: 'home-feature-violet',
    emerald: 'home-feature-emerald',
    rose: 'home-feature-rose',
    indigo: 'home-feature-indigo',
  };
  return (
    <div className={`home-feature-card ${colorMap[color] || ''}`}>
      <div className="home-feature-icon">{icon}</div>
      <h3 className="home-feature-title">{title}</h3>
      <p className="home-feature-desc">{description}</p>
    </div>
  );
};
