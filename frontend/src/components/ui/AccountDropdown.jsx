import React, { useState, useRef, useEffect } from 'react';
import { LogOut, KeyRound, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function AccountDropdown() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const displayName = user?.email?.split('@')[0] || 'User';

  // Format role from backend (e.g. USER -> Student, ADMIN -> Administrator)
  const displayRole = user?.role === 'ADMIN' ? 'Administrator' : 'Student';

  // Handle clicking outside to close and 3-second auto-close
  useEffect(() => {
    let timeoutId;
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    if (isOpen) {
      timeoutId = setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    toast.success('Logged out successfully.');
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
        <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-200 py-2 z-50 animate-fade-in origin-top-right transform transition-all overflow-hidden">
          
          {/* Header (visible on mobile only) */}
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 sm:hidden mb-1">
            <p className="text-sm font-bold text-gray-800 truncate">{displayName}</p>
            <p className="text-[10px] font-bold text-nit-primary uppercase tracking-wider mt-0.5">{displayRole}</p>
          </div>

          {/* Change Password */}
          <div className="px-2 pt-1 pb-1">
            <button
              onClick={handleChangePassword}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 font-semibold bg-white border border-slate-100 shadow-sm hover:border-blue-200 hover:bg-blue-50 hover:text-nit-primary hover:shadow-md rounded-xl transition-all duration-200 text-left group"
            >
              <div className="p-1.5 rounded-lg bg-gray-50 group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-blue-100">
                <KeyRound className="w-4 h-4 text-gray-400 group-hover:text-nit-primary transition-colors" />
              </div>
              Change Password
            </button>
          </div>

          {/* Logout */}
          <div className="px-2 pb-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 font-semibold bg-white border border-slate-100 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600 hover:shadow-md rounded-xl transition-all duration-200 text-left group"
            >
              <div className="p-1.5 rounded-lg bg-gray-50 group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-red-100">
                <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
              </div>
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
