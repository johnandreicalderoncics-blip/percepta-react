import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

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

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign up with email and password
  const signUp = async (email, password, fullName) => {
    try {
      // Determine if user should be admin based on email
      // For development, emails ending in @percepta.com or @admin.local get admin role
      const isAdminEmail = email.endsWith('@percepta.com') || email.endsWith('@admin.local');
      const userRole = isAdminEmail ? 'admin' : 'content_creator';

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: userRole // Store role in user_metadata (checked by isAdmin in development)
          },
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      return { data: null, error };
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { data: null, error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error signing out:', error);
      return { error };
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { data: null, error };
    }
  };

  // Update password
  const updatePassword = async (newPassword) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating password:', error);
      return { data: null, error };
    }
  };

  // Verify OTP
  const verifyOtp = async (email, token) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'signup',
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return { data: null, error };
    }
  };

  // Check if user is admin
  // Note: In a production app, role should be stored in app_metadata and set via admin API
  // For development, we also check user_metadata as a fallback
  const isAdmin = () => {
    return user?.app_metadata?.role === 'admin' ||
           (user?.user_metadata?.role === 'admin' &&
            process.env.NODE_ENV === 'development');
  };

  // Note: For full user management (create/update/delete users),
  // you would need to use Supabase admin API with service role key
  // These are placeholder functions showing the intended API
  const fetchUsers = async () => {
    try {
      // Note: For a production app, you would use Supabase admin API with service role key
      // The listUsers method requires admin privileges
      let authUsers = [];

      try {
        const { data, error } = await supabase.auth.listUsers();
        if (error) throw error;
        authUsers = data?.users || [];
      } catch (listError) {
        // If listUsers fails (likely due to insufficient permissions),
        // fall back to getting the current user only
        console.warn('Could not fetch user list via admin API, falling back to current user only');
        const { data: { user: currentUser }, error } = await supabase.auth.getUser();
        if (error) throw error;
        authUsers = currentUser ? [currentUser] : [];
      }

      // Format user data for display
      return authUsers.map(user => ({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || '',
        role: user.app_metadata?.role || 'content_creator',
        status: user.email_confirmed_at ? 'active' : 'unconfirmed',
        created_at: user.created_at
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };

  const createUser = async (userData) => {
    try {
      // This would require Supabase admin API with service role key
      // const { data, error } = await supabase.auth.admin.createUser({
      //   email: userData.email,
      //   password: userData.password,
      //   user_metadata: { full_name: userData.full_name },
      //   app_metadata: { role: userData.role }
      // });

      // For now, we'll throw an error indicating this needs admin API setup
      throw new Error('User creation requires Supabase admin API with service role key');
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  const updateUser = async (userId, updates) => {
    try {
      // This would require Supabase admin API with service role key
      // const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      //   user_metadata: { full_name: updates.full_name },
      //   app_metadata: { role: updates.role }
      // });

      throw new Error('User updates require Supabase admin API with service role key');
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const deleteUser = async (userId) => {
    try {
      // This would require Supabase admin API with service role key
      // const { error } = await supabase.auth.admin.deleteUser(userId);

      throw new Error('User deletion requires Supabase admin API with service role key');
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  const disableUser = async (userId) => {
    try {
      // This would require Supabase admin API with service role key
      // You might implement this by setting a flag in app_metadata
      throw new Error('User disable requires Supabase admin API with service role key');
    } catch (error) {
      console.error('Error disabling user:', error);
      throw error;
    }
  };

  const enableUser = async (userId) => {
    try {
      // This would require Supabase admin API with service role key
      throw new Error('User enable requires Supabase admin API with service role key');
    } catch (error) {
      console.error('Error enabling user:', error);
      throw error;
    }
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
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    disableUser,
    enableUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
