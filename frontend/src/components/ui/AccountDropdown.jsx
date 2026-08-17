import React, { useState, useRef, useEffect } from 'react';
import { LogOut, KeyRound, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export function AccountDropdown() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const displayName = user?.email?.split('@')[0] || 'User';

  // Format role from backend (e.g. USER -> Student, ADMIN -> Administrator)
  const displayRole = user?.role === 'ADMIN' ? 'Administrator' : 'Student';

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate('/login');
  };

  const handleChangePassword = () => {
    setIsOpen(false);
    navigate('/change-password');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full border border-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-white/30"
      >
        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-nit-primary uppercase">
            {displayName.charAt(0)}
          </span>
        </div>
        <div className="hidden sm:flex flex-col items-start leading-none max-w-[120px]">
          <span className="text-sm font-semibold text-white truncate w-full">{displayName}</span>
          <span className="text-[10px] text-blue-200 font-medium tracking-wide uppercase">
            {displayRole}
          </span>
        </div>
        <ChevronDown
          className={`hidden sm:block w-3.5 h-3.5 text-blue-200 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-fade-in origin-top-right transform transition-all">
          {/* Header (visible on mobile only) */}
          <div className="px-4 py-3 border-b border-slate-200 sm:hidden">
            <p className="text-sm font-bold text-gray-800 truncate">{displayName}</p>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-0.5">
              {displayRole}
            </p>
          </div>

          {/* Change Password */}
          <div className="px-1.5 pt-1.5">
            <button
              onClick={handleChangePassword}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 font-medium hover:bg-slate-50 rounded-lg transition-colors text-left group"
            >
              <KeyRound className="w-4 h-4 text-gray-400 group-hover:text-nit-primary" />
              Change Password
            </button>
          </div>

          {/* Divider */}
          <div className="mx-3 my-1 border-t border-slate-100" />

          {/* Logout */}
          <div className="px-1.5 pb-1.5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 font-semibold hover:bg-red-50 rounded-lg transition-colors text-left group"
            >
              <LogOut className="w-4 h-4 text-red-500 group-hover:text-red-600" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
