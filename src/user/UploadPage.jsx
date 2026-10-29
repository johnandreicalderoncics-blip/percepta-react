import { useState } from 'react';
import { useAuth } from '../shared/contexts/AuthContext';
import Sidebar from '../shared/components/Sidebar';
import './pages.css';

const UploadPage = () => {
  const { user } = useAuth();
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

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="app-main">
        <header className="page-header">
          <div>
            <h1 className="page-title">Upload & Analyze Video</h1>
            <p className="page-subtitle">Get trend analysis for TikTok and Instagram Reels, {userName}</p>
          </div>
        </header>

        {error && (
          <div className="status-banner">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="btn-error-close" aria-label="Dismiss">×</button>
          </div>
        )}

        {loading && !analysisResult ? (
          <div className="upload-loading">
            <div className="loading-spinner"></div>
            <p>Analyzing your video...</p>
          </div>
        ) : analysisResult ? (
          <div className="results-container">
            <section className="results-header">
              <h2>Analysis Results for "{analysisResult.videoTitle}"</h2>
              <p className="results-date">Analyzed on {analysisResult.uploadDate}</p>
            </section>

            <div className="platform-scores">
              {analysisResult.analysis.map((platform) => (
                <div key={platform.platform} className="platform-score">
                  <div className="platform-info">
                    <span className="platform-name">{platform.platform}</span>
                  </div>
                  <div className="score-circle">
                    <div className="score-value">{platform.score}</div>
                  </div>
                  <div className="score-label">Platform Fit Score</div>
                  <div className="trend-indicator">
                    {platform.trend === 'rising' ? (
                      <span className="trend-up">Rising</span>
                    ) : (
                      <span className="trend-stable">Stable</span>
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
                  .map(p => p.platform)
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
        ) : uploadedVideo ? (
          <div className="upload-preview">
            <div className="upload-info">
              <h3>Selected File</h3>
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
        ) : (
          <label className="upload-area">
            <h3>Drag & drop your video here</h3>
            <p>or click to select a file</p>
            <input
              type="file"
              accept="video/*"
              className="file-input"
              onChange={handleFileUpload}
            />
            <p className="upload-hint">Supported formats: MP4, MOV, AVI, WEBM (Max 100MB)</p>
          </label>
        )}
      </main>
    </div>
  );
};

export default UploadPage;
