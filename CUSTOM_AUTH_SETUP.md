# Custom Authentication — Implementation Reference

> **⚠️ OUTDATED DOCUMENT — SUPERSEDED**
>
> The original version of this guide described a Supabase Edge Functions
> setup (auth Edge Functions, a `user_sessions` table, migrations, RLS
> policies, and storing the session token in `localStorage`). That approach
> is **no longer used** and its instructions must **not** be followed:
> no migrations were applied, no `user_sessions` table exists, Supabase
> Auth and `auth.uid()` are not used, and nothing auth-related is stored
> in the browser.
>
> The current implementation is described below.

## Current implementation (server-side backend)

Authentication is handled entirely by the Express backend in
[`../server`](../server), which talks to the **existing** Supabase project
with the **service-role key kept server-side only**. The database schema is
untouched: only the pre-existing `user_account` and `auth_token` tables are
used.

### How it works

- **Accounts** live in `user_account` (`user_id`, `name`, `email`,
  `password_hash`, `role`, `status`, `consent_at`). Passwords are verified
  server-side with bcrypt — the hash never leaves the server.
- **Sessions** reuse `auth_token` with `purpose = 'session'`: a random
  256-bit token is issued at login, only its SHA-256 hash is stored, and the
  raw token is kept in an **HTTP-only cookie** (`percepta_session`,
  `SameSite=Lax`, configurable `Secure`). JavaScript — and therefore XSS —
  cannot read it; nothing is stored in `localStorage`.
- **One-time codes** (email verification, password reset) reuse `auth_token`
  with purposes `email_verify` / `password_reset`: 6-digit codes stored
  hashed, 15-minute expiry, max 5 attempts. There is no email provider in
  scope, so the backend exposes the code in the API response only when
  `DEV_EXPOSE_OTP=true` (disabled automatically in production).
- **Authorization** is enforced on every protected endpoint by middleware:
  the session cookie is resolved to an `auth_token` row joined to
  `user_account`, the account must be `active`, and admin endpoints
  additionally require `role = 'admin'`. Mutations must pass a same-origin
  check (CSRF defense on top of the `SameSite` cookie).
- **Responses** only ever contain safe fields — `password_hash` and
  `token_hash` are never returned to the client.
- The browser talks **only** to this backend (`/api/...`); it never queries
  Supabase directly. In development, the Vite dev server proxies `/api` to
  the backend.

### Backend configuration (server/.env)

| Variable | Purpose |
|---|---|
| `SUPABASE_URL` | Existing Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role key — **server-side only**, never in the browser |
| `PORT` | Backend port (default `3001`) |
| `SESSION_TTL_HOURS` | Session lifetime (default `72`) |
| `BCRYPT_ROUNDS` | Password hashing cost (default `10`) |
| `COOKIE_SECURE` | Set `true` when serving over HTTPS |
| `DEV_EXPOSE_OTP` | `true` to return OTP codes in dev responses |

### Auth endpoints

| Method & path | Purpose |
|---|---|
| `POST /api/auth/register` | Create account, issue email-verify OTP |
| `POST /api/auth/verify` | Consume OTP, open session |
| `POST /api/auth/login` | Verify password, open session |
| `GET /api/auth/me` | Current session's user |
| `POST /api/auth/logout` | Invalidate session, clear cookie |
| `POST /api/auth/reset-request` | Issue password-reset OTP (anti-enumeration) |
