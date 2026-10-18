import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './SettingsPage.css';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    theme: 'dark',
    language: 'en',
    autoSave: true
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  // Get user name from metadata or email
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/login');
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      // In a real app, you would save to database or user metadata
      alert('Settings saved successfully!');
    } catch (err) {
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // In a real app, you would delete the user account
      // For now, just sign out and redirect
      await signOut();
      navigate('/login');
    } catch (err) {
      alert('Failed to delete account. Please try again.');
    } finally {
      setShowDeleteAccountModal(false);
    }
  };

  return (
    <div className="settings-page">
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
          <Link to="/history" className="nav-item">
            <span className="nav-icon">🕐</span>
            <span>History</span>
          </Link>
          <Link to="/settings" className="nav-item active">
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

      <main className="settings-main">
        <header className="settings-header">
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">Customize your Percepta experience</p>
        </header>

        {showDeleteAccountModal && (
          <div className="modal-backdrop" onClick={() => setShowDeleteAccountModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Delete Account</h3>
                <button onClick={() => setShowDeleteAccountModal(false)} className="btn-close">
                  ×
                </button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                <div className="modal-form-actions">
                  <button onClick={() => setShowDeleteAccountModal(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button onClick={handleDeleteAccount} className="btn-danger">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="settings-container">
          <section className="settings-section">
            <h2 className="section-title">Account</h2>
            <div className="settings-group">
              <div className="setting-item">
                <h3>Username</h3>
                <p className="setting-value">{userName}</p>
              </div>
              <div className="setting-item">
                <h3>Email</h3>
                <p className="setting-value">{user?.email}</p>
              </div>
              <div className="setting-item">
                <h3>Status</h3>
                <span className="status-indicator active">Active</span>
              </div>
            </div>
          </section>

          <section className="settings-section">
            <h2 className="section-title">Preferences</h2>
            <div className="settings-group">
              <div className="setting-item">
                <label className="setting-label">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => setSettings(prev => ({ ...prev, notifications: e.target.checked }))}
                  />
                  Enable notifications
                </label>
              </div>
              <div className="setting-item">
                <label className="setting-label">
                  <input
                    type="checkbox"
                    checked={settings.emailUpdates}
                    onChange={(e) => setSettings(prev => ({ ...prev, emailUpdates: e.target.checked }))}
                  />
                  Send email updates
                </label>
              </div>
              <div className="setting-item">
                <label className="setting-label">
                  Theme:
                  <select
                    value={settings.theme}
                    onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value }))}
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="auto">Auto</option>
                  </select>
                </label>
              </div>
              <div className="setting-item">
                <label className="setting-label">
                  Language:
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </label>
              </div>
            </div>
          </section>

          <section className="settings-section">
            <h2 className="section-title">Advanced</h2>
            <div className="settings-group">
              <div className="setting-item">
                <label className="setting-label">
                  <input
                    type="checkbox"
                    checked={settings.autoSave}
                    onChange={(e) => setSettings(prev => ({ ...prev, autoSave: e.target.checked }))}
                  />
                  Auto-save drafts
                </label>
              </div>
              <div className="setting-item">
                <label className="setting-label">
                  Data usage:
                  <select
                    value="standard"
                    disabled
                  >
                    <option value="standard">Standard</option>
                    <option value="low">Low</option>
                    <option value="high">High</option>
                  </select>
                </label>
              </div>
            </div>
          </section>

          <section className="settings-section">
            <h2 className="section-title">Danger Zone</h2>
            <div className="settings-group">
              <div className="setting-item">
                <button
                  onClick={() => setShowDeleteAccountModal(true)}
                  className="btn-danger btn-block"
                >
                  Delete Account
                </button>
              </div>
              <div className="setting-item">
                <button
                  onClick={() => {
                    // In a real app, you would log out from all devices
                    alert('Logged out from all devices');
                  }}
                  className="btn-secondary btn-block"
                >
                  Sign out from all devices
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="settings-actions">
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="btn-primary"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
          <button onClick={() => {
            // Reset to defaults
            setSettings({
              notifications: true,
              emailUpdates: true,
              theme: 'dark',
              language: 'en',
              autoSave: true
            });
          }} className="btn-secondary">
            Reset to Defaults
          </button>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;