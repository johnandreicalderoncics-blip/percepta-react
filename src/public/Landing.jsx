import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../shared/contexts/AuthContext';
import '../auth/Auth.css';
import './Landing.css';

const Landing = () => {
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
        setError(error);
      } else {
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
    <div className="landing-page">
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-logo">
            <span className="logo-text">PERCE<span className="logo-accent">PTA</span></span>
          </div>

          <div className="auth-card">
            <h2 className="auth-title">Welcome back</h2>
            <p className="auth-subtitle">Access your analytics dashboard</p>

            {error && (
              <div className="form-error">
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
                  placeholder="name@company.com"
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

            <p className="auth-switch">
              New to Percepta? <Link to="/register" className="auth-link">Create an account</Link>
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

      <section className="features-section">
        <div className="features-content">
          <h2 className="section-title">How Percepta works</h2>

          <ol className="features-grid">
            <li className="feature-card">
              <h3>Upload your video</h3>
              <p>Upload your short-form video draft (60 seconds or less, vertical format).</p>
            </li>
            <li className="feature-card">
              <h3>AI analysis</h3>
              <p>Our AI extracts speech, text overlays, and metadata, then compares them against daily trends.</p>
            </li>
            <li className="feature-card">
              <h3>Get platform scores</h3>
              <p>Receive platform fit scores for TikTok and Instagram Reels.</p>
            </li>
            <li className="feature-card">
              <h3>Act on the feedback</h3>
              <p>See specific recommendations to fix before you post.</p>
            </li>
          </ol>
        </div>
      </section>

      <section className="partner-band">
        <p>
          Percepta is made in partnership with <span className="partner-name">blingify</span>.
        </p>
      </section>
    </div>
  );
};

export default Landing;
