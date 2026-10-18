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
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trends"
              element={
                <ProtectedRoute>
                  <Trends />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <UploadPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <HistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-overview"
              element={
                <AdminProtectedRoute>
                  <AdminOverview />
                </AdminProtectedRoute>
              }
            />
          </Routes>
        </MainLayout>
      </AuthProvider>
    </Router>
  );
}

export default App;