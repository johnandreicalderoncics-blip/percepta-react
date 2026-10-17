import { Link, useLocation } from 'react-router-dom';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/verify', '/reset-password'].includes(location.pathname);
  const isLandingPage = location.pathname === '/';

  return (
    <div className="main-layout">
      {!isAuthPage && !isLandingPage && (
        <header className="header">
          <div className="header-content">
            <Link to="/" className="logo">
              <span className="logo-text">PERCE<span className="logo-accent">PTA</span></span>
            </Link>
            <nav className="nav">
              <Link to="/" className="nav-link">Log in</Link>
              <Link to="/register" className="btn-primary">Get Started</Link>
            </nav>
          </div>
        </header>
      )}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
