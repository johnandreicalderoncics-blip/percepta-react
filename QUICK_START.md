# 🚀 Percepta - Quick Start Guide

## Before You Begin

Your app is already set up with Supabase authentication! You just need to configure your Supabase project.

## ⚡ 5-Minute Setup

### 1. Create Supabase Project (2 min)
```
1. Go to https://supabase.com
2. Click "New Project"
3. Name: Percepta
4. Choose a password
5. Select region
6. Click "Create"
```

### 2. Get Your Credentials (1 min)
```
1. In Supabase dashboard, click Settings ⚙️
2. Click "API"
3. Copy:
   - Project URL
   - anon public key
```

### 3. Update .env File (30 sec)
```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Set Up Database (1 min)
```
1. In Supabase, go to SQL Editor
2. Copy SQL from SUPABASE_SETUP.md
3. Run each section
4. Done!
```

### 5. Enable Email Auth (30 sec)
```
1. Go to Authentication → Providers
2. Enable "Email"
3. Turn on "Confirm email"
4. Save
```

## ✅ Test Your Setup

```bash
# Your server is already running at:
http://localhost:5173
```

Try:
1. Click "Get Started"
2. Fill registration form
3. Check email for code
4. Enter verification code
5. See your dashboard!

## 🎯 What Works Right Now

✅ User Registration  
✅ Email Verification  
✅ Login/Logout  
✅ Password Reset  
✅ Protected Dashboard  
✅ User Profiles  

## 📝 Important Files

- `.env` - Your Supabase credentials (NEVER commit this!)
- `SUPABASE_SETUP.md` - Detailed setup guide
- `src/lib/supabase.js` - Supabase client
- `src/contexts/AuthContext.jsx` - Auth management

## 🐛 Common Issues

**"Invalid API Key"**
→ Check `.env` file and restart server

**No email received**
→ Check spam folder or Supabase logs

**Can't login**
→ Make sure email is verified in Supabase dashboard

## 📚 Next Steps

After basic setup works:
1. Implement video upload
2. Connect to AI analysis API
3. Build trends integration
4. Create history page

## 🆘 Need Help?

Check `SUPABASE_SETUP.md` for detailed instructions!

---

**Current Status**: ✅ Frontend Complete | ⏳ Backend Integration Pending
