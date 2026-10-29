import './MainLayout.css';

const MainLayout = ({ children }) => (
  <div className="main-layout">
    <main className="main-content">
      {children}
    </main>
  </div>
);

export default MainLayout;
