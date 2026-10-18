import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../shared/contexts/AuthContext';
import '../pages/Verify.css';

const Verify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp } = useAuth();
  const email = location.state?.email || '';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const { error } = await verifyOtp(email, otpCode);
      
      if (error) {
        setError(error.message);
      } else {
        // Successfully verified, navigate to dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-page">
      <div className="verify-container">
        <div className="verify-logo">
          <span className="logo-text">PERCE<span className="logo-accent">PTA</span></span>
        </div>
        
        <div className="verify-card">
          <h2 className="verify-title">Verify your Email</h2>
          <p className="verify-subtitle">
            Enter the 6-digit code we sent to {email || 'your registered email'}
          </p>
          
          {error && (
            <div style={{
              padding: '0.75rem',
              background: '#fee2e2',
              color: '#dc2626',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="verify-form">
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="otp-input"
                  required
                />
              ))}
            </div>
            
            <button type="submit" className="btn-verify" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </form>
          
          <p className="resend-text">
            Didn't receive the code? <button className="resend-btn">Resend code</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Verify;
