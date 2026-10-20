import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get the Supabase URL for Edge Function endpoints
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  useEffect(() => {
    // Get initial session from localStorage or cookie
    const initSession = async () => {
      try {
        // Try to get session from localStorage (fallback if cookies not working)
        const storedSession = localStorage.getItem('percepta_session');
        if (storedSession) {
          const sessionData = JSON.parse(storedSession);
          // Validate session with Edge Function
          const response = await fetch(`${supabaseUrl}/functions/v1/auth-session`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${sessionData.session_token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            setSession(sessionData);
            setLoading(false);
            return;
          }
        }

        // If no valid session, set loading to false
        setLoading(false);
      } catch (error) {
        console.error('Session initialization error:', error);
        setLoading(false);
      }
    };

    initSession();

    // Listen for storage changes (for tab-to-tab communication)
    const handleStorageChange = (e) => {
      if (e.key === 'percepta_session') {
        if (e.newValue) {
          const sessionData = JSON.parse(e.newValue);
          setSession(sessionData);
          // User data will be fetched on next request via auth-session
        } else {
          setUser(null);
          setSession(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [supabaseUrl]);

  // Sign up with email and password
  const signUp = async (email, password, fullName) => {
    setLoading(true);
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/auth-register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          name: fullName,
          password: password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // For email verification flow, we might need to navigate to verify page
      // The Edge Function will indicate if verification is required
      return { data, error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      return { data: null, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/auth-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store session data
      const sessionData = {
        user_id: data.user.user_id,
        session_token: data.session_token,
        expires_at: data.expires_at
      };

      setUser(data.user);
      setSession(sessionData);

      // Store in localStorage for persistence and cross-tab sync
      localStorage.setItem('percepta_session', JSON.stringify(sessionData));

      return { data, error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { data: null, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/auth-logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Send session token in Authorization header if available
          ...(session && { 'Authorization': `Bearer ${session.session_token}` })
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Logout failed');
      }

      // Clear user data
      setUser(null);
      setSession(null);

      // Remove from localStorage
      localStorage.removeItem('percepta_session');

      return { data, error: null };
    } catch (error) {
      console.error('Error signing out:', error);
      return { data: null, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Reset password request
  const resetPassword = async (email) => {
    setLoading(true);
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/auth-reset-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Reset request failed');
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { data: null, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Update password (requires valid session)
  const updatePassword = async (_newPassword) => {
    setLoading(true);
    try {
      // First verify the current session is valid
      const sessionResponse = await fetch(`${supabaseUrl}/functions/v1/auth-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session && { 'Authorization': `Bearer ${session.session_token}` })
        }
      });

      if (!sessionResponse.ok) {
        throw new Error('Invalid session');
      }

      // Then update the password using the reset confirm function with current session
      // For password update, we need to verify the user's identity first
      // In a real implementation, this would be a separate endpoint
      // For now, we'll simulate by requiring re-authentication or using a different flow

      // Since we don't have the old password, we can't directly update it
      // This would typically require the old password for verification
      // For simplicity in this example, we'll return an error indicating
      // this needs to be implemented with proper old password verification
      throw new Error('Password update requires old password verification - please use reset password flow instead');
    } catch (error) {
      console.error('Error updating password:', error);
      return { data: null, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async (email, token) => {
    setLoading(true);
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/auth-verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          token: token
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return { data: null, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Check if user is admin
  // Note: Role is now stored in the user_account table and returned by auth-session
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