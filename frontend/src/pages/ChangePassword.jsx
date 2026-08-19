import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { changePassword as apiChangePassword } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/ui/Alert';
import { ButtonSpinner } from '../components/ui/Spinner';
import { parseRateLimitError } from '../utils/rateLimitUtils';
import { useRateLimitCountdown } from '../hooks/useRateLimitCountdown';
import toast from 'react-hot-toast';

export default function ChangePassword() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const changePasswordRateLimit = useRateLimitCountdown('changePassword');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    if (oldPassword === newPassword) {
      setError('New password must be different from your current password.');
      return;
    }

    setLoading(true);

    try {
      await apiChangePassword(oldPassword, newPassword);
      setSuccess(true);
      toast.success('Password changed successfully.');
      // Backend clears cookies on change-password, so we log the user out on the frontend as well
      setTimeout(async () => {
        await logout();
        navigate('/login');
      }, 3000);
    } catch (err) {
      const { isRateLimited, retryAfterSeconds } = parseRateLimitError(err);
      if (isRateLimited) {
        changePasswordRateLimit.triggerRateLimit(retryAfterSeconds);
        toast.error(`Please wait ${retryAfterSeconds} seconds before trying again.`);
      } else {
        const errorMsg =
          err.response?.data?.message || 'Failed to change password. Please try again.';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto mt-12 animate-fade-in">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-full mb-5 border border-emerald-100">
            <ShieldCheck className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Password Changed Successfully!</h2>
          <p className="text-sm text-gray-500 mb-1">
            Your password has been updated. You will be redirected to the login page shortly.
          </p>
          <p className="text-xs text-gray-400 mt-4">Redirecting in a few seconds…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-nit-primary hover:border-nit-primary/30 transition-all shadow-sm group shrink-0"
          aria-label="Go Back"
          title="Go Back"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-nit-primary group-hover:-translate-x-0.5 transition-all" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Change Password</h1>
          <p className="text-sm text-gray-500 mt-0.5">Update your account password securely.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-nit-primary via-blue-600 to-indigo-500" />

        <div className="p-6 sm:p-8">
          <Alert type="error" message={error} onDismiss={() => setError('')} />

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Current Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 ml-0.5">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showOld ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-nit-primary/20 focus:border-nit-primary outline-none transition"
                  value={oldPassword}
                  onChange={(e) => {
                    setOldPassword(e.target.value);
                    setError('');
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 ml-0.5">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showNew ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-nit-primary/20 focus:border-nit-primary outline-none transition"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError('');
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 ml-0.5">
                Must contain uppercase, lowercase, number, and special character (min 8 chars).
              </p>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 ml-0.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-nit-primary/20 focus:border-nit-primary outline-none transition"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    setError('Copy-pasting passwords is not allowed. Please type it manually.');
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={
                loading ||
                !oldPassword ||
                !newPassword ||
                !confirmPassword ||
                changePasswordRateLimit.isRateLimited
              }
              className="w-full bg-nit-primary text-white py-2.5 rounded-lg font-semibold hover:bg-blue-900 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:hover:bg-nit-primary shadow-sm mt-2"
            >
              {loading ? (
                <ButtonSpinner />
              ) : changePasswordRateLimit.isRateLimited ? (
                `Update Password (${changePasswordRateLimit.formattedCountdown})`
              ) : (
                'Update Password'
              )}
              {!loading && !changePasswordRateLimit.isRateLimited && (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
