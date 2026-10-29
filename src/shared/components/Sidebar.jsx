import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Sidebar.css';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/upload', label: 'Upload' },
  { to: '/trends', label: 'Trends' },
  { to: '/history', label: 'History' },
  { to: '/settings', label: 'Settings' },
];

const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/');
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-text">PERCE<span className="logo-accent">PTA</span></span>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ to, label }) => (
          <Link key={to} to={to} className={`nav-item${pathname === to ? ' active' : ''}`} aria-current={pathname === to ? 'page' : undefined}>
            {label}
          </Link>
        ))}
        {isAdmin() && (
          <Link to="/admin-overview" className={`nav-item${pathname === '/admin-overview' ? ' active' : ''}`} aria-current={pathname === '/admin-overview' ? 'page' : undefined}>
            Admin Overview
          </Link>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar" aria-hidden="true">
            {userName.substring(0, 2).toUpperCase()}
          </div>
          <div className="user-info">
            <div className="user-name">{userName}</div>
            <div className="user-email">{user?.email}</div>
          </div>
        </div>
        <button onClick={handleLogout} className="btn-logout">
          Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
