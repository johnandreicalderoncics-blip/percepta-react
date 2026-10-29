import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './shared/contexts/AuthContext';
import MainLayout from './shared/layouts/MainLayout';
import ProtectedRoute from './shared/components/ProtectedRoute';
import AdminProtectedRoute from './shared/components/AdminProtectedRoute';
import Landing from './public/Landing';
import Register from './auth/Register';
import Verify from './auth/Verify';
import ResetPassword from './auth/ResetPassword';
import Dashboard from './user/Dashboard';
import Trends from './user/Trends';
import UploadPage from './user/UploadPage';
import HistoryPage from './user/HistoryPage';
import SettingsPage from './user/SettingsPage';
import AdminOverview from './admin/AdminOverview';

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
