import { useState } from 'react';

import { register } from '../services/api';

function Register({ setActiveTab }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      await register(formData.email, formData.password);

      setMessage({
        type: 'success',
        text: 'OTP sent successfully. Please verify your email to continue.',
      });

      setActiveTab('verify');
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Registration failed.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleRegister}>
      <div className="form-header">
        <h2>Create account</h2>
        <p>Use your official @nitkkr.ac.in email to register.</p>
      </div>

      <div className="input-group">
        <label htmlFor="register-email">Email address</label>
        <input
          id="register-email"
          className="auth-input"
          name="email"
          type="email"
          placeholder="yourname@nitkkr.ac.in"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="input-group">
        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          className="auth-input"
          name="password"
          type="password"
          placeholder="Create a strong password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      {message.text && <div className={`auth-message ${message.type}`}>{message.text}</div>}

      <button className="primary-button" type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>

      <div className="form-helper">
        <span>Already have an account?</span>
        <button type="button" className="form-link" onClick={() => setActiveTab('login')}>
          Sign in
        </button>
      </div>
    </form>
  );
}

export default Register;
