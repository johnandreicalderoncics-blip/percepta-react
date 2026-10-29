import { useState } from 'react';
import { useAuth } from '../shared/contexts/AuthContext';
import './pages.css';

const DEFAULT_SETTINGS = {
  notifications: true,
  emailUpdates: true,
  language: 'en',
  autoSave: true
};

const SettingsPage = () => {
  const { user, signOut } = useAuth();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  // Get user name from metadata or email
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real app, you would save to database or user metadata
      setStatus('Settings saved.');
    } catch (err) {
      setStatus('Could not save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOutEverywhere = async () => {
    // In a real app, you would revoke all sessions
    setStatus('Signed out from all other devices.');
  };

  const handleDeleteAccount = async () => {
    try {
      // In a real app, you would delete the user account
      // For now, just sign out and redirect
      await signOut();
    } catch (err) {
      setStatus('Could not delete your account. Please try again.');
    } finally {
      setShowDeleteAccountModal(false);
    }
  };

  return (
    <>
      <header className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Customize your Percepta experience</p>
        </div>
      </header>

        {status && (
          <div className="status-banner success" role="status">
            <span>{status}</span>
            <button onClick={() => setStatus('')} className="btn-error-close" aria-label="Dismiss">×</button>
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
                <p className="setting-value mono">{user?.email}</p>
              </div>
              <div className="setting-item">
                <h3>Status</h3>
                <span className="status-indicator">Active</span>
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
                  onClick={handleSignOutEverywhere}
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
            setSettings(DEFAULT_SETTINGS);
          }} className="btn-secondary">
            Reset to Defaults
          </button>
        </div>

        {showDeleteAccountModal && (
          <div className="modal-backdrop" onClick={() => setShowDeleteAccountModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Delete Account</h3>
                <button onClick={() => setShowDeleteAccountModal(false)} className="btn-close" aria-label="Close">
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
    </>
  );
};

export default SettingsPage;
