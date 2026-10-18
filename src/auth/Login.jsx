import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        setError(error.message);
      } else {
        // Successfully logged in, redirect to dashboard
        navigate('/dashboard');
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
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Log in to analyze your content</p>
          
          {error && (
            <div style={{
              padding: '0.75rem',
              background: '#fee2e2',
              color: '#dc2626',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="auth-form">
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
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-footer">
              <Link to="/reset-password" className="forgot-link">Forgot Password?</Link>
            </div>
            
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
          
          <div className="auth-divider">
            <span>or</span>
          </div>
          
          <p className="auth-switch">
            Don't have an account? <Link to="/register" className="auth-link">Sign up</Link>
          </p>
        </div>
        
        <div className="auth-info">
          <div className="info-content">
            <h3>Know where to post it <span className="highlight">before</span> you go live.</h3>
            <p>Upload your short-form video draft. Percepta evaluates its audio, captions, hashtags, and text overlays against today's top 30 trends.</p>
            
            <div className="info-stats">
              <div className="info-stat">
                <div className="info-icon">🎵</div>
                <div className="info-text">
                  <div className="info-number">30</div>
                  <div className="info-label">trends per platform</div>
                </div>
              </div>
              <div className="info-stat">
                <div className="info-icon">📊</div>
                <div className="info-text">
                  <div className="info-number">2</div>
                  <div className="info-label">platforms (TikTok/IG)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
