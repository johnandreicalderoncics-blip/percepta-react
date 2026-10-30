import { useAuth } from '../../contexts/AuthContext';
import { useApiQuery } from '../../hooks/useApiQuery';
import { fetchLatestTrends, toFriendlyError } from '../../lib/api';
import './Trends.css';

const TrendSection = ({ title, description, trends }) => (
  <section className="trends-section">
    <h2 className="section-title">{title}</h2>
    <p className="section-description">{description}</p>
    {trends.length > 0 ? (
      <ol className="trends-list">
        {trends.map((trend) => (
          <li key={`${trend.id}-${trend.value}`} className="trend-item">
            <div className="trend-rank">{trend.id}</div>
            <div className="trend-content">
              <span className="trend-value">{trend.value}</span>
              <span className="trend-meta">
                {trend.status === 'New' ? 'New' : `Rising, TGR +${trend.tgr}%`}
              </span>
            </div>
          </li>
        ))}
      </ol>
    ) : (
      <p className="trends-empty">No {title.toLowerCase()} available</p>
    )}
  </section>
);

const Trends = () => {
  const { loading: authLoading } = useAuth();
  const {
    data: trendGroups,
    loading,
    error,
  } = useApiQuery(fetchLatestTrends);

  if (authLoading) {
    return <div className="page-loading">Loading...</div>;
  }

  return (
    <>
      <header className="page-header">
        <div>
          <h1 className="page-title">Trend Monitor</h1>
          <p className="page-subtitle">
            Currently ranked trends across music, hashtags, and keywords
          </p>
        </div>
      </header>

      {error && (
        <div className="status-banner">
          <span>{toFriendlyError(error)}</span>
        </div>
      )}

      {loading && (
        <div className="trends-loading">
          Loading trend data...
        </div>
      )}

      {!loading && !error && trendGroups && (
        <div className="trends-container">
          <TrendSection
            title="Music Trends"
            description="Currently trending audio tracks and sounds"
            trends={trendGroups.audio}
          />
          <TrendSection
            title="Hashtag Trends"
            description="Currently trending hashtags"
            trends={trendGroups.hashtag}
          />
          <TrendSection
            title="Keyword Trends"
            description="Currently trending caption keywords"
            trends={trendGroups.keyword}
          />
        </div>
      )}
    </>
  );
};

export default Trends;
