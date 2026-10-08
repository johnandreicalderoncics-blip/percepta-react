# Supabase Integration Guide for Percepta

This guide will walk you through setting up Supabase for your Percepta application.

## Prerequisites
- A Supabase account (sign up at https://supabase.com)
- Node.js and npm installed

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in your project details:
   - **Name**: Percepta
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
4. Wait for the project to be provisioned (~2 minutes)

## Step 2: Get Your API Keys

1. In your Supabase dashboard, click on the **Settings** icon (⚙️) in the sidebar
2. Go to **API** section
3. Find these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (a long string starting with `eyJ...`)

## Step 3: Configure Your Environment

1. Open the `.env` file in your project root
2. Replace the placeholder values with your actual Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Save the file
4. **IMPORTANT**: Never commit your `.env` file to Git (it's already in .gitignore)

## Step 4: Set Up Database Tables

Run these SQL commands in your Supabase SQL Editor (found in the sidebar):

### 1. Create User Profiles Table

```sql
-- Create user profiles table (extends auth.users)
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own profile
CREATE POLICY "Users can read own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create policy to allow profile creation on signup
CREATE POLICY "Users can insert own profile"
  ON public.user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### 2. Create Video Analyses Table

```sql
-- Create video analyses table
CREATE TABLE public.video_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_title TEXT NOT NULL,
  video_url TEXT,
  tiktok_score INTEGER CHECK (tiktok_score >= 0 AND tiktok_score <= 100),
  instagram_score INTEGER CHECK (instagram_score >= 0 AND instagram_score <= 100),
  metadata JSONB,
  feedback JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.video_analyses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own analyses
CREATE POLICY "Users can read own analyses"
  ON public.video_analyses
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow users to create analyses
CREATE POLICY "Users can create analyses"
  ON public.video_analyses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own analyses
CREATE POLICY "Users can update own analyses"
  ON public.video_analyses
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own analyses
CREATE POLICY "Users can delete own analyses"
  ON public.video_analyses
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX video_analyses_user_id_idx ON public.video_analyses(user_id);
CREATE INDEX video_analyses_created_at_idx ON public.video_analyses(created_at DESC);
```

### 3. Create Trends Table

```sql
-- Create trends table
CREATE TABLE public.trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL CHECK (platform IN ('tiktok', 'instagram')),
  sound_id TEXT,
  sound_name TEXT,
  hashtags TEXT[],
  metadata JSONB,
  rank INTEGER CHECK (rank >= 1 AND rank <= 30),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (read-only for authenticated users)
ALTER TABLE public.trends ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read trends
CREATE POLICY "Authenticated users can read trends"
  ON public.trends
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX trends_platform_date_idx ON public.trends(platform, date DESC);
CREATE INDEX trends_date_rank_idx ON public.trends(date DESC, rank);
```

### 4. Create Function to Auto-Create Profile

```sql
-- Function to create user profile automatically on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

## Step 5: Configure Email Authentication

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Find **Email** provider
3. Configure settings:
   - **Enable Email provider**: ON
   - **Confirm email**: ON (recommended)
   - **Email OTP length**: 6 digits
4. Save changes

### Email Templates (Optional)

Go to **Authentication** → **Email Templates** to customize:
- Confirmation email
- Password reset email
- Magic link email

## Step 6: Test Your Integration

1. Restart your development server:
```bash
npm run dev
```

2. Open http://localhost:5173

3. Try these flows:
   - **Register**: Create a new account
   - **Email Verification**: Check your email for OTP code
   - **Login**: Sign in with your credentials
   - **Dashboard**: View the protected dashboard
   - **Logout**: Sign out

## Step 7: Storage Setup (for Video Uploads)

1. In Supabase Dashboard, go to **Storage**
2. Click **Create new bucket**
3. Bucket settings:
   - **Name**: `videos`
   - **Public bucket**: OFF (private)
4. Click **Create bucket**

### Set Storage Policies

```sql
-- Allow authenticated users to upload videos
CREATE POLICY "Users can upload own videos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'videos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to read their own videos
CREATE POLICY "Users can read own videos"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'videos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to delete their own videos
CREATE POLICY "Users can delete own videos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'videos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

## Features Implemented

✅ **User Authentication**
- Email/password signup
- Email verification with OTP
- Login/logout
- Password reset
- Session management

✅ **Protected Routes**
- Dashboard requires authentication
- Automatic redirect to login for unauthenticated users

✅ **User Context**
- Global auth state management
- User data available throughout app

✅ **Error Handling**
- Display error messages to users
- Loading states for async operations

## Next Steps

### 1. Implement Video Upload
Create a new file `src/hooks/useVideoUpload.js`:

```javascript
import { supabase } from '../lib/supabase';

export const useVideoUpload = () => {
  const uploadVideo = async (file, userId) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('videos')
      .upload(fileName, file);
    
    if (error) throw error;
    return data;
  };
  
  return { uploadVideo };
};
```

### 2. Fetch Video Analyses
Create `src/hooks/useAnalyses.js`:

```javascript
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const useAnalyses = () => {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalyses();
    }
  }, [user]);

  const fetchAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from('video_analyses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setAnalyses(data);
    } catch (error) {
      console.error('Error fetching analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  return { analyses, loading, refetch: fetchAnalyses };
};
```

### 3. Real-time Updates (Optional)

Add real-time subscriptions to get live updates:

```javascript
// In your Dashboard or component
useEffect(() => {
  const channel = supabase
    .channel('video_analyses_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'video_analyses',
        filter: `user_id=eq.${user.id}`
      },
      (payload) => {
        console.log('Change received!', payload);
        // Update your state here
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [user]);
```

## Troubleshooting

### Issue: "Invalid API Key"
- Double-check your `.env` file has correct values
- Restart your dev server after changing `.env`
- Make sure you're using the **anon/public** key, not the service role key

### Issue: "Email not confirmed"
- Check your email inbox (and spam folder)
- In Supabase dashboard, you can manually confirm users in Authentication → Users

### Issue: "Row Level Security" errors
- Make sure you've run all the SQL policies
- Check that RLS is enabled on tables
- Verify user is authenticated

### Issue: Can't see user data in dashboard
- Check browser console for errors
- Verify `user` object in AuthContext
- Make sure protected route is working

## Security Best Practices

1. **Never expose your service role key** in client-side code
2. **Always use Row Level Security (RLS)** on your tables
3. **Validate user input** before sending to Supabase
4. **Use environment variables** for sensitive data
5. **Enable email confirmation** in production
6. **Set up proper CORS** in Supabase dashboard

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)

## Support

If you encounter issues:
1. Check the browser console for errors
2. Review Supabase logs in the dashboard
3. Verify your environment variables
4. Check that all SQL commands ran successfully
