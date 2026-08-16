import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, KeyRound, ArrowRight, ArrowLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { login as apiLogin, register as apiRegister, verifyOTP as apiVerifyOTP, resendOTP as apiResendOTP, forgotPassword as apiForgotPassword, resetPassword as apiResetPassword } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/ui/Alert';
import { ButtonSpinner } from '../components/ui/Spinner';

export default function Auth() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  // 'auth' | 'verify' | 'forgot' | 'forgot-otp' | 'reset-success'
  const [step, setStep] = useState('auth');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: '',
    newPassword: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        const res = await apiLogin(formData.email, formData.password);
        login(res.data.data);
        
        if (res.data.data.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        await apiRegister(formData.email, formData.password);
        setSuccess('OTP sent to your email! Please verify.');
        setStep('verify');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await apiVerifyOTP(formData.email, formData.otp);
      if(res.data && res.data.data) {
          login(res.data.data);
          if (res.data.data.role === 'ADMIN') {
            navigate('/admin/dashboard');
          } else {
            navigate('/dashboard');
          }
      } else {
          setSuccess('Verified! You can now log in.');
          setStep('auth');
          setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please check the OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await apiResendOTP(formData.email);
      setSuccess('A new verification code has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot Password Flow ────────────────────────
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await apiForgotPassword(formData.email);
      setSuccess('A password reset OTP has been sent to your email.');
      setStep('forgot-otp');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await apiResetPassword(formData.email, formData.otp, formData.newPassword);
      setStep('reset-success');
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed. Please check your OTP and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendForgotOTP = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await apiForgotPassword(formData.email);
      setSuccess('A new password reset OTP has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setShowPassword(false);
    setShowNewPassword(false);
    setFormData({ email: '', password: '', otp: '', newPassword: '' });
  };

  const goBackToLogin = () => {
    setStep('auth');
    setIsLogin(true);
    setError('');
    setSuccess('');
    setShowPassword(false);
    setShowNewPassword(false);
    setFormData({ email: '', password: '', otp: '', newPassword: '' });
  };

  // ── Step Title & Subtitle ────────────────────────
  const getStepTitle = () => {
    switch (step) {
      case 'verify': return 'Verify Email';
      case 'forgot': return 'Forgot Password';
      case 'forgot-otp': return 'Reset Password';
      case 'reset-success': return 'Password Reset';
      default: return isLogin ? 'Welcome back' : 'Create account';
    }
  };

  const getStepSubtitle = () => {
    switch (step) {
      case 'verify': return 'Enter the 6-digit code sent to your email.';
      case 'forgot': return 'Enter your college email to receive a reset OTP.';
      case 'forgot-otp': return `Enter the OTP sent to ${formData.email} and set your new password.`;
      case 'reset-success': return '';
      default: return isLogin ? 'Sign in to access your dashboard.' : 'Sign up using your college email.';
    }
  };

  return (
    <div className="auth-bg flex items-center justify-center p-4 min-h-screen relative">
      {/* Top Left Back to Home Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md text-sm font-semibold border border-white/20 transition-all shadow-md group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      <div className="w-full max-w-md animate-slide-up pt-12 sm:pt-0">
        <Link to="/" className="block text-center mb-8 group" title="Go to Homepage">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-md mb-4 shadow-xl border border-white/20 group-hover:scale-105 transition-transform">
             <img src="https://upload.wikimedia.org/wikipedia/en/7/75/National_Institute_of_Technology%2C_Kurukshetra_Logo.png" alt="NIT KKR" className="w-10 h-10 object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight group-hover:text-blue-100 transition-colors">NIT KKR Resource Portal</h1>
          <p className="text-blue-200/80 font-medium">Your academic resource hub</p>
        </Link>

        <div className="glass-card p-8">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{getStepTitle()}</h2>
            {getStepSubtitle() && (
              <p className="text-sm text-gray-500 mt-1">{getStepSubtitle()}</p>
            )}
          </div>

          <Alert type="error" message={error} onDismiss={() => setError('')} />
          <Alert type="success" message={success} onDismiss={() => setSuccess('')} />

          <div className="mt-6">

            {/* ── AUTH STEP (Login / Register) ───────────── */}
            {step === 'auth' && (
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 ml-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      placeholder="rollno_branch22@nitkkr.ac.in"
                      className="input-field"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    {isLogin && (
                      <button
                        type="button"
                        onClick={() => {
                          setStep('forgot');
                          setError('');
                          setSuccess('');
                          setShowPassword(false);
                        }}
                        className="text-xs font-semibold text-nit-accent hover:text-blue-700 transition cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="••••••••"
                      className="input-field pr-10"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                      title={showPassword ? 'Hide Password' : 'Show Password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {!isLogin && (
                    <p className="text-xs text-gray-500 ml-1 mt-1">
                      Must contain uppercase, lowercase, number, and special character.
                    </p>
                  )}
                </div>

                <button type="submit" disabled={loading} className="btn-primary mt-2">
                  {loading ? <ButtonSpinner /> : (isLogin ? 'Sign In' : 'Create Account')}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            )}

            {/* ── VERIFY STEP (OTP after registration) ─── */}
            {step === 'verify' && (
              <form onSubmit={handleVerifySubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 ml-1">Verification Code</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="otp"
                      placeholder="000000"
                      className="input-field tracking-widest font-mono"
                      value={formData.otp}
                      onChange={handleChange}
                      maxLength={6}
                      required
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary mt-2">
                  {loading ? <ButtonSpinner /> : 'Verify & Continue'}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
                
                <div className="text-center pt-3">
                  <button 
                    type="button" 
                    onClick={handleResendOTP} 
                    disabled={loading}
                    className="text-sm font-semibold text-nit-primary hover:text-nit-accent transition-colors disabled:opacity-50"
                  >
                    Didn't receive the code? Resend
                  </button>
                </div>
              </form>
            )}

            {/* ── FORGOT PASSWORD STEP (Enter email) ─── */}
            {step === 'forgot' && (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      placeholder="rollno_branch22@nitkkr.ac.in"
                      className="input-field"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary mt-2">
                  {loading ? <ButtonSpinner /> : 'Send Reset OTP'}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>

                <div className="text-center pt-3">
                  <button
                    type="button"
                    onClick={goBackToLogin}
                    className="text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </form>
            )}

            {/* ── FORGOT OTP STEP (Enter OTP + New Password) ─── */}
            {step === 'forgot-otp' && (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 ml-1">Reset Code</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="otp"
                      placeholder="000000"
                      className="input-field tracking-widest font-mono"
                      value={formData.otp}
                      onChange={handleChange}
                      maxLength={6}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 ml-1">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      name="newPassword"
                      placeholder="••••••••"
                      className="input-field pr-10"
                      value={formData.newPassword}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                      title={showNewPassword ? 'Hide' : 'Show'}
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 ml-1 mt-1">
                    Must contain uppercase, lowercase, number, and special character (min 8 chars).
                  </p>
                </div>

                <button type="submit" disabled={loading} className="btn-primary mt-2">
                  {loading ? <ButtonSpinner /> : 'Reset Password'}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>

                <div className="text-center pt-3 space-y-2">
                  <button
                    type="button"
                    onClick={handleResendForgotOTP}
                    disabled={loading}
                    className="text-sm font-semibold text-nit-primary hover:text-nit-accent transition-colors disabled:opacity-50"
                  >
                    Didn't receive the code? Resend
                  </button>
                  <div>
                    <button
                      type="button"
                      onClick={goBackToLogin}
                      className="text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      ← Back to Sign In
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* ── RESET SUCCESS ───────────────────────── */}
            {step === 'reset-success' && (
              <div className="text-center py-6 animate-fade-in">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-full mb-5 border border-emerald-100">
                  <ShieldCheck className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Password Reset Successfully!</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Your password has been updated. Please sign in with your new password.
                </p>
                <button
                  onClick={goBackToLogin}
                  className="btn-primary inline-flex"
                >
                  Sign In Now <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Toggle between Login/Register */}
          {step === 'auth' && (
            <div className="mt-8 text-center border-t border-slate-200 pt-6">
              <p className="text-sm text-gray-500">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                <button
                  onClick={toggleMode}
                  className="font-semibold text-nit-primary hover:text-nit-accent transition-colors"
                >
                  {isLogin ? 'Create one' : 'Sign in'}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
