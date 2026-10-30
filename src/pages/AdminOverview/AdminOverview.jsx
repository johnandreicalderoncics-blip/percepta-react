import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../../components/Sidebar';
import '../../styles/pages.css';
import './AdminOverview.css';

const AdminOverview = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editUserData, setEditUserData] = useState(null);
  const [systemStats, setSystemStats] = useState({
    activeAccounts: 0,
    datasetSize: '0 MB',
    partnerOptIn: false,
    trendApiStatus: 'unknown'
  });
  const [trendRefreshState, setTrendRefreshState] = useState('idle');

  // Get user name from account or email
  const userName = user?.name || user?.email?.split('@')[0] || 'User';

  // User management goes through the backend's admin endpoints, authorized
  // by the session cookie (the backend rejects non-admins with 403).
  const adminRequest = async (method = 'GET', path = '/users', body) => {
    const response = await fetch(`/api/admin${path}`, {
      method,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {})
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || 'The admin user service is unavailable.');
    }
    return data;
  };

  const selfFallback = () => ({
    id: user?.user_id,
    email: user?.email,
    full_name: user?.name || '',
    role: user?.role || 'admin',
    status: user?.status || 'active',
    created_at: user?.consent_at || 'Unknown'
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminRequest();
      const accounts = data.users || [];

      const formattedUsers = accounts.map(account => ({
        id: account.user_id,
        email: account.email,
        full_name: account.name || '',
        role: account.role || 'user',
        status: account.status || 'unknown',
        created_at: account.consent_at || 'Unknown'
      }));

      setUsers(formattedUsers.length > 0 ? formattedUsers : [selfFallback()]);
      setError(null);
    } catch (err) {
      setUsers(user ? [selfFallback()] : []);
      setError(`${err.message} Showing the signed-in administrator only.`);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch system stats (placeholder implementation)
  const fetchSystemStats = async () => {
    try {
      // In a real implementation, you would make actual API calls to get these stats
      // For now, we'll use placeholder/mock data
      setSystemStats({
        activeAccounts: users.length,
        datasetSize: '12.4 MB',
        partnerOptIn: true,
        trendApiStatus: 'healthy'
      });
    } catch (err) {
      console.error('Error fetching system stats:', err);
    }
  };

  // Handle adding a new user (the backend hashes the password)
  const handleAddUser = async (userData) => {
    try {
      await adminRequest('POST', '/users', {
        email: userData.email,
        password: userData.password,
        name: userData.full_name,
        role: userData.role
      });
      setNotice('User created.');
      setShowAddUserModal(false);
      fetchUsers(); // Refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle updating a user (name and role; email/password are not editable)
  const handleUpdateUser = async (userId, updates) => {
    try {
      await adminRequest('PATCH', `/users/${userId}`, {
        name: updates.full_name,
        role: updates.role
      });
      setNotice('User updated.');
      setShowEditUserModal(false);
      fetchUsers(); // Refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle disabling a user
  const handleDisableUser = async (userId) => {
    try {
      await adminRequest('PATCH', `/users/${userId}`, { status: 'disabled' });
      setNotice('User disabled.');
      fetchUsers(); // Refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle deleting a user
  const handleDeleteUser = async (userId) => {
    try {
      await adminRequest('DELETE', `/users/${userId}`);
      setNotice('User deleted.');
      fetchUsers(); // Refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle enabling a user
  const handleEnableUser = async (userId) => {
    try {
      await adminRequest('PATCH', `/users/${userId}`, { status: 'active' });
      setNotice('User enabled.');
      fetchUsers(); // Refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRefreshTrends = async () => {
    setTrendRefreshState('loading');
    try {
      await adminRequest('POST', '/trends/refresh');
      setTrendRefreshState('success');
      setNotice('Trend collection refresh started.');
    } catch (err) {
      setTrendRefreshState('error');
      setError(err.message);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchUsers();
    fetchSystemStats();
  }, []);

  const renderHeader = () => (
    <header className="page-header">
      <div>
        <h1 className="page-title">Admin Overview</h1>
        <p className="page-subtitle">Welcome, {userName}</p>
      </div>
    </header>
  );

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
      {loading ? (
        <div className="admin-loading">
          <div className="loading-spinner"></div>
          <p>Loading admin overview...</p>
        </div>
      ) : error ? (
        <>
          {renderHeader()}
          <div className="status-banner">
            <span>{error}</span>
            <button onClick={() => {
              setError(null);
              fetchUsers();
              fetchSystemStats();
            }} className="btn-secondary">
              Try Again
            </button>
          </div>
        </>
      ) : (
        <>
          {renderHeader()}

            {notice && (
              <div className="status-banner success">
                <span>{notice}</span>
                <button onClick={() => setNotice('')} className="btn-error-close" aria-label="Dismiss">×</button>
              </div>
            )}

            <div className="admin-content">
              {/* System Status Section */}
              <section className="admin-section">
                <h2 className="section-title">System Status</h2>
                <div className="stats-grid">
                  <div className="stat-box">
                    <div className="stat-label">Active Accounts</div>
                    <div className="stat-value">{systemStats.activeAccounts}</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">Dataset Size</div>
                    <div className="stat-value">{systemStats.datasetSize}</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">Blingify Partner</div>
                    <div className="stat-value stat-value-sm">{systemStats.partnerOptIn ? 'Connected' : 'Not Connected'}</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">Trend API Status</div>
                    <div className="stat-value stat-value-sm">{systemStats.trendApiStatus}</div>
                  </div>
                </div>
              </section>

              <section className="admin-section trend-management">
                <div className="admin-section-heading">
                  <div>
                    <h2 className="section-title">Trend Database Management</h2>
                    <p className="section-description">
                      Maintain the daily top ten audio, hashtag, and keyword trends for each platform.
                    </p>
                  </div>
                  <button
                    onClick={handleRefreshTrends}
                    className="btn-primary btn-arrow"
                    disabled={trendRefreshState === 'loading'}
                  >
                    {trendRefreshState === 'loading' ? 'Refreshing...' : 'Run manual refresh'}
                  </button>
                </div>
                <div className="trend-status-grid">
                  <div><span>Collection schedule</span><strong>Daily</strong></div>
                  <div><span>Active records</span><strong>Up to 60</strong></div>
                  <div><span>Last refresh</span><strong>{trendRefreshState === 'success' ? 'Started now' : 'Not available'}</strong></div>
                </div>
              </section>

              {/* User Management Section */}
              <section className="admin-section">
                <h2 className="section-title">User Management</h2>
                <div className="user-actions">
                  <button
                    onClick={() => setShowAddUserModal(true)}
                    className="btn-primary"
                  >
                    Add New User
                  </button>
                </div>

                <div className="users-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length > 0 ? (
                        users.map(user => (
                          <tr key={user.id}>
                            <td>{user.full_name || 'No Name Provided'}</td>
                            <td>{user.email}</td>
                            <td>
                              <span className={`role-badge ${user.role}`}>
                                {user.role.replace('_', ' ')}
                              </span>
                            </td>
                            <td>
                              <span className={`status-badge ${user.status}`}>
                                {user.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="mono">
                              {user.created_at === 'Unknown'
                                ? 'Unknown'
                                : new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <td className="user-actions-cell">
                              <button
                                onClick={() => {
                                  setEditUserData(user);
                                  setShowEditUserModal(true);
                                }}
                                className="btn-edit"
                              >
                                Edit
                              </button>
                              {user.status === 'active' ? (
                                <button
                                  onClick={() => handleDisableUser(user.id)}
                                  className="btn-edit"
                                >
                                  Disable
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleEnableUser(user.id)}
                                  className="btn-edit"
                                >
                                  Enable
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="btn-delete"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="no-users">
                            No users found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </>
        )}

        {/* Add User Modal */}
        {showAddUserModal && (
          <div className="modal-backdrop" onClick={() => setShowAddUserModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Add New User</h3>
                <button onClick={() => setShowAddUserModal(false)} className="btn-close">
                  ×
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const userData = {
                    email: formData.get('email'),
                    password: formData.get('password'),
                    full_name: formData.get('full_name'),
                    role: formData.get('role')
                  };
                  handleAddUser(userData);
                }}>
                  <div className="form-group">
                    <label htmlFor="add-email">Email</label>
                    <input
                      type="email"
                      id="add-email"
                      name="email"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="add-password">Password</label>
                    <input
                      type="password"
                      id="add-password"
                      name="password"
                      placeholder="Min. 8 letters, uppercase, 1 number"
                      required
                      minLength="8"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="add-name">Full Name</label>
                    <input
                      type="text"
                      id="add-name"
                      name="full_name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="add-role">Role</label>
                    <select id="add-role" name="role" required>
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </select>
                  </div>
                  <div className="modal-form-actions">
                    <button type="button" onClick={() => setShowAddUserModal(false)} className="btn-secondary">
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Add User
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {showEditUserModal && editUserData && (
          <div className="modal-backdrop" onClick={() => setShowEditUserModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Edit User</h3>
                <button onClick={() => setShowEditUserModal(false)} className="btn-close">
                  ×
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const updates = {
                    full_name: formData.get('full_name'),
                    role: formData.get('role')
                  };
                  handleUpdateUser(editUserData.id, updates);
                }}>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={editUserData.email}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="edit-name">Full Name</label>
                    <input
                      type="text"
                      id="edit-name"
                      name="full_name"
                      value={editUserData.full_name || ''}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="edit-role">Role</label>
                    <select id="edit-role" name="role" defaultValue={editUserData.role} required>
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </select>
                  </div>
                  <div className="modal-form-actions">
                    <button type="button" onClick={() => setShowEditUserModal(false)} className="btn-secondary">
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Update User
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminOverview;
