import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './ResetPassword.css';

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        setError(error.message);
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">
      <div className="reset-container">
        <div className="reset-logo">
          <span className="logo-text">PERCE<span className="logo-accent">PTA</span></span>
        </div>
        
        <div className="reset-card">
          {!submitted ? (
            <>
              <h2 className="reset-title">Find your account</h2>
              <p className="reset-subtitle">
                Enter your registered email to reset your password
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
              
              <form onSubmit={handleSubmit} className="reset-form">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <button type="submit" className="btn-reset" disabled={loading}>
                  {loading ? 'Sending...' : 'Send reset code'}
                </button>
              </form>
              
              <p className="back-link">
                Remembered your password? <Link to="/login" className="link">Back to login</Link>
              </p>
            </>
          ) : (
            <>
              <div className="success-icon">✓</div>
              <h2 className="reset-title">Check your email</h2>
              <p className="reset-subtitle">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              
              <Link to="/login" className="btn-reset">Back to Login</Link>
              
              <p className="resend-text">
                Didn't receive the email? <button className="resend-btn">Resend</button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
