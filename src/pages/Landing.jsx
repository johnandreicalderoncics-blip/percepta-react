import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
        setError(error.message);
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
      <section className="hero-section">
        <div className="hero-inner">
          <div className="hero-copy">
            <h1 className="hero-title">
              Know where to post it before you go live.
            </h1>

            <p className="hero-description">
              Upload your short-form video draft. Percepta evaluates its audio, captions, hashtags, and text overlays against today's top 30 trends on both TikTok and Instagram Reels, then tells you exactly where to post it and what to change.
            </p>

            <div className="hero-tags">
              <span className="tag">🎯 AI-optimized</span>
              <span className="tag">📊 Pre-publish</span>
              <span className="tag">🎬 Platform scoring</span>
            </div>
          </div>

          <aside className="login-ticket" aria-label="Login to Percepta">
            <div className="ticket-head">
              <p className="ticket-title">Welcome back</p>
              <span className="ticket-badge">Business login</span>
            </div>

            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
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

            <div className="auth-divider">
              <span>or</span>
            </div>
            
            <p className="auth-switch">
              Don't have an account? <Link to="/register" className="auth-link">Sign up</Link>
            </p>
          </aside>
        </div>

        <div className="hero-stats">
          <div className="stat-card">
            <div className="stat-number">30</div>
            <div className="stat-label">Daily trends analyzed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">&lt;30s</div>
            <div className="stat-label">Average analysis time</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" aria-hidden="true">🎵</div>
            <div className="stat-label">Metadata integration support</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" aria-hidden="true">📊</div>
            <div className="stat-label">Platform coverage (TikTok / IG)</div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-content">
          <h2 className="section-title">How Percepta works</h2>

          <ol className="features-grid">
            <li className="feature-card">
              <div className="feature-icon" aria-hidden="true">📤</div>
              <h3>Upload your video</h3>
              <p>Upload your short-form video draft (60 seconds or less, vertical format).</p>
            </li>
            <li className="feature-card">
              <div className="feature-icon" aria-hidden="true">🤖</div>
              <h3>AI analysis</h3>
              <p>Our AI extracts speech, text overlays, and metadata, then compares them against daily trends.</p>
            </li>
            <li className="feature-card">
              <div className="feature-icon" aria-hidden="true">📊</div>
              <h3>Get platform scores</h3>
              <p>Receive platform fit scores for TikTok and Instagram Reels.</p>
            </li>
            <li className="feature-card">
              <div className="feature-icon" aria-hidden="true">✨</div>
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
