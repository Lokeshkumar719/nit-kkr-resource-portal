import { useState } from 'react';

import { verifyOTP, resendOTP } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function VerifyOTP({ setActiveTab }) {
  const { checkAuth } = useAuth();

  const [email, setEmail] = useState('');

  const [otp, setOtp] = useState('');

  const [loading, setLoading] = useState(false);

  const [resendLoading, setResendLoading] = useState(false);

  const handleVerify = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      await verifyOTP(email, otp);
      toast.success("Email verified successfully.");
      await checkAuth();
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      toast.error("Enter your email first to resend the OTP.");
      return;
    }

    try {
      setResendLoading(true);

      await resendOTP(email);

      toast.success("A new OTP has been sent to your email.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to resend OTP.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleVerify}>
      <div className="form-header">
        <h2>Verify your email</h2>
        <p>Enter the 6-digit code sent to your NIT KKR mailbox.</p>
      </div>

      <div className="input-group">
        <label htmlFor="verify-email">Email address</label>
        <input
          id="verify-email"
          className="auth-input"
          type="email"
          placeholder="yourname@nitkkr.ac.in"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="input-group">
        <label htmlFor="verify-otp">OTP</label>
        <input
          id="verify-otp"
          className="auth-input"
          type="text"
          inputMode="numeric"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          maxLength={6}
          required
        />
      </div>

      <button className="primary-button" type="submit" disabled={loading}>
        {loading ? 'Verifying...' : 'Verify OTP'}
      </button>

      <div className="form-helper">
        <span>Need a fresh code?</span>
        <button
          type="button"
          className="form-link"
          onClick={handleResendOTP}
          disabled={resendLoading}
        >
          {resendLoading ? 'Sending...' : 'Resend OTP'}
        </button>
      </div>

      <div className="form-helper">
        <span>Already verified?</span>
        <button type="button" className="form-link" onClick={() => setActiveTab('login')}>
          Login now
        </button>
      </div>
    </form>
  );
}

export default VerifyOTP;
