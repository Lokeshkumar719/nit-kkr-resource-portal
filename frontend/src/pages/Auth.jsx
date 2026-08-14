import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, KeyRound, ArrowRight } from 'lucide-react';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/ui/Alert';
import { ButtonSpinner } from '../components/ui/Spinner';

export default function Auth() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState('auth'); // 'auth' | 'verify'
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: ''
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
        const res = await authApi.login({
          email: formData.email,
          password: formData.password
        });
        login(res.data.data);
        
        // Role-based redirect
        if (res.data.data.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        await authApi.register({
          email: formData.email,
          password: formData.password
        });
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
      const res = await authApi.verifyOtp({
        email: formData.email,
        otp: formData.otp
      });
      login(res.data.data);
      
      // Role-based redirect
      if (res.data.data.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please check the OTP.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ email: '', password: '', otp: '' });
  };

  return (
    <div className="auth-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-md mb-4 shadow-xl border border-white/20">
             <img src="https://upload.wikimedia.org/wikipedia/en/7/75/National_Institute_of_Technology%2C_Kurukshetra_Logo.png" alt="NIT KKR" className="w-10 h-10 object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">NIT KKR Resources</h1>
          <p className="text-blue-200/80 font-medium">Your academic resource hub</p>
        </div>

        <div className="glass-card p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {step === 'verify' ? 'Verify Email' : isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {step === 'verify' 
                ? 'Enter the 6-digit code sent to your email.' 
                : isLogin ? 'Sign in to access your dashboard.' : 'Sign up using your college email.'}
            </p>
          </div>

          <Alert type="error" message={error} onDismiss={() => setError('')} />
          <Alert type="success" message={success} onDismiss={() => setSuccess('')} />

          <div className="mt-6">
            {step === 'auth' ? (
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
                    {isLogin && <a href="#" className="text-xs font-semibold text-nit-accent hover:text-blue-700 transition">Forgot password?</a>}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      className="input-field"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
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
            ) : (
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
              </form>
            )}
          </div>

          {step === 'auth' && (
            <div className="mt-8 text-center border-t border-gray-100 pt-6">
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
