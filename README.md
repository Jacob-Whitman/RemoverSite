# Baseline Solutions — Privacy Removal MVP

Confidential data broker removal and continuous monitoring for law enforcement professionals and their families.

---

## Architecture

```
User Browser
  → GitHub Pages (static Vite + React + TypeScript app)
  → Supabase Auth (sign-in, session management)
  → Supabase Postgres + RLS (profiles, tasks, reports, consent records)
  → Supabase Edge Functions (Turnstile verification, contact form, task creation, deletion, reporting)
  → Cloudflare Turnstile (anti-spam, server-side verification only)
  → Cloudflare DNS + WAF (in front of custom domain)
```

**Security boundary:** Supabase Row Level Security is the primary data access boundary. Frontend auth checks are UI-only. The service role key and Turnstile secret never appear in browser code.

---

## Stack

| Layer          | Technology                         |
|----------------|------------------------------------|
| Frontend       | Vite + React + TypeScript          |
| Routing        | React Router (HashRouter)          |
| Styling        | Tailwind CSS                       |
| Hosting        | GitHub Pages                       |
| CI/CD          | GitHub Actions                     |
| Auth           | Supabase Auth                      |
| Database       | Supabase Postgres (RLS)            |
| Edge Functions | Supabase Edge Functions (Deno)     |
| Anti-spam      | Cloudflare Turnstile               |
| DNS/WAF        | Cloudflare                         |
| Validation     | Zod + react-hook-form              |

---

## Local development

```bash
npm install
cp .env.example .env.local
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local
npm run dev
```

Check environment:
```bash
node scripts/check-env.mjs
```

---

## Environment variables

### Frontend (`.env.local`)

| Variable                 | Required | Notes                                            |
|--------------------------|----------|--------------------------------------------------|
| `VITE_SUPABASE_URL`      | Yes      | Supabase project URL                             |
| `VITE_SUPABASE_ANON_KEY` | Yes      | Anon key — safe for browser; RLS enforces access |
| `VITE_TURNSTILE_SITE_KEY`| No       | Cloudflare Turnstile public site key             |
| `VITE_APP_ENV`           | No       | `development` / `staging` / `production`         |
| `VITE_BASE_PATH`         | No       | `/` or `/<repo-name>/` for GitHub Pages          |

**Never put in frontend or CI build:**
- `SUPABASE_SERVICE_ROLE_KEY`
- `CLOUDFLARE_TURNSTILE_SECRET_KEY`

### Supabase Edge Function secrets

Set in Supabase dashboard → **Edge Functions → Secrets**:

| Secret                            | Description                           |
|-----------------------------------|---------------------------------------|
| `CLOUDFLARE_TURNSTILE_SECRET_KEY` | Turnstile secret — server-side only   |
| `SUPABASE_SERVICE_ROLE_KEY`       | Auto-injected by Supabase runtime     |
| `SITE_URL`                        | Your production URL                   |

---

## GitHub Pages deployment

1. **Settings → Pages** → set source to **GitHub Actions**.
2. If using a custom domain, configure it in Pages settings.
3. In **Settings → Secrets and variables → Actions → Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_TURNSTILE_SITE_KEY`

**Base path:**
- Custom domain or org root: `VITE_BASE_PATH=/`
- Project Pages (`org.github.io/repo`): `VITE_BASE_PATH=/repo-name/`

Set in `.github/workflows/deploy-pages.yml`.

---

## Cloudflare setup

1. Add domain to Cloudflare.
2. Point DNS to GitHub Pages per [GitHub's custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).
3. Enable Full (strict) SSL/TLS.
4. Configure WAF rules appropriate for your threat model.
5. Create a Turnstile site at dash.cloudflare.com/turnstile.
6. Add **site key** (public) to GitHub repo variables: `VITE_TURNSTILE_SITE_KEY`.
7. Add **secret key** (private) to Supabase Edge Function secrets: `CLOUDFLARE_TURNSTILE_SECRET_KEY`.
8. Never put the Turnstile secret in GitHub Actions or the frontend build.

---

## Supabase setup

1. Create project at supabase.com.
2. Copy Project URL and anon key from **Settings → API**.
3. Add to `.env.local`.
4. Install CLI: `npm install -g supabase`
5. Link project: `supabase link --project-ref <ref>`
6. Push migrations: `supabase db push`
7. Deploy functions: `supabase functions deploy`
8. Set secrets:
   ```bash
   supabase secrets set CLOUDFLARE_TURNSTILE_SECRET_KEY=your-secret
   supabase secrets set SITE_URL=https://yourdomain.com
   ```
9. In **Authentication → URL Configuration**, add:
   - Site URL: `https://yourdomain.com`
   - Redirect URLs: `https://yourdomain.com/#/dashboard`
   - Local dev: `http://localhost:5173/#/dashboard`

**Reminder:** The anon key is public by design. RLS in `0002_rls_policies.sql` is the authoritative access boundary.

---

## Migrations

| File                       | Purpose                       |
|----------------------------|-------------------------------|
| `0001_initial_schema.sql`  | Tables, indexes, RLS enabled  |
| `0002_rls_policies.sql`    | All RLS policies              |
| `0003_seed_brokers.sql`    | 5 placeholder broker records  |

```bash
supabase db reset   # local only
supabase db push    # push to linked project
```

---

## Edge Functions

| Function                    | Purpose                                         |
|-----------------------------|-------------------------------------------------|
| `verify-turnstile`          | Server-side Cloudflare Turnstile verification   |
| `submit-contact-request`    | Contact form — Turnstile + TODO email           |
| `create-broker-tasks`       | Create broker_task rows for a user              |
| `request-account-deletion`  | Insert deletion request + activity log          |
| `generate-monthly-report`   | Aggregate task counts → insert report (admin)   |

```bash
supabase functions deploy verify-turnstile
supabase functions deploy submit-contact-request
supabase functions deploy create-broker-tasks
supabase functions deploy request-account-deletion
supabase functions deploy generate-monthly-report
```

---

## Security notes

- No SSNs, driver's license images, financial accounts, or biometric data are collected.
- `SUPABASE_SERVICE_ROLE_KEY` never appears in frontend code or GitHub Actions build environment.
- `CLOUDFLARE_TURNSTILE_SECRET_KEY` never appears in frontend code.
- Turnstile token must be verified server-side — client-side completion is not treated as proof.
- Profile data is not stored in `localStorage` or `sessionStorage`.
- RLS is enabled on all tables. Frontend auth checks are UI-only.
- Found broker record URLs are stored internally in `broker_tasks` and never exposed in public UI.
- Admin role is enforced in both database (via `is_admin()` RLS function) and Edge Functions.

### What not to store

- Social Security Numbers
- Driver's license images or numbers
- Passport images
- Financial account numbers
- Medical records
- Biometric data
- Badge numbers or case information

---

## MVP limitations

Out of scope for v1:

- Broker automation (no scraping or automated form submission)
- Stripe billing
- Full household member onboarding (interest field only)
- Email sending from Edge Functions (TODO stubs present)
- Full admin CRUD (placeholder pages only)
- PDF export (disabled with "Coming soon")
- Custom JWT logic or password hashing

---

## Future roadmap

1. Wire email (Resend or SendGrid) for contact requests and notifications
2. Add rate limiting to Edge Functions
3. Import verified broker list (replace placeholders)
4. Build admin task management workflow
5. Add Stripe for subscription billing
6. PDF generation for monthly proof reports
7. Household member onboarding flow
8. Broker automation stubs for supported brokers
9. Department/group account support
10. Scheduled `generate-monthly-report` via Supabase cron
