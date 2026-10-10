import { Link } from 'react-router-dom';
import './Landing.css';

const steps = [
  { icon: '📤', title: 'Upload your video', text: 'Upload your short-form video draft (60 seconds or less, vertical format).' },
  { icon: '🤖', title: 'AI analysis', text: 'Our AI extracts speech, text overlays, and metadata, then compares them against daily trends.' },
  { icon: '📊', title: 'Get platform scores', text: 'Receive platform fit scores for TikTok and Instagram Reels.' },
  { icon: '✨', title: 'Act on the feedback', text: 'See specific recommendations to fix before you post.' },
];

const Landing = () => {
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

            <div className="hero-actions">
              <Link to="/register" className="btn-cta">Analyze my video</Link>
              <Link to="/login" className="btn-secondary">Log in</Link>
            </div>

            <div className="hero-tags">
              <span className="tag">🎯 AI-optimized</span>
              <span className="tag">📊 Pre-publish</span>
              <span className="tag">🎬 Platform scoring</span>
            </div>
          </div>

          <aside className="ticket" aria-label="Example Percepta result">
            <div className="ticket-head">
              <p className="ticket-title">Summer Vibes</p>
              <span className="ticket-badge">Sample result</span>
            </div>

            <div className="ticket-scores">
              <div className="ticket-score tiktok">
                <span className="ticket-num">82</span>
                <span className="ticket-platform">TikTok</span>
              </div>
              <div className="ticket-score reels">
                <span className="ticket-num">78</span>
                <span className="ticket-platform">Reels</span>
              </div>
            </div>

            <p className="ticket-verdict">Post on TikTok first.</p>

            <ul className="ticket-fixes">
              <li>Swap the audio for a sound that's rising this week</li>
              <li>Add two trending hashtags to the caption</li>
              <li>Move the text overlay out of the caption zone</li>
            </ul>
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
            {steps.map((step) => (
              <li className="feature-card" key={step.title}>
                <div className="feature-icon" aria-hidden="true">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
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
