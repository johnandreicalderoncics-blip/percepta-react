# Custom Authentication System Setup Guide

This guide explains how to set up and deploy the custom authentication system for Percepta that replaces Supabase Auth with secure authentication against the `public.user_account` table using Supabase Edge Functions.

## Overview

The custom authentication system consists of:
1. **Database Tables**: `user_account`, `auth_token`, `user_sessions`
2. **Supabase Edge Functions**: Secure backend functions for authentication operations
3. **Frontend Updates**: React components that call Edge Functions instead of Supabase Auth
4. **Security Measures**: Password hashing, session management, RLS policies

## Database Setup

### 1. Apply Migrations

Run the migration SQL files in order to create the necessary tables:

```sql
-- 001_create_user_account_table.sql
-- 002_create_auth_token_table.sql  
-- 003_create_user_sessions_table.sql
```

You can apply these using the Supabase SQL Editor or via the Supabase CLI:
```bash
supabase db push --schema public
```

### 2. Row Level Security (RLS)

The migrations include RLS policies that:
- Allow users to read/update only their own data in `user_account`
- Allow users to manage their own tokens in `auth_token`
- Allow users to manage their own sessions in `user_sessions`

## Edge Functions Deployment

### 1. Required Secrets

Before deploying the Edge Functions, you need to set the following secrets in your Supabase project:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (found in Settings → API)

### 2. Deploy Functions

Deploy each Edge Function using the Supabase CLI:

```bash
# Deploy all functions
supabase functions deploy auth-login
supabase functions deploy auth-register
supabase functions deploy auth-verify
supabase functions deploy auth-reset-request
supabase functions deploy auth-reset-confirm
supabase functions deploy auth-session
supabase functions deploy auth-logout
```

Or deploy all at once:
```bash
supabase functions deploy --project-id YOUR_PROJECT_ID
```

### 3. Function Configuration

Each function requires:
- Access to the Supabase service role key for database operations
- Bcrypt dependency for password/token hashing (included in the function code)
- Proper CORS headers for frontend access

## Frontend Configuration

### 1. Environment Variables

