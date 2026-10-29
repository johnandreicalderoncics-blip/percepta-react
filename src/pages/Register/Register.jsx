import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    // Additional password policy checks
    if (!/.*[A-Z].*/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter');
      return;
    }

    if (!/.*[a-z].*/.test(formData.password)) {
      setError('Password must contain at least one lowercase letter');
      return;
    }

    if (!/.*\d.*/.test(formData.password)) {
      setError('Password must contain at least one number');
      return;
    }

    setLoading(true);

    try {
      const { error: authError } = await signUp(
        formData.email,
        formData.password,
        formData.fullName
      );

      if (authError) {
        setError(authError);
      } else {
        // Successfully registered, navigate to verify page
        navigate('/verify', { state: { email: formData.email } });
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo">
          <span className="logo-text">PERCE<span className="logo-accent">PTA</span></span>
        </div>

        <div className="auth-card">
          <h2 className="auth-title">Create your Account</h2>
          <p className="auth-subtitle">Start analyzing your content today</p>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Enter your Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Min. 8 letters, uppercase, 1 number"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="8"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Re-type your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/" className="auth-link">Sign in</Link>
          </p>
        </div>

        <div className="auth-info">
          <div className="info-content">
            <h3>Know where to post it before you go live.</h3>
            <p>Upload your short-form video draft. Percepta checks its audio, captions, hashtags, and text overlays against the top 10 emerging trends in each category on TikTok and Instagram Reels, then tells you where to post it and what to change.</p>

            <div className="info-stats">
              <div className="info-stat">
                <div className="info-text">
                  <div className="info-number">10</div>
                  <div className="info-label">Top trends per category</div>
                </div>
              </div>
              <div className="info-stat">
                <div className="info-text">
                  <div className="info-number">2</div>
                  <div className="info-label">Platforms covered</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
