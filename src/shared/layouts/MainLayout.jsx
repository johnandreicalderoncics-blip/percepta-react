import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './MainLayout.css';

const MainLayout = () => (
  <div className="app-shell app-bg">
    <Sidebar />
    <main className="app-main">
      <Outlet />
    </main>
  </div>
);

export default MainLayout;
