# Deploy Invita from scratch (you haven’t uploaded yet)

Everything below assumes **zero Netlify setup so far**. The code is already on GitHub; you only connect Netlify to it.

---

## What’s already done

| Item | Status |
|------|--------|
| Code on GitHub | `github.com/ahmedayad1210/invita` (branch `main`) |
| `netlify.toml` in repo | Yes — Netlify reads build settings automatically |
| Supabase keys | You have them — use `netlify.env` |
| Site live on Netlify | **Not yet — you do steps below** |

---

## Step 1 — Supabase database (5 min)

1. Open https://supabase.com/dashboard/project/xlwpnodyighqpepfaekh/sql/new  
2. Open the file **`supabase/RUN-THIS-ONCE.sql`** from the Invita repo on your Mac (or GitHub).  
3. Copy all SQL → paste in Supabase → **Run**.

Then: **Authentication → URL Configuration**

- **Site URL:** `https://invita.netlify.app` (change later if you use `invitadrips.com`)
- **Redirect URLs:** add  
  `https://invita.netlify.app/auth/callback`  
  `http://localhost:3000/auth/callback`

---

## Step 2 — Create `netlify.env` on your Mac

In Terminal:

```bash
cd ~/invita
git pull origin main
```

Create a file named **`netlify.env`** in that folder (same content we built earlier — Supabase keys, admin password, site URL).  
See **`docs/NETLIFY-ENV-IMPORT.md`** or ask for the file again if you don’t have it saved.

Minimum required vars:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or publishable key)
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL` = `https://invita.netlify.app`
- `NEXT_PUBLIC_APP_URL` = `https://invita.netlify.app`
- `ADMIN_JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`

---

## Step 3 — Connect GitHub to Netlify (first-time upload)

1. Go to https://app.netlify.com and log in (GitHub login is easiest).  
2. Click **Add new site** → **Import an existing project**.  
3. Choose **GitHub** → authorize Netlify if asked.  
4. Select repository: **`ahmedayad1210/invita`**.  
5. Branch: **`main`**.  
6. Build settings — **leave as detected** (from `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: handled by `@netlify/plugin-nextjs`  
7. **Do not deploy yet** — open **Environment variables** (or add them right after import).

---

## Step 4 — Import environment variables

1. Netlify → your site → **Site configuration** → **Environment variables**.  
2. **Import from .env file** → choose your **`netlify.env`**.  
3. Apply to **Production** (and Deploy previews if you want).

---

## Step 5 — Deploy

1. Click **Deploy site** (or **Trigger deploy → Deploy project**).  
2. Wait ~2–5 minutes. Open the URL Netlify gives you (e.g. `https://something.netlify.app`).  
3. Optional: **Domain management** → change site name to **`invita`** so URL is `https://invita.netlify.app` (must match `NEXT_PUBLIC_SITE_URL` in env).

---

## Step 6 — Quick test

| Check | URL |
|-------|-----|
| Homepage loads | `/` |
| IV menu | `/iv-therapy` |
| Booking | `/book` |
| Admin | `/admin` (user `admin`, temp password from `netlify.env`) |

If images look empty: run `npm run ingest:dump` locally with your asset folder, commit `public/images`, push — Netlify will rebuild.

---

## Custom domain later (`invitadrips.com`)

1. Netlify → **Domain management** → **Add domain** → `invitadrips.com`.  
2. Point DNS to Netlify (A/CNAME as Netlify shows).  
3. Update env vars:
   - `NEXT_PUBLIC_SITE_URL=https://invitadrips.com`
   - `NEXT_PUBLIC_APP_URL=https://invitadrips.com`
4. Add `https://invitadrips.com/auth/callback` in Supabase redirect URLs.  
5. Redeploy.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Build fails on Netlify | Check **Deploy log**; usually missing env var |
| “Lead capture not configured” | Add `SUPABASE_SERVICE_ROLE_KEY` in Netlify env, redeploy |
| Auth login fails | Supabase redirect URLs must match your Netlify URL |
| Empty hero/images | Asset ingest not run yet — site still works, images missing |
| Repo empty error | Use `ahmedayad1210/invita`, branch `main` |

---

## You do NOT need to

- Manually upload ZIP files to Netlify  
- Use Vercel (Invita is set up for Netlify)  
- Mix Sahar Healthcare repo — Invita is its own repo  

**One action that publishes the site:** Netlify **Import from Git** → `invita` → import env → **Deploy**.
