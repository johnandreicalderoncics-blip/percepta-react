import { Link, useLocation } from 'react-router-dom';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/verify', '/reset-password'].includes(location.pathname);
  const isLandingPage = location.pathname === '/';

  return (
    <div className="main-layout">
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
