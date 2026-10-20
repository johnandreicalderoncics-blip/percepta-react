import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../shared/contexts/AuthContext';
import './Dashboard.css';

const UploadPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get user name from metadata or email
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        setError('Please upload a video file');
        return;
      }

      setUploadedVideo(file);
      setError(null);
      // In a real app, you would upload to storage and trigger analysis here
      // For now, we'll simulate analysis
      simulateAnalysis(file);
    }
  };

  const simulateAnalysis = async (file) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock analysis results
      const mockResults = {
        videoTitle: file.name.replace(/\.[^/.]+$/, ""),
        uploadDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        tiktokScore: Math.floor(Math.random() * 30) + 70, // 70-100
        instagramScore: Math.floor(Math.random() * 30) + 70, // 70-100
        analysis: [
          { platform: 'TikTok', score: Math.floor(Math.random() * 30) + 70, trend: Math.random() > 0.5 ? 'rising' : 'stable' },
          { platform: 'Instagram Reels', score: Math.floor(Math.random() * 30) + 70, trend: Math.random() > 0.5 ? 'rising' : 'stable' }
        ]
      };

      setAnalysisResult(mockResults);
    } catch (err) {
      setError('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (uploadedVideo) {
      simulateAnalysis(uploadedVideo);
    }
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/login');
    }
  };

  return (
    <div className="upload-page">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-text">PERCE<span className="logo-accent">PTA</span></span>
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-item">
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </Link>
          <Link to="/upload" className="nav-item active">
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

      <main className="upload-main">
        <header className="upload-header">
          <h1 className="upload-title">Upload & Analyze Video</h1>
          <p className="upload-subtitle">Upload your video to get trend analysis for TikTok and Instagram Reels</p>
        </header>

        {error && (
          <div className="upload-error">
            {error}
            <button onClick={() => setError(null)} className="btn-error-close">
              ×
            </button>
          </div>
        )}

        {!analysisResult && uploadedVideo ? (
          <div className="upload-preview">
            <div className="upload-info">
              <h3>Selected File:</h3>
              <p>{uploadedVideo.name}</p>
              <p>{Math.round(uploadedVideo.size / 1024 / 1024 * 10) / 10} MB</p>
              <p>{uploadedVideo.type}</p>
            </div>
            <div className="upload-actions">
              <button onClick={() => setUploadedVideo(null)} className="btn-secondary">
                Remove File
              </button>
              <button onClick={handleRetry} className="btn-primary" disabled={loading}>
                {loading ? 'Analyzing...' : 'Analyze Video'}
              </button>
            </div>
          </div>
        ) : null}

        {!analysisResult && !uploadedVideo ? (
          <div className="upload-area">
            <div className="upload-icon">📤</div>
            <h3>Drag & Drop Your Video Here</h3>
            <p>or click to select file</p>
            <input
              type="file"
              accept="video/*"
              className="file-input"
              onChange={handleFileUpload}
            />
            <p className="upload-hint">Supported formats: MP4, MOV, AVI, WEBM (Max 100MB)</p>
          </div>
        ) : null}

        {analysisResult && !loading ? (
          <div className="results-container">
            <section className="results-header">
              <h2>Analysis Results for "{analysisResult.videoTitle}"</h2>
              <p className="results-date">Analyzed on {analysisResult.uploadDate}</p>
            </section>

            <div className="platform-scores">
              {analysisResult.analysis.map((platform) => (
                <div key={platform.platform} className="platform-score">
                  <div className="platform-info">
                    <span className={`platform-icon ${platform.platform.toLowerCase().replace(' ', '')}`}>
                      {platform.platform === 'TikTok' ? '🎵' : '📸'}
                    </span>
                    <span className="platform-name">{platform.platform}</span>
                  </div>
                  <div className="score-circle">
                    <div className="score-value">{platform.score}</div>
                  </div>
                  <div className="score-label">Platform Fit Score</div>
                  <div className="trend-indicator">
                    {platform.trend === 'rising' ? (
                      <span className="trend-up">📈 rising</span>
                    ) : (
                      <span className="trend-stable">📊 stable</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="recommendations">
              <h3>Recommendations</h3>
              <p>
                Based on your analysis, consider {analysisResult.analysis
                  .filter(p => p.trend === 'rising')
                  .map(p => p.platform.toLowerCase())
                  .join(' and ') || 'both platforms'} for optimal reach.
              </p>
            </div>

            <div className="upload-actions">
              <button onClick={() => {
                setUploadedVideo(null);
                setAnalysisResult(null);
              }} className="btn-secondary">
                Upload Another Video
              </button>
              <button onClick={handleRetry} className="btn-primary">
                Re-analyze
              </button>
            </div>
          </div>
        ) : null}

        {loading && !analysisResult ? (
          <div className="upload-loading">
            <div className="loading-spinner"></div>
            <p>Analyzing your video...</p>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default UploadPage;