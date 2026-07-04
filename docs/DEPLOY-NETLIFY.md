# Netlify deploy

1. [app.netlify.com](https://app.netlify.com) → **Add site → Import from Git** → `ahmedayad1210/invita`
2. Build settings come from `netlify.toml` automatically.
3. Add environment variables in Netlify (Site settings → Environment):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (if using server features)
   - `NEXT_PUBLIC_SITE_URL` = your production URL
   - EmailJS keys if using contact forms

Build verified with Node 20 + `@netlify/plugin-nextjs`.
