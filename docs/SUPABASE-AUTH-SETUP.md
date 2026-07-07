# Supabase Auth — invitadrips.com

Configure these in **Supabase Dashboard → Authentication → URL Configuration**  
Project: `xlwpnodyighqpepfaekh`

## Required settings

| Setting | Value |
|---------|--------|
| **Site URL** | `https://invitadrips.com` |
| **Redirect URLs** | `https://invitadrips.com/auth/callback` |
| | `https://invitadrips.com/auth/reset-password` |
| | `https://invitadrips.com/auth/**` |
| | `http://localhost:3000/auth/callback` (local dev) |

## How it works

1. **Sign up** — `AuthContext.signUp` sends users to `/auth/callback` after email confirmation (`emailRedirectTo`).
2. **Email confirm** — Supabase redirects to `/auth/callback?code=…`; the route handler exchanges the code for a session cookie.
3. **Password reset** — `resetPasswordForEmail` redirects to `/auth/reset-password?code=…`; the page **exchanges the code server-side** (PKCE), then shows the new-password form.

## Netlify env (must match)

```
NEXT_PUBLIC_SITE_URL=https://invitadrips.com
NEXT_PUBLIC_APP_URL=https://invitadrips.com
NEXT_PUBLIC_SUPABASE_URL=https://xlwpnodyighqpepfaekh.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your publishable key>
SUPABASE_SERVICE_ROLE_KEY=<server only — never NEXT_PUBLIC_>
```

Import via **Site settings → Environment variables → Import from .env** using `netlify.env` (local file, gitignored).

## Verify after setup

1. Register at https://invitadrips.com/auth/register
2. Click the confirmation link in email → should land on homepage signed in
3. Sign out → sign in at `/auth/login`
4. Forgot password → email link → `/auth/reset-password` → update password

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| "Email verification failed" after clicking link | Add `https://invitadrips.com/auth/callback` to Redirect URLs |
| Reset link expired immediately | Add `https://invitadrips.com/auth/reset-password` to Redirect URLs |
| Sign-in works locally but not production | Check Netlify `NEXT_PUBLIC_APP_URL` matches custom domain |
| Profile missing after login | Run `supabase/RUN-THIS-ONCE.sql` — `handle_new_user` trigger |

## Security

- Rotate **service role key** and **admin JWT secret** if they were ever pasted in chat or tickets.
- Never commit `netlify.env` — it is in `.gitignore`.
