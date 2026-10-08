# Percepta - React Application

## Project Overview
Percepta is a platform that helps content creators evaluate their short-form videos against TikTok and Instagram Reels trends before posting.

## Color Palette
- **Primary Dark**: `#1e1b4b` (Deep navy blue)
- **Primary Purple**: `#3730a3` (Purple accent)
- **Accent Orange**: `#f59e0b` (CTAs and highlights)
- **Accent Yellow**: `#fbbf24` (Hover states)
- **Text White**: `#ffffff`
- **Text Light**: `#e0e7ff`
- **Background Gradient**: Linear gradient from `#1e1b4b` to `#3730a3`

## Routes

### Public Routes
1. **Landing Page** - `/`
   - Hero section with tagline
   - Features overview
   - Platform statistics
   - CTA buttons to register or login

2. **Login** - `/login`
   - Email and password authentication
   - "Forgot Password" link
   - Sign up redirect

3. **Register** - `/register`
   - Full name, email, and password fields
   - Password confirmation
   - Sign in redirect

4. **Verify Email** - `/verify`
   - 4-digit OTP input
   - Resend code option
   - Redirects to dashboard after verification

5. **Reset Password** - `/reset-password`
   - Email input for password reset
   - Confirmation screen after submission
   - Back to login option

### Protected Routes (Requires Authentication)
6. **Dashboard** - `/dashboard`
   - User welcome message
   - Video upload functionality
   - Platform fit scores (TikTok & Instagram)
   - Recent analysis history
   - Statistics overview

## Project Structure
```
src/
├── layouts/
│   ├── MainLayout.jsx       # Main app layout with header
│   └── MainLayout.css
├── pages/
│   ├── Landing.jsx           # Home/landing page
│   ├── Landing.css
│   ├── Login.jsx             # Login page
│   ├── Register.jsx          # Registration page
│   ├── Auth.css              # Shared auth styles
│   ├── Verify.jsx            # Email verification
│   ├── Verify.css
│   ├── ResetPassword.jsx     # Password reset
│   ├── ResetPassword.css
│   ├── Dashboard.jsx         # User dashboard
│   └── Dashboard.css
├── components/               # Reusable components (future)
├── App.jsx                   # Main app component with routing
├── App.css                   # Global app styles
├── main.jsx                  # App entry point
└── index.css                 # Root CSS variables and reset

## Technology Stack
- **Frontend Framework**: React 19.2.8
- **Routing**: React Router DOM
- **Build Tool**: Vite 8.3.0
- **Linter**: Oxlint
- **Styling**: Vanilla CSS with CSS Variables

## Getting Started

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

## Future Enhancements
- Integration with Supabase for authentication
- Video upload and processing with FastAPI backend
- AI analysis with Grok LLM API
- Trend database integration with Apify/SociaVault
- User profile management
- History/Analytics page
- Trends exploration page
- Settings page

## Notes
- The dashboard currently displays mock data
- Authentication flows are UI-only (backend integration pending)
- File upload functionality is UI-only (processing pending)
