import { useState, useEffect } from 'react';
import { useAuth } from '../shared/contexts/AuthContext';
import { supabase } from '../lib/supabase';

const AdminOverview = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editUserData, setEditUserData] = useState(null);
  const [systemStats, setSystemStats] = useState({
    activeAccounts: 0,
    datasetSize: '0 MB',
    partnerOptIn: false,
    trendApiStatus: 'unknown'
  });

  // Get user name from metadata or email
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  // Fetch users from Supabase
  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Note: For a production app, you would use Supabase admin API with service role key
      // The listUsers method requires admin privileges
      let authUsers = [];

      try {
        const { data, error } = await supabase.auth.listUsers();
        if (error) throw error;
        authUsers = data?.users || [];
      } catch (listError) {
        // If listUsers fails (likely due to insufficient permissions),
        // fall back to getting the current user only
        console.warn('Could not fetch user list via admin API, falling back to current user only');
        const { data: { user: currentUser }, error } = await supabase.auth.getUser();
        if (error) throw error;
        authUsers = currentUser ? [currentUser] : [];
      }

      // Format user data for display
      // Check both app_metadata and user_metadata for role (for development flexibility)
      const formattedUsers = authUsers.map(user => {
        const role = user.app_metadata?.role ||
                    user.user_metadata?.role ||
                    'content_creator';
        return {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || '',
          role: role,
          status: user.email_confirmed_at ? 'active' : 'unconfirmed',
          created_at: user.created_at
        };
      });

      setUsers(formattedUsers);
      setError(null);
    } catch (err) {
      setError(err.message);
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

  // Handle adding a new user
  const handleAddUser = async (userData) => {
    try {
      // In a real implementation with admin API:
      // const { data, error } = await supabase.auth.admin.createUser({
      //   email: userData.email,
      //   password: userData.password,
      //   user_metadata: { full_name: userData.full_name },
      //   app_metadata: { role: userData.role }
      // });

      // For now, we'll simulate and show a message
      alert('User creation would be implemented with Supabase admin API');
      setShowAddUserModal(false);
      fetchUsers(); // Refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle updating a user
  const handleUpdateUser = async (userId, updates) => {
    try {
      // In a real implementation with admin API:
      // const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      //   user_metadata: { full_name: updates.full_name },
      //   app_metadata: { role: updates.role }
      // });

      alert('User update would be implemented with Supabase admin API');
      setShowEditUserModal(false);
      fetchUsers(); // Refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle disabling a user
  const handleDisableUser = async (userId) => {
    try {
      // In a real implementation:
      // const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      //   // This would typically involve setting a flag or using a custom approach
      //   // Supabase doesn't have a direct "disable" flag, you might use custom metadata
      //   app_metadata: { ...(await supabase.auth.admin.getUserById(userId)).data.user.app_metadata, status: 'disabled' }
      // });

      alert('User disable would be implemented with Supabase admin API');
      fetchUsers(); // Refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle deleting a user
  const handleDeleteUser = async (userId) => {
    try {
      // In a real implementation with admin API:
      // const { error } = await supabase.auth.admin.deleteUser(userId);

      alert('User deletion would be implemented with Supabase admin API');
      fetchUsers(); // Refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle enabling a user
  const handleEnableUser = async (userId) => {
    try {
      // Similar to disable, would update app_metadata
      alert('User enable would be implemented with Supabase admin API');
      fetchUsers(); // Refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchUsers();
    fetchSystemStats();
  }, []);

  if (loading) {
    return (
      <div className="admin-overview-page">
        <div className="admin-header">
          <h1>Admin Overview</h1>
          <p>Welcome, {userName}</p>
        </div>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading admin overview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-overview-page">
        <div className="admin-header">
          <h1>Admin Overview</h1>
          <p>Welcome, {userName}</p>
        </div>
        <div className="error-container">
          <h2>Error Loading Data</h2>
          <p>{error}</p>
          <button onClick={() => {
            setError(null);
            fetchUsers();
            fetchSystemStats();
          }} className="btn-retry">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-overview-page">
      <div className="admin-header">
        <h1>Admin Overview</h1>
        <p>Welcome, {userName}</p>
      </div>

      <div className="admin-content">
        {/* System Status Section */}
        <section className="stats-section">
          <h2>System Status</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Active Accounts</h3>
              <p className="stat-value">{systemStats.activeAccounts}</p>
            </div>
            <div className="stat-card">
              <h3>Dataset Size</h3>
              <p className="stat-value">{systemStats.datasetSize}</p>
            </div>
            <div className="stat-card">
              <h3>Blingify Partner</h3>
              <p className="stat-value">{systemStats.partnerOptIn ? 'Connected' : 'Not Connected'}</p>
            </div>
            <div className="stat-card">
              <h3>Trend API Status</h3>
              <p className="stat-value">{systemStats.trendApiStatus}</p>
              <span className={`status-indicator ${systemStats.trendApiStatus === 'healthy' ? 'healthy' : 'unhealthy'}`}>
                {systemStats.trendApiStatus === 'healthy' ? '●' : '●'}
              </span>
            </div>
          </div>
        </section>

        {/* User Management Section */}
        <section className="users-section">
          <h2>User Management</h2>
          <div className="user-actions">
            <button
              onClick={() => setShowAddUserModal(true)}
              className="btn-add-user"
            >
              + Add New User
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
                          {user.role.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${user.status}`}>
                          {user.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
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
                            className="btn-disable"
                          >
                            Disable
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEnableUser(user.id)}
                            className="btn-enable"
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
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password:</label>
                  <input
                    type="password"
                    name="password"
                    required
                    minLength="6"
                  />
                </div>
                <div className="form-group">
                  <label>Full Name:</label>
                  <input
                    type="text"
                    name="full_name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Role:</label>
                  <select name="role" required>
                    <option value="admin">Admin</option>
                    <option value="content_creator">Content Creator</option>
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
                  <label>Email:</label>
                  <input
                    type="email"
                    value={editUserData.email}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label>Full Name:</label>
                  <input
                    type="text"
                    name="full_name"
                    value={editUserData.full_name || ''}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Role:</label>
                  <select name="role" required>
                    <option value="admin" selected={editUserData.role === 'admin'}>
                      Admin
                    </option>
                    <option value="content_creator" selected={editUserData.role === 'content_creator'}>
                      Content Creator
                    </option>
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
    </div>
  );
};

export default AdminOverview;