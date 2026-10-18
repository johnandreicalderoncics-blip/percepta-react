import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [uploadedVideo, setUploadedVideo] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedVideo(file);
      console.log('Video uploaded:', file.name);
    }
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/login');
    }
  };

  // Get user name from metadata or email
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  // Check if user is admin (using same logic as AuthContext for consistency)
  const isAdmin = user?.app_metadata?.role === 'admin' ||
                 (user?.user_metadata?.role === 'admin' &&
                  process.env.NODE_ENV === 'development');

  // Mock data for demonstration
  const currentAnalysis = {
    videoTitle: 'Good morning, Juan!',
    uploadDate: 'Sep 29, 2026',
    tiktokScore: 75,
    instagramScore: 78,
    analysis: [
      { platform: 'TikTok', score: 75, trend: 'rising' },
      { platform: 'Instagram Reels', score: 78, trend: 'stable' }
    ]
  };

  const recentAnalyses = [
    { id: 1, title: 'Summer Vibes', date: 'Sep 28, 2026', tiktok: 82, instagram: 78 },
    { id: 2, title: 'Morning Routine', date: 'Sep 27, 2026', tiktok: 71, instagram: 85 },
    { id: 3, title: 'Recipe Tutorial', date: 'Sep 26, 2026', tiktok: 88, instagram: 76 }
  ];

  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-text">PERCE<span className="logo-accent">PTA</span></span>
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-item active">
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </Link>
          <Link to="/upload" className="nav-item">
            <span className="nav-icon">📤</span>
            <span>Upload</span>
          </Link>
          <Link to="/trends" className="nav-item">
            <span className="nav-icon">📈</span>
            <span>Trends</span>
          </Link>
          <Link to="/history" className="nav-item">
            <span className="nav-icon">🕐</span>
            <span>History</span>
          </Link>
          <Link to="/settings" className="nav-item">
            <span className="nav-icon">⚙️</span>
            <span>Settings</span>
          </Link>
          {isAdmin && (
            <Link to="/admin-overview" className="nav-item">
              <span className="nav-icon">👥</span>
              <span>Admin Overview</span>
            </Link>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {userName.substring(0, 2).toUpperCase()}
            </div>
            <div className="user-info">
              <div className="user-name">{userName}</div>
              <div className="user-email">{user?.email}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            🚪 Logout
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Good morning, {userName}!</h1>
            <p className="dashboard-subtitle">Here's what's happening with your content today</p>
          </div>
          <label className="btn-upload">
            📤 Upload New Video
            <input
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              hidden
            />
          </label>
        </header>

        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-label">Videos Analyzed</div>
            <div className="stat-value">12</div>
            <div className="stat-change positive">+3 this week</div>
          </div>

          <div className="stat-box">
            <div class="stat-label">Avg. TikTok Score</div>
            <div class="stat-value">75</div>
            <div class="stat-change neutral">Same as last week</div>
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
                    <span className="platform-icon">🎵</span>
                    <span className="platform-name">TikTok</span>
                  </div>
                  <div className="score-circle">
                    <div className="score-value">{currentAnalysis.tiktokScore}</div>
                  </div>
                  <div className="score-label">Platform Fit Score</div>
                </div>

                <div className="platform-score instagram">
                  <div className="platform-info">
                    <span className="platform-icon">📸</span>
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
            <div className="history-list">
              {recentAnalyses.map((item) => (
                <div key={item.id} className="history-item">
                  <div className="history-info">
                    <h4 className="history-title">{item.title}</h4>
                    <p className="history-date">{item.date}</p>
                  </div>
                  <div className="history-scores">
                    <span className="mini-score tiktok">{item.tiktok}</span>
                    <span className="mini-score instagram">{item.instagram}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-view-all">View All →</button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;