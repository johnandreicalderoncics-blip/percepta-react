import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import Landing from './pages/Landing/Landing';
import Register from './pages/Register/Register';
import Verify from './pages/Verify/Verify';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import Dashboard from './pages/Dashboard/Dashboard';
import Trends from './pages/Trends/Trends';
import UploadPage from './pages/UploadPage/UploadPage';
import HistoryPage from './pages/HistoryPage/HistoryPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import AdminOverview from './pages/AdminOverview/AdminOverview';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public: full-viewport pages, no shell wrapper */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Authenticated: shell (sidebar + navy background) provided by MainLayout */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/trends" element={<Trends />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Admin */}
          <Route
            element={
              <AdminProtectedRoute>
                <MainLayout />
              </AdminProtectedRoute>
            }
          >
            <Route path="/admin-overview" element={<AdminOverview />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
