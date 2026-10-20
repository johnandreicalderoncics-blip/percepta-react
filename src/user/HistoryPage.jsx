import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../shared/contexts/AuthContext';

const HistoryPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user name from metadata or email
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  // Fetch history data (mock implementation)
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock history data
        const mockHistory = [
          {
            id: 1,
            title: 'Summer Vibes',
            date: 'Sep 28, 2026',
            tiktok: 82,
            instagram: 78,
            thumbnail: 'https://via.placeholder.com/120',
            duration: '0:15'
          },
          {
            id: 2,
            title: 'Morning Routine',
            date: 'Sep 27, 2026',
            tiktok: 71,
            instagram: 85,
            thumbnail: 'https://via.placeholder.com/120',
            duration: '0:30'
          },
          {
            id: 3,
            title: 'Recipe Tutorial',
            date: 'Sep 26, 2026',
            tiktok: 88,
            instagram: 76,
            thumbnail: 'https://via.placeholder.com/120',
            duration: '0:45'
          },
          {
            id: 4,
            title: 'Dance Challenge',
            date: 'Sep 25, 2026',
            tiktok: 91,
            instagram: 82,
            thumbnail: 'https://via.placeholder.com/120',
            duration: '0:20'
          },
          {
            id: 5,
            title: 'Travel Vlog',
            date: 'Sep 24, 2026',
            tiktok: 67,
            instagram: 75,
            thumbnail: 'https://via.placeholder.com/120',
            duration: '0:50'
          }
        ];

        setHistory(mockHistory);
        setError(null);
      } catch (err) {
        setError('Failed to load history. Please try again later.');
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/login');
    }
  };

  const handleDeleteHistory = async (id) => {
    try {
      // In a real app, you would delete from database
      setHistory(prev => prev.filter(item => item.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete item. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="history-page">
        <div className="history-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="history-page">
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
          <Link to="/trends" className="nav-item">
            <span className="nav-icon">📈</span>
            <span>Trends</span>
          </Link>
          <Link to="/history" className="nav-item active">
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

      <main className="history-main">
        <header className="history-header">
          <h1 className="history-title">Analysis History</h1>
          <p className="history-subtitle">Your past video analyses and performance data</p>
        </header>

        {error && (
          <div className="history-error">
            {error}
            <button onClick={() => setError(null)} className="btn-error-close">
              ×
            </button>
          </div>
        )}

        {history.length > 0 ? (
          <div className="history-container">
            <div className="history-filters">
              <div className="history-search">
                <input
                  type="text"
                  placeholder="Search history..."
                  className="search-input"
                />
              </div>
              <div className="history-actions">
                <button onClick={() => {
                  // In a real app, you would clear history
                  if (window.confirm('Delete all history?')) {
                    setHistory([]);
                  }
                }} className="btn-danger">
                  Clear All
                </button>
              </div>
            </div>

            <div className="history-list">
              {history.map(item => (
                <div key={item.id} className="history-item">
                  <div className="history-content">
                    <div className="history-thumbnail">
                      <img src={item.thumbnail} alt={item.title} />
                      <span className="duration-badge">{item.duration}</span>
                    </div>
                    <div className="history-details">
                      <h3 className="history-title">{item.title}</h3>
                      <p className="history-date">{item.date}</p>
                      <div className="history-scores">
                        <span className="score-item tiktok">
                          🎵 {item.tiktok}
                        </span>
                        <span className="score-item instagram">
                          📸 {item.instagram}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="history-actions-item">
                    <button
                      onClick={() => handleDeleteHistory(item.id)}
                      className="btn-delete-history"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="history-empty">
            <div className="history-empty-icon">📭</div>
            <h3>No history yet</h3>
            <p>Upload and analyze videos to see your history here.</p>
            <Link to="/upload" className="btn-primary">
              Upload First Video
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoryPage;