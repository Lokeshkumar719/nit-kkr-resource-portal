import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { login } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

import '../styles/auth.css';

function Login() {
  const { checkAuth } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      await login(email, password);
      toast.success("Logged in successfully!");
      await checkAuth();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleLogin}>
      <div className="form-header">
        <h2>Welcome back</h2>
        <p>Sign in with your NIT KKR email and password.</p>
      </div>

      <div className="input-group">
        <label htmlFor="login-email">Email address</label>
        <input
          id="login-email"
          className="auth-input"
          type="email"
          placeholder="yourname@nitkkr.ac.in"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="input-group">
        <label htmlFor="login-password">Password</label>
        <div style={{ position: 'relative' }}>
          <input
            id="login-password"
            className="auth-input"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ paddingRight: '2.5rem' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
            }}
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button className="primary-button" type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

export default Login;
