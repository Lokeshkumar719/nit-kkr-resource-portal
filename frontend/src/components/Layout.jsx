import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  LogOut,
  UserCircle,
  BookOpen,
  Users,
  GraduationCap,
  UploadCloud,
  LayoutDashboard,
  Menu,
  X,
} from 'lucide-react';
import { AccountDropdown } from './ui/AccountDropdown.jsx';

export const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Resources', path: '/resources', icon: BookOpen },
    { name: 'Seniors', path: '/seniors', icon: Users },
    { name: 'Alumni', path: '/alumni', icon: GraduationCap },
    { name: 'Contribute', path: '/contribute', icon: UploadCloud },
  ];

  const adminLinks = [
    { name: 'Admin', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Student Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ];

  const links = user?.role === 'ADMIN' ? adminLinks : userLinks;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navbar */}
      <nav className="navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-3 group shrink-0"
              title="Go to Homepage"
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/7/75/National_Institute_of_Technology%2C_Kurukshetra_Logo.png"
                  alt="Logo"
                  className="w-7 h-7 object-contain"
                />
              </div>
              <span className="font-bold text-lg tracking-wide hidden sm:block">
                NIT KKR Resource Portal
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            {user && (
              <div className="hidden lg:flex items-center space-x-1 ml-8 mr-auto">
                {links.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`nav-link flex items-center gap-2 ${isActive ? 'active' : ''}`}
                    >
                      <Icon className="w-4 h-4" />
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Profile, Logout & Mobile Toggle */}
            <div className="flex items-center space-x-3 ml-auto lg:ml-0">
              {user && (
                <>
                  <AccountDropdown />
                  <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition"
                    aria-label="Toggle menu"
                  >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Nav Drawer */}
          {user && mobileOpen && (
            <div className="lg:hidden py-3 border-t border-white/10 animate-fade-in">
              <div className="flex flex-col gap-1">
                {links.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={`nav-link flex items-center gap-2.5 px-3 py-2.5 ${isActive ? 'active' : ''}`}
                    >
                      <Icon className="w-4 h-4" />
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 text-slate-500 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm font-medium">
          <p>&copy; {new Date().getFullYear()} NIT Kurukshetra. Academic Resource Portal.</p>
        </div>
      </footer>
    </div>
  );
};
