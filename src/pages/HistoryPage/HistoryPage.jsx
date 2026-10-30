import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApiQuery } from '../../hooks/useApiQuery';
import {
  deleteVideo,
  deleteUserVideos,
  fetchUserVideos,
  toFriendlyError,
} from '../../lib/api';
import '../../styles/pages.css';

const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const titleFromFilename = (filename) => filename.replace(/\.[^/.]+$/, '');

const HistoryPage = () => {
  const { user } = useAuth();
  const userId = user?.user_id;
  const [searchQuery, setSearchQuery] = useState('');
  const [actionError, setActionError] = useState(null);
  const [clearing, setClearing] = useState(false);

  const {
    data: videos,
    loading,
    error,
    refetch,
  } = useApiQuery(
    () => (userId ? fetchUserVideos() : Promise.resolve([])),
    [userId]
  );

  const history = (videos || []).map((video) => ({
    id: video.video_id,
    title: titleFromFilename(video.filename || 'Untitled video'),
    date: video.uploaded_at ? formatDate(video.uploaded_at) : '—',
    status: video.status || 'unknown',
    caption: video.caption || '',
  }));

  const handleDeleteHistory = async (id) => {
    setActionError(null);
    try {
      await deleteVideo(id);
      refetch();
    } catch (err) {
      setActionError(toFriendlyError(err));
    }
  };

  const handleClearAll = async () => {
    if (!userId) return;
    setActionError(null);
    setClearing(true);
    try {
      await deleteUserVideos();
      refetch();
    } catch (err) {
      setActionError(toFriendlyError(err));
    } finally {
      setClearing(false);
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
          <span>{toFriendlyError(error)}</span>
          <button onClick={() => refetch()} className="btn-error-close" aria-label="Retry">↻</button>
        </div>
      )}

      {actionError && (
        <div className="status-banner">
          <span>{actionError}</span>
          <button onClick={() => setActionError(null)} className="btn-error-close" aria-label="Dismiss">×</button>
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
            <button
              onClick={() => {
                if (window.confirm('Delete all history?')) {
                  handleClearAll();
                }
              }}
              className="btn-danger"
              disabled={clearing}
            >
              {clearing ? 'Clearing...' : 'Clear All'}
            </button>
          </div>

          <div className="history-entries">
            {filteredHistory.map(item => (
              <div key={item.id} className="history-entry">
                <div className="history-entry-content">
                  <div className="entry-thumbnail" aria-hidden="true">
                    <span>{item.title.charAt(0)}</span>
                  </div>
                  <div className="entry-details">
                    <h3 className="entry-title">{item.title}</h3>
                    <p className="entry-date mono">{item.date}</p>
                    <div className="entry-scores">
                      <span className="mini-score">{item.status}</span>
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
        !error && (
          <div className="history-empty">
            <h3>No history yet</h3>
            <p>Upload and analyze videos to see your history here.</p>
            <Link to="/upload" className="btn-primary">
              Upload First Video
            </Link>
          </div>
        )
      )}
    </>
  );
};

export default HistoryPage;
