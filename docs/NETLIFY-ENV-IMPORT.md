# Import env vars to Netlify

## Option A — Netlify UI

1. Open [app.netlify.com](https://app.netlify.com) → your Invita site
2. **Site configuration → Environment variables**
3. **Import from .env file** → upload `netlify.env`
4. Scope: **Production** (and **Deploy previews** if you want)
5. Trigger a new deploy

## Option B — Netlify CLI

```bash
cd ~/invita
netlify link
netlify env:import netlify.env
netlify deploy --prod
```

## After custom domain

Update in Netlify (and redeploy):

```bash
NEXT_PUBLIC_SITE_URL=https://invitadrips.com
NEXT_PUBLIC_APP_URL=https://invitadrips.com
```

Also set the same URLs in Supabase → **Authentication → URL Configuration**.

## Supabase auth redirects

Add to Supabase redirect URLs:

- `https://invita.netlify.app/auth/callback`
- `https://invitadrips.com/auth/callback` (when domain is live)

## Security

`netlify.env` contains secrets. Do not commit it to GitHub. It is listed in `.gitignore`.

Rotate keys in Supabase if they were ever shared in chat.
