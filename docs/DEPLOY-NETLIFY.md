# Netlify deploy

1. [app.netlify.com](https://app.netlify.com) → **Add site → Import from Git** → `ahmedayad1210/invita`
2. Build settings come from `netlify.toml` automatically.
3. Add environment variables in Netlify (Site settings → Environment):

   | Variable | Notes |
   |----------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | From Invita Supabase project |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Or `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
   | `SUPABASE_SERVICE_ROLE_KEY` | Required for leads + admin APIs |
   | `NEXT_PUBLIC_SITE_URL` | Production URL (SEO, sitemap) |
   | `NEXT_PUBLIC_APP_URL` | Same as site URL (auth redirects) |
   | `ADMIN_JWT_SECRET` | Long random string |
   | `ADMIN_USERNAME` / `ADMIN_PASSWORD_HASH` | Bcrypt hash for admin |
   | EmailJS keys | Optional — contact + booking emails |

4. Run asset ingest locally before deploy — see `docs/LAUNCH.md`.

Build verified with Node 20 + `@netlify/plugin-nextjs`.

After first deploy, update `NEXT_PUBLIC_SITE_URL` in `netlify.toml` `[build.environment]` if using a custom domain.
