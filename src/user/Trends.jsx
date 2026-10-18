import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/contexts/AuthContext';
import '../pages/Trends.css';

const Trends = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // Mock data for trend lists based on CHP 1-3.txt description
  // In a real implementation, this would be fetched from Supabase or an API
  const [musicTrends, setMusicTrends] = useState([]);
  const [hashtagTrends, setHashtagTrends] = useState([]);
  const [keywordTrends, setKeywordTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user name from metadata or email
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  // Fetch trend data (mock implementation)
  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock music/audio trends (Audio/Sound Identifier)
        const mockMusicTrends = [
          { id: 1, value: "Summer Vibes", tgr: 45.2, status: "Growing" },
          { id: 2, value: "Dance Beat", tgr: 38.7, status: "Growing" },
          { id: 3, value: "Chill Hop", tgr: 32.1, status: "New" },
          { id: 4, value: "Pop Anthem", tgr: 28.9, status: "Growing" },
          { id: 5, value: "Electronic Mix", tgr: 25.3, status: "New" },
          { id: 6, value: "Hip Hop Rhythm", tgr: 22.8, status: "Growing" },
          { id: 7, value: "Acoustic Guitar", tgr: 19.5, status: "New" },
          { id: 8, value: "Tropical House", tgr: 16.2, status: "Growing" },
          { id: 9, value: "Lo-Fi Beats", tgr: 13.8, status: "New" },
          { id: 10, value: "Trumpet Sound", tgr: 11.4, status: "Growing" }
        ];

        // Mock hashtag trends
        const mockHashtagTrends = [
          { id: 1, value: "#SummerFun", tgr: 52.3, status: "Growing" },
          { id: 2, value: "#DanceChallenge", tgr: 48.7, status: "Growing" },
          { id: 3, value: "#TravelDiary", tgr: 41.2, status: "New" },
          { id: 4, value: "#FoodieLife", tgr: 37.9, status: "Growing" },
          { id: 5, value: "#OOTD", tgr: 34.5, status: "New" },
          { id: 6, value: "#FitnessMotivation", tgr: 31.2, status: "Growing" },
          { id: 7, value: "#StudySession", tgr: 28.9, status: "New" },
          { id: 8, value: "#PetLife", tgr: 25.6, status: "Growing" },
          { id: 9, value: "#SunsetLovers", tgr: 22.3, status: "New" },
          { id: 10, value: "#MorningRoutine", tgr: 19.8, status: "Growing" }
        ];

        // Mock keyword trends (Caption Keywords)
        const mockKeywordTrends = [
          { id: 1, value: "authentic", tgr: 48.9, status: "Growing" },
          { id: 2, value: "behind the scenes", tgr: 42.3, status: "New" },
          { id: 3, value: "quick tip", tgr: 38.7, status: "Growing" },
          { id: 4, value: "satisfying", tgr: 35.2, status: "New" },
          { id: 5, value: "transformation", tgr: 31.8, status: "Growing" },
          { id: 6, value: "tutorial", tgr: 28.4, status: "New" },
          { id: 7, value: "hack", tgr: 25.9, status: "Growing" },
          { id: 8, value: "review", tgr: 22.5, status: "New" },
          { id: 9, value: "unboxing", tgr: 19.2, status: "Growing" },
          { id: 10, value: "travel", tgr: 16.7, status: "New" }
        ];

        setMusicTrends(mockMusicTrends);
        setHashtagTrends(mockHashtagTrends);
        setKeywordTrends(mockKeywordTrends);
        setLoading(false);
      } catch (err) {
        setError('Failed to load trend data. Please try again later.');
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchTrendData();
    }
  }, [authLoading]);

  if (authLoading) {
    return (
      <div className="trends-page">
        <div className="trends-loading">Loading...</div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        navigate('/login');
      }
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  return (
    <div className="trends-page">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-text">PERCE<span className="logo-accent">PTA</span></span>
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-item">
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </Link>
          <Link to="/upload" className="nav-item">
            <span className="nav-icon">📤</span>
            <span>Upload</span>
          </Link>
          <Link to="/trends" className="nav-item active">
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

      <main className="trends-main">
        <header className="trends-header">
          <h1 className="trends-title">Trend Monitor</h1>
          <p className="trends-subtitle">View currently ranked trends across Music, Hashtags, and Keywords</p>
        </header>

        {error && (
          <div className="trends-error">
            {error}
          </div>
        )}

        {!loading && (
          <div className="trends-container">
            {/* Music Trends Section */}
            <section className="trends-section">
              <h2 className="section-title">Music Trends</h2>
              <p className="section-description">Currently trending audio tracks and sounds</p>
              {musicTrends.length > 0 ? (
                <ol className="trends-list">
                  {musicTrends.map((trend) => (
                    <li key={trend.id} className="trend-item">
                      <div className="trend-rank">{trend.id}</div>
                      <div className="trend-content">
                        <span className="trend-value">{trend.value}</span>
                        <span className="trend-meta">
                          {trend.status === 'New' ? 'New' : `rising, TGR +${trend.tgr}%`}
                        </span>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="trends-empty">No music trends available</p>
              )}
            </section>

            {/* Hashtag Trends Section */}
            <section className="trends-section">
              <h2 className="section-title">Hashtag Trends</h2>
              <p className="section-description">Currently trending hashtags</p>
              {hashtagTrends.length > 0 ? (
                <ol className="trends-list">
                  {hashtagTrends.map((trend) => (
                    <li key={trend.id} className="trend-item">
                      <div className="trend-rank">{trend.id}</div>
                      <div className="trend-content">
                        <span className="trend-value">{trend.value}</span>
                        <span className="trend-meta">
                          {trend.status === 'New' ? 'New' : `rising, TGR +${trend.tgr}%`}
                        </span>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="trends-empty">No hashtag trends available</p>
              )}
            </section>

            {/* Keyword Trends Section */}
            <section className="trends-section">
              <h2 className="section-title">Keyword Trends</h2>
              <p className="section-description">Currently trending caption keywords</p>
              {keywordTrends.length > 0 ? (
                <ol className="trends-list">
                  {keywordTrends.map((trend) => (
                    <li key={trend.id} className="trend-item">
                      <div className="trend-rank">{trend.id}</div>
                      <div className="trend-content">
                        <span className="trend-value">{trend.value}</span>
                        <span className="trend-meta">
                          {trend.status === 'New' ? 'New' : `rising, TGR +${trend.tgr}%`}
                        </span>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="trends-empty">No keyword trends available</p>
              )}
            </section>
          </div>
        )}

        {loading && (
          <div className="trends-loading">
            Loading trend data...
          </div>
        )}
      </main>
    </div>
  );
};

export default Trends;