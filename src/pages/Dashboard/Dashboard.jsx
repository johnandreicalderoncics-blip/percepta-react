import { Link } from 'react-router-dom';
import { useAuth } from '../shared/contexts/AuthContext';
import './Dashboard.css';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const Dashboard = () => {
  const { user } = useAuth();

  // Get user name from metadata or email
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  // Mock data for demonstration
  const currentAnalysis = {
    videoTitle: 'Good morning, Juan!',
    uploadDate: 'Sep 29, 2026',
    tiktokScore: 75,
    instagramScore: 78
  };

  const recentAnalyses = [
    { id: 1, title: 'Summer Vibes', date: 'Sep 28, 2026', tiktok: 82, instagram: 78 },
    { id: 2, title: 'Morning Routine', date: 'Sep 27, 2026', tiktok: 71, instagram: 85 },
    { id: 3, title: 'Recipe Tutorial', date: 'Sep 26, 2026', tiktok: 88, instagram: 76 }
  ];

  return (
    <>
      <header className="page-header">
        <div>
          <h1 className="page-title">{getGreeting()}, {userName}</h1>
          <p className="page-subtitle">Here's what's happening with your content today</p>
        </div>
        <Link to="/upload" className="btn-upload btn-arrow">Analyze a video</Link>
      </header>

      <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-label">Videos Analyzed</div>
            <div className="stat-value">12</div>
            <div className="stat-change positive">+3 this week</div>
          </div>

          <div className="stat-box">
            <div className="stat-label">Avg. TikTok Score</div>
            <div className="stat-value">75</div>
            <div className="stat-change neutral">Same as last week</div>
          </div>

          <div className="stat-box">
            <div className="stat-label">Avg. IG Reels Score</div>
            <div className="stat-value">81</div>
            <div className="stat-change positive">+5 from last week</div>
          </div>

          <div className="stat-box">
            <div className="stat-label">Top Performing</div>
            <div className="stat-value">Recipe</div>
            <div className="stat-change">88 on TikTok</div>
          </div>
        </div>

        <div className="content-grid">
          <section className="latest-analysis">
            <h2 className="section-title">Latest Analysis</h2>
            <div className="analysis-card">
              <div className="analysis-header">
                <div>
                  <h3 className="analysis-title">{currentAnalysis.videoTitle}</h3>
                  <p className="analysis-date">Analyzed on {currentAnalysis.uploadDate}</p>
                </div>
                <button className="btn-view">View Details</button>
              </div>

              <div className="platform-scores">
                <div className="platform-score tiktok">
                  <div className="platform-info">
                    <span className="platform-name">TikTok</span>
                  </div>
                  <div className="score-circle">
                    <div className="score-value">{currentAnalysis.tiktokScore}</div>
                  </div>
                  <div className="score-label">Platform Fit Score</div>
                </div>

                <div className="platform-score instagram">
                  <div className="platform-info">
                    <span className="platform-name">Instagram Reels</span>
                  </div>
                  <div className="score-circle">
                    <div className="score-value">{currentAnalysis.instagramScore}</div>
                  </div>
                  <div className="score-label">Platform Fit Score</div>
                </div>
              </div>
            </div>
          </section>

          <section className="recent-history">
            <h2 className="section-title">Recent Analyses</h2>
            <div className="recent-list">
              {recentAnalyses.map((item) => (
                <div key={item.id} className="recent-item">
                  <div className="recent-info">
                    <h4 className="recent-title">{item.title}</h4>
                    <p className="recent-date mono">{item.date}</p>
                  </div>
                  <div className="recent-scores">
                    <span className="mini-score tiktok">{item.tiktok}</span>
                    <span className="mini-score instagram">{item.instagram}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/history" className="btn-view-all">View all analyses</Link>
          </section>
        </div>
    </>
  );
};

export default Dashboard;
