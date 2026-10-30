import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// All auth calls go to the Percepta backend, which owns the session: the
// token lives in an HTTP-only cookie that JavaScript can never read, so
// nothing sensitive is kept in localStorage or passed through this context.
const authFetch = async (path, { method = 'POST', body } = {}) => {
  const response = await fetch(`/api/auth${path}`, {
    method,
    credentials: 'include',
    ...(body !== undefined
      ? {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      : {}),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status}).`);
  }
  return data;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null); // always null: the session lives in a cookie
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ask the backend who this browser is. 401 means no valid session.
    const initSession = async () => {
      try {
        const data = await authFetch('/me', { method: 'GET' });
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initSession();
  }, []);

  // Sign up with email and password. The response includes a devCode only
  // when the backend runs with DEV_EXPOSE_OTP (no email provider in scope).
  const signUp = async (email, password, fullName) => {
    setLoading(true);
    try {
      const data = await authFetch('/register', {
        body: { email, name: fullName, password },
      });
      return { data, error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      return { data: null, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password; the backend sets the session cookie.
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const data = await authFetch('/login', { body: { email, password } });
      setUser(data.user);
      return { data, error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { data: null, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign out: invalidate the session server-side and clear the cookie.
  const signOut = async () => {
    setLoading(true);
    try {
      await authFetch('/logout');
      setUser(null);
      setSession(null);
      return { data: { ok: true }, error: null };
    } catch (error) {
      console.error('Error signing out:', error);
      return { data: null, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Reset password request. The backend responds identically whether or not
  // the email is registered (except a devCode in dev mode).
  const resetPassword = async (email) => {
    setLoading(true);
    try {
      const data = await authFetch('/reset-request', { body: { email } });
      return { data, error: null };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { data: null, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Password update is not implemented server-side yet (the backend has no
  // password-change endpoint); this stays an honest stub.
  const updatePassword = async (_newPassword) => {
    const error = 'Password update requires old password verification - please use reset password flow instead';
    return { data: null, error };
  };

  // Verify OTP: consumes the email_verify code and opens the session.
  const verifyOtp = async (email, token) => {
    setLoading(true);
    try {
      const data = await authFetch('/verify', { body: { email, token } });
      setUser(data.user);
      return { data, error: null };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return { data: null, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Check if user is admin (role comes from the user_account table via /api).
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    verifyOtp,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
