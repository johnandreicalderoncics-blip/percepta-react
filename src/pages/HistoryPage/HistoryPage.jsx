import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './pages.css';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch history data (mock implementation)
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock history data
        const mockHistory = [
          { id: 1, title: 'Summer Vibes', date: 'Sep 28, 2026', tiktok: 82, instagram: 78, duration: '0:15' },
          { id: 2, title: 'Morning Routine', date: 'Sep 27, 2026', tiktok: 71, instagram: 85, duration: '0:30' },
          { id: 3, title: 'Recipe Tutorial', date: 'Sep 26, 2026', tiktok: 88, instagram: 76, duration: '0:45' },
          { id: 4, title: 'Dance Challenge', date: 'Sep 25, 2026', tiktok: 91, instagram: 82, duration: '0:20' },
          { id: 5, title: 'Travel Vlog', date: 'Sep 24, 2026', tiktok: 67, instagram: 75, duration: '0:50' }
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

  const handleDeleteHistory = async (id) => {
    try {
      // In a real app, you would delete from database
      setHistory(prev => prev.filter(item => item.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete item. Please try again.');
    }
  };

  const filteredHistory = history.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="page-loading">Loading...</div>;
  }

  return (
    <>
      <header className="page-header">
        <div>
          <h1 className="page-title">Analysis History</h1>
          <p className="page-subtitle">Your past video analyses and performance data</p>
        </div>
      </header>

      {error && (
        <div className="status-banner">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="btn-error-close" aria-label="Dismiss">×</button>
        </div>
      )}

      {history.length > 0 ? (
        <div className="history-container">
          <div className="history-filters">
            <input
              type="text"
              placeholder="Search history..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={() => {
              // In a real app, you would clear history
              if (window.confirm('Delete all history?')) {
                setHistory([]);
              }
            }} className="btn-danger">
              Clear All
            </button>
          </div>

          <div className="history-entries">
            {filteredHistory.map(item => (
              <div key={item.id} className="history-entry">
                <div className="history-entry-content">
                  <div className="entry-thumbnail" aria-hidden="true">
                    <span>{item.title.charAt(0)}</span>
                    <span className="duration-badge mono">{item.duration}</span>
                  </div>
                  <div className="entry-details">
                    <h3 className="entry-title">{item.title}</h3>
                    <p className="entry-date mono">{item.date}</p>
                    <div className="entry-scores">
                      <span className="mini-score tiktok">TikTok {item.tiktok}</span>
                      <span className="mini-score instagram">IG {item.instagram}</span>
                    </div>
                  </div>
                </div>
                <div className="history-entry-actions">
                  <button
                    onClick={() => handleDeleteHistory(item.id)}
                    className="btn-delete-history"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {filteredHistory.length === 0 && (
              <p className="trends-empty">No analyses match "{searchQuery}"</p>
            )}
          </div>
        </div>
      ) : (
        <div className="history-empty">
          <h3>No history yet</h3>
          <p>Upload and analyze videos to see your history here.</p>
          <Link to="/upload" className="btn-primary">
            Upload First Video
          </Link>
        </div>
      )}
    </>
  );
};

export default HistoryPage;
