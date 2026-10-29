import { useState } from 'react';
import { useAuth } from '../shared/contexts/AuthContext';
import './pages.css';

const UploadPage = () => {
  const { user } = useAuth();
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState({
    caption: '',
    hashtags: '',
    keywords: '',
    audioTitle: ''
  });

  // Get user name from metadata or email
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!['mp4', 'mov'].includes(extension) || !['video/mp4', 'video/quicktime'].includes(file.type)) {
        setError('Please upload an MP4 or MOV video file.');
        return;
      }

      if (file.size > 100 * 1024 * 1024) {
        setError('Video files must be 100 MB or smaller.');
        return;
      }

      setUploadedVideo(file);
      setError(null);
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        if (video.duration > 60) {
          setUploadedVideo(null);
          setError('Video duration must be 60 seconds or less.');
          return;
        }
        simulateAnalysis(file);
      };
      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        setError('The selected video could not be read. Please try another file.');
        setUploadedVideo(null);
      };
      video.src = URL.createObjectURL(file);
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
          { platform: 'TikTok', score: Math.floor(Math.random() * 30) + 70, trend: Math.random() > 0.5 ? 'rising' : 'stable', breakdown: { audio: 82, hashtags: 76, keywords: 71 } },
          { platform: 'Instagram Reels', score: Math.floor(Math.random() * 30) + 70, trend: Math.random() > 0.5 ? 'rising' : 'stable', breakdown: { audio: 78, hashtags: 84, keywords: 73 } }
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
    <>
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

      <section className="metadata-card hardcard">
        <div className="metadata-card-heading">
          <div>
            <h2 className="section-title">Content metadata</h2>
            <p className="page-subtitle">Add the details you plan to publish with this video.</p>
          </div>
          <span className="mono metadata-required">OPTIONAL</span>
        </div>
        <div className="metadata-grid">
          <div className="form-group">
            <label htmlFor="planned-caption">Planned caption</label>
            <textarea
              id="planned-caption"
              value={metadata.caption}
              onChange={(e) => setMetadata(prev => ({ ...prev, caption: e.target.value }))}
              placeholder="Write the caption you plan to publish"
              rows="3"
            />
          </div>
          <div className="form-group">
            <label htmlFor="planned-hashtags">Hashtags</label>
            <input
              id="planned-hashtags"
              value={metadata.hashtags}
              onChange={(e) => setMetadata(prev => ({ ...prev, hashtags: e.target.value }))}
              placeholder="#creator #tutorial"
            />
          </div>
          <div className="form-group">
            <label htmlFor="planned-keywords">Keywords</label>
            <input
              id="planned-keywords"
              value={metadata.keywords}
              onChange={(e) => setMetadata(prev => ({ ...prev, keywords: e.target.value }))}
              placeholder="tutorial, behind the scenes"
            />
          </div>
          <div className="form-group">
            <label htmlFor="audio-title">Audio title</label>
            <input
              id="audio-title"
              value={metadata.audioTitle}
              onChange={(e) => setMetadata(prev => ({ ...prev, audioTitle: e.target.value }))}
              placeholder="Audio or sound title"
            />
          </div>
        </div>
      </section>

      {loading && !analysisResult ? (
        <div className="upload-loading">
          <div className="loading-spinner"></div>
          <p>Analyzing your video...</p>
        </div>
      ) : analysisResult ? (
        <div className="results-container">
          <section className="results-header">
            <h2>Analysis Results for "{analysisResult.videoTitle}"</h2>
            <p className="results-date mono">Analyzed on {analysisResult.uploadDate}</p>
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
                <dl className="score-breakdown">
                  <div><dt>Audio</dt><dd>{platform.breakdown.audio}</dd></div>
                  <div><dt>Hashtags</dt><dd>{platform.breakdown.hashtags}</dd></div>
                  <div><dt>Keywords</dt><dd>{platform.breakdown.keywords}</dd></div>
                </dl>
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
            <p className="mono">{Math.round(uploadedVideo.size / 1024 / 1024 * 10) / 10} MB</p>
            <p className="mono">{uploadedVideo.type}</p>
          </div>
          <div className="upload-actions">
            <button onClick={() => setUploadedVideo(null)} className="btn-secondary">
              Remove File
            </button>
            <button onClick={handleRetry} className="btn-primary btn-arrow" disabled={loading}>
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
    </>
  );
};

export default UploadPage;
