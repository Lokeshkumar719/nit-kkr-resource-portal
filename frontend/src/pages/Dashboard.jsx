import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Users, GraduationCap, UploadCloud, ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const dashboardOptions = [
  {
    title: "Study Materials",
    icon: BookOpen,
    desc: "Access notes, books, PYQs, and lecture links organized by branch and semester.",
    link: "/resources",
    gradient: "from-blue-500 to-indigo-600",
    shadow: "shadow-blue-500/20",
  },
  {
    title: "Senior Support",
    icon: Users,
    desc: "Connect with current 2nd, 3rd, and 4th year seniors from your branch.",
    link: "/seniors",
    gradient: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/20",
  },
  {
    title: "Alumni Network",
    icon: GraduationCap,
    desc: "Explore where NIT KKR graduates are now and reach out for guidance.",
    link: "/alumni",
    gradient: "from-amber-500 to-orange-600",
    shadow: "shadow-amber-500/20",
  },
  {
    title: "Report & Contribute",
    icon: UploadCloud,
    desc: "Help us improve by reporting bugs or contributing study resources.",
    link: "/contribute",
    gradient: "from-violet-500 to-purple-600",
    shadow: "shadow-violet-500/20",
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.email?.split('@')[0] || 'Student';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-nit-primary via-nit-primary-light to-blue-700 p-8 sm:p-10 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <button onClick={() => navigate('/')} className="flex items-center justify-center w-8 h-8 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all group" title="Go Back">
              <ArrowLeft className="w-4 h-4 text-white/70 group-hover:text-white group-hover:-translate-x-0.5 transition-all" />
            </button>
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span className="text-sm font-medium text-blue-200">Welcome back</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Hello, {displayName}
          </h1>
          <p className="text-blue-200/80 max-w-lg text-sm sm:text-base leading-relaxed">
            Your academic resource hub at NIT Kurukshetra. Browse materials, connect with seniors, and explore the alumni network.
          </p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute -right-4 -bottom-8 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute left-1/2 -bottom-16 w-64 h-64 rounded-full bg-white/[0.03]" />
      </div>

      {/* Quick access grid */}
      <div>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Access</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {dashboardOptions.map((opt, idx) => {
            const Icon = opt.icon;
            return (
              <Link
                key={idx}
                to={opt.link}
                className="group relative bg-white rounded-xl border border-slate-200/80 overflow-hidden hover:border-transparent hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${idx * 0.08}s` }}
                id={`dashboard-link-${opt.link.slice(1)}`}
              >
                {/* Top accent gradient */}
                <div className={`h-1 bg-gradient-to-r ${opt.gradient}`} />

                <div className="p-5">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${opt.gradient} flex items-center justify-center mb-4 shadow-lg ${opt.shadow} group-hover:scale-105 transition-transform duration-300`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800 mb-1.5 group-hover:text-nit-primary transition-colors">
                    {opt.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">
                    {opt.desc}
                  </p>
                  <div className="flex items-center text-sm font-semibold text-nit-accent group-hover:text-nit-primary transition-colors">
                    Explore
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}