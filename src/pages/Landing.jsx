import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-tags">
            <span className="tag">🎯 AI-optimized</span>
            <span className="tag">📊 pre-publish</span>
            <span className="tag">🎬 platform scoring</span>
          </div>
          
          <h1 className="hero-title">
            Know where to post it<br />
            <span className="hero-highlight">before</span> you go live.
          </h1>
          
          <p className="hero-description">
            Upload your short-form video draft. Percepta evaluates its audio, captions, hashtags, and text overlays against today's top 30 trends on both TikTok and Instagram Reels — then tells you exactly where to post it and what to change.
          </p>
          
          <div className="hero-actions">
            <Link to="/register" className="btn-cta">Analyze my video</Link>
            <Link to="/login" className="btn-secondary">Log In</Link>
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
              <div className="stat-icon">🎵</div>
              <div className="stat-label">Metadata integration support</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-label">Platform coverage (TikTok/IG)</div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="features-section">
        <div className="features-content">
          <h2 className="section-title">How Percepta Works</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📤</div>
              <h3>Upload Your Video</h3>
              <p>Upload your short-form video draft (≤60 seconds, vertical format)</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI Analysis</h3>
              <p>Our AI extracts speech, text overlays, and metadata, then compares against daily trends</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Get Platform Scores</h3>
              <p>Receive platform fit scores for TikTok and Instagram Reels</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>Actionable Feedback</h3>
              <p>View detailed recommendations to optimize your content before posting</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
