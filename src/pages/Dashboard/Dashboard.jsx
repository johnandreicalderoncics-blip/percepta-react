import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApiQuery } from '../../hooks/useApiQuery';
import { fetchDashboardData, toFriendlyError } from '../../lib/api';
import './Dashboard.css';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '—';

const titleFromFilename = (filename) => (filename || 'Untitled video').replace(/\.[^/.]+$/, '');

// Fixed when the module loads; good enough for a "+N this week" indicator.
const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

const Dashboard = () => {
  const { user } = useAuth();
  const userId = user?.user_id;

  const userName = user?.name || user?.email?.split('@')[0] || 'User';

  const { data, loading, error } = useApiQuery(
    () => (userId ? fetchDashboardData() : Promise.resolve(null)),
    [userId]
  );

  const videos = data?.videos || [];
  const recommendations = data?.recommendations || [];

  const thisWeekCount = useMemo(
    () =>
      videos.filter(
        (video) => video.uploaded_at && new Date(video.uploaded_at).getTime() > weekAgo
      ).length,
    [videos]
  );

  if (loading) {
    return <div className="page-loading">Loading...</div>;
  }

  const categoryCounts = {};
  for (const video of videos) {
    if (video.content_category) {
      categoryCounts[video.content_category] =
        (categoryCounts[video.content_category] || 0) + 1;
    }
  }
  const topCategory =
    Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

  const latestVideo = videos[0] || null;
  const latestRecommendation =
    recommendations.find((item) => item.video?.video_id === latestVideo?.video_id)
      ?.recommendation?.[0] || null;

  const recommendationCount = recommendations.filter(
    (item) => item.recommendation && item.recommendation.length > 0
  ).length;

  return (
    <>
      <header className="page-header">
        <div>
          <h1 className="page-title">{getGreeting()}, {userName}</h1>
          <p className="page-subtitle">Here's what's happening with your content today</p>
        </div>
        <Link to="/upload" className="btn-upload btn-arrow">Analyze a video</Link>
      </header>

      {error && (
        <div className="status-banner">
          <span>{toFriendlyError(error)}</span>
          <button onClick={() => window.location.reload()} className="btn-error-close" aria-label="Retry">↻</button>
        </div>
      )}

      <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-label">Videos Analyzed</div>
            <div className="stat-value">{videos.length}</div>
            <div className="stat-change positive">+{thisWeekCount} this week</div>
          </div>

          <div className="stat-box">
            <div className="stat-label">Recommendations</div>
            <div className="stat-value">{recommendationCount}</div>
            <div className="stat-change neutral">From database evaluations</div>
          </div>

          <div className="stat-box">
            <div className="stat-label">Top Category</div>
            <div className="stat-value">{topCategory}</div>
            <div className="stat-change">Most analyzed content category</div>
          </div>

          <div className="stat-box">
            <div className="stat-label">Latest Upload</div>
            <div className="stat-value">{latestVideo ? formatDate(latestVideo.uploaded_at) : '—'}</div>
            <div className="stat-change">{latestVideo ? latestVideo.status || 'status unknown' : 'No uploads yet'}</div>
          </div>
        </div>

        <div className="content-grid">
          <section className="latest-analysis">
            <h2 className="section-title">Latest Analysis</h2>
            <div className="analysis-card">
              <div className="analysis-header">
                <div>
                  <h3 className="analysis-title">
                    {latestVideo ? titleFromFilename(latestVideo.filename) : 'No analyses yet'}
                  </h3>
                  <p className="analysis-date">
                    {latestVideo ? `Analyzed on ${formatDate(latestVideo.uploaded_at)}` : 'Upload a video to get started'}
                  </p>
                </div>
                {latestVideo && <Link to="/history" className="btn-view">View Details</Link>}
              </div>

              {latestVideo ? (
                <div className="analysis-summary">
                  <p><strong>Status:</strong> {latestVideo.status || 'unknown'}</p>
                  {latestVideo.content_category && (
                    <p><strong>Category:</strong> {latestVideo.content_category}</p>
                  )}
                  {latestVideo.caption && <p><strong>Caption:</strong> {latestVideo.caption}</p>}
                  {latestRecommendation && (
                    <div className="analysis-recommendation">
                      {latestRecommendation.suggested_title && (
                        <p><strong>Suggested title:</strong> {latestRecommendation.suggested_title}</p>
                      )}
                      {latestRecommendation.feedback_text && (
                        <p><strong>Feedback:</strong> {latestRecommendation.feedback_text}</p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/upload" className="btn-primary">Upload First Video</Link>
              )}
            </div>
          </section>

          <section className="recent-history">
            <h2 className="section-title">Recent Analyses</h2>
            <div className="recent-list">
              {videos.slice(0, 3).map((video) => (
                <div key={video.video_id} className="recent-item">
                  <div className="recent-info">
                    <h4 className="recent-title">{titleFromFilename(video.filename)}</h4>
                    <p className="recent-date mono">{formatDate(video.uploaded_at)}</p>
                  </div>
                  <div className="recent-scores">
                    <span className="mini-score">{video.status || 'unknown'}</span>
                  </div>
                </div>
              ))}
              {videos.length === 0 && !error && (
                <p className="trends-empty">No analyses yet</p>
              )}
            </div>
            <Link to="/history" className="btn-view-all">View all analyses</Link>
          </section>
        </div>
    </>
  );
};

export default Dashboard;