Update your `.env` file with:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
```

Note: The publishable key is still needed for the Supabase client used in real-time subscriptions and storage, but not for authentication.

### 2. How It Works

1. **Login**: Frontend calls `/auth-login` Edge Function with email/password
2. **Registration**: Frontend calls `/auth-register` Edge Function with user details
3. **Verification**: Frontend calls `/auth-verify` Edge Function with email/token
4. **Password Reset**: Frontend calls `/auth-reset-request` then `/auth-reset-confirm`
5. **Session Validation**: Frontend calls `/auth-session` to validate session
6. **Logout**: Frontend calls `/auth-logout` to invalidate session

### 3. Session Management

- Session tokens are stored in httpOnly cookies (or localStorage as fallback)
- Only hashed tokens are stored in the database
- Sessions expire after 7 days
- Token validation happens on each protected route access

## Security Features

### Password Security
- Passwords are hashed using bcrypt with cost factor 12
- Never stored or transmitted in plaintext
- Validation happens only in Edge Functions
- Protection against timing attacks

### Session Security
- Opaque random session tokens
- Only token hashes stored in database
- HttpOnly cookies to prevent XSS access
- Short-lived tokens with expiration
- Revocation capability

### User Enumeration Protection
- Generic error messages for login/registration
- Same responses whether email exists or not
- Rate limiting via attempt counters in auth_token table

### Authorization
- Role validation happens server-side in Edge Functions
- Admin role cannot be set through public registration
- Protected routes validate sessions via `/auth-session` endpoint

## Admin Provisioning

Admin accounts cannot be created through public registration. To create the first admin:

### Option 1: Direct Database Insert (Initial Setup)
```sql
INSERT INTO public.user_account (name, email, password_hash, role, status)
VALUES (
  'Admin User',
  'admin@example.com',
  crypt('secure_password', gen_salt('bf', 12)),
  'admin',
  'active'
);
```

### Option 2: Use Supabase Admin API (Requires Service Role Key)
```javascript
const { data, error } = await supabase.auth.admin.createUser({
  email: 'admin@example.com',
  password: 'secure_password',
  user_metadata: { full_name: 'Admin User' },
  app_metadata: { role: 'admin' }
});
```

## Testing the Implementation

### Test Cases to Verify

1. **Valid User Login**
   - Correct credentials should log user in and redirect to dashboard
   - Session should be stored and validated on subsequent requests

2. **Invalid Password**
   - Should show generic "Invalid credentials" error
   - Should not reveal whether email exists

3. **Nonexistent Email**
   - Should show generic "Invalid credentials" error (same as invalid password)

4. **Pending User Handling**
   - Users with status = 'pending' should be prompted to verify email
   - Should not be able to log in until verified

5. **Disabled User Blocking**
   - Users with status = 'disabled' should be blocked from logging in

6. **Admin Authorization**
   - Admin users should access admin routes
   - Non-admin users should be blocked from admin routes

7. **Normal User Restrictions**
   - Regular users should be blocked from admin-only routes

8. **Logout/Revoked Session**
   - Logging out should invalidate session
   - Revoked sessions should not be valid for protected routes

9. **Expired Session Handling**
   - Sessions past expiration should require re-login

10. **Registration Security**
    - Registration should never create admin users through public flow
    - Password should be hashed before storage
    - Same response for new vs existing email (no enumeration)

11. **Password Hash Protection**
    - Verify password_hash is never returned in API responses
    - Check network calls for any exposure of sensitive data

## Dependencies

### Backend (Edge Functions)
- `@supabase/supabase-js` v2 (included in function runtime)
- `bcrypt` v0.4.1 (included via deno.land/x/bcrypt)

### Frontend
- No additional dependencies required (uses existing fetch API)
- Continues to use `@supabase/supabase-js` for real-time/storage if needed

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure Edge Functions have proper CORS headers
   - Check that frontend is calling correct function URLs

2. **Authentication Failures**
   - Verify SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set correctly
   - Check function logs in Supabase dashboard for errors

3. **Session Not Persisting**
   - Verify localStorage is working correctly
   - Check cookie settings if using httpOnly cookies

4. **Database Connection Errors**
   - Ensure service role key has proper permissions
   - Check Row Level Security policies aren't blocking access

### Debugging

1. **Function Logs**
   - View in Supabase Dashboard → Edge Functions → Logs

2. **Database Queries**
   - Use Supabase SQL Editor to inspect tables directly

3. **Network Requests**
   - Use browser dev tools to inspect frontend → Edge Function calls

4. **Environment Variables**
   - Verify VITE_SUPABASE_URL is correctly set in frontend

## Maintenance

### Updating Functions
```bash
supabase functions deploy auth-login --no-verify-imports
```

### Adding New Secrets
1. Add secret in Supabase Dashboard → Settings → Edge Functions
2. Redeploy affected functions
3. Restart frontend if needed

### Backup and Recovery
- Database migrations are version-controlled
- Export/import user_account data as needed for backups
- Service role key should be stored securely (never in frontend)

## Limitations and Notes

### Current Limitations
1. Email service integration needed for OTP delivery (can use Supabase email providers or external service)
2. Initial admin creation requires direct database access or admin API
3. CORS configuration may need adjustment based on deployment setup
4. HTTPS required for production deployment (cookies require secure contexts)

### Future Improvements
1. Add rate limiting to prevent brute force attacks
2. Implement refresh token flow for longer sessions
3. Add email/sms providers for OTP delivery
4. Implement password strength estimator (zxcvbn)
5. Add login attempt tracking and lockout
6. Integrate with Supabase Auth for social login providers (optional)

### Security Considerations
- Never commit `.env` file with real credentials
- Regularly rotate service role keys
- Monitor Edge Function logs for suspicious activity
- Keep dependencies updated
- Conduct periodic security audits