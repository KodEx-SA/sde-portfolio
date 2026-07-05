# ashleydevhub-api

Standalone backend for [ashleydevhub.vercel.app](https://ashleydevhub.vercel.app) — handles the **Smith** chatbot, the **contact form**, and lightweight **analytics**. Deployed separately from the frontend, so you can update content (the chatbot's knowledge base, email recipient, etc.) without touching or redeploying the Next.js app on Vercel.

## What it does

| Route | Method | Purpose |
|---|---|---|
| `/api/health` | GET | Quick check of which services are configured |
| `/api/chat` | POST | Groq-powered streaming chat, used by the `useChat`/`Chat` hook on the frontend |
| `/api/contact` | POST | Sends contact-form submissions to your email via SMTP |
| `/api/analytics/track` | POST | Logs a pageview/event (fire-and-forget) |
| `/api/analytics/stats` | GET | Simple aggregated stats for the last 30 days (protected by `ADMIN_TOKEN`) |

Email and analytics persistence are **optional** — without SMTP creds the contact route returns a clear 503; without Supabase creds, analytics events are accepted but not stored, and stats return 503. Nothing crashes if you leave those blank while testing.

## 1. Local setup

```bash
npm install
cp .env.example .env
# fill in .env — at minimum set GROQ_API_KEY to get the chatbot working
npm run dev
```

Server runs on `http://localhost:8080` by default.

## 2. Environment variables

See `.env.example` for the full list. The important ones:

- **`GROQ_API_KEY`** — same key you already use for Smith. [console.groq.com](https://console.groq.com)
- **`ALLOWED_ORIGINS`** — your frontend's URL(s), comma-separated. CORS will reject anything not on this list.
- **`SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS`** — for the contact form. With Gmail: `smtp.gmail.com`, port `587`, and a [Google App Password](https://myaccount.google.com/apppasswords) (not your normal Gmail password — your account needs 2FA on for app passwords to be available).
- **`SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`** *(optional)* — only needed if you want contact submissions and analytics events stored somewhere queryable. Free Supabase project works fine. SQL to create the two tables is in `src/lib/supabase.ts`.
- **`ADMIN_TOKEN`** *(optional)* — any random string, protects `GET /api/analytics/stats`.

## 3. Deploy to Render (recommended, free tier)

1. Push this `backend/` folder to its own GitHub repo (or a subfolder of an existing one — Render lets you set a root directory).
2. On [render.com](https://render.com) → **New → Web Service** → connect the repo.
3. Settings:
   - **Root Directory:** `backend` (only if it's a subfolder of a bigger repo)
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** Free (spins down after 15 min idle — fine for portfolio traffic; cold start is ~10-30s on the next request)
4. Add all the environment variables from `.env.example` under **Environment**.
5. Deploy. Render gives you a URL like `https://ashleydevhub-api.onrender.com`.
6. Update `ALLOWED_ORIGINS` to include your actual Vercel URL once you know it.

If you outgrow the free tier's cold starts later, the $7/mo Starter instance keeps it always-on.

## 4. Point the frontend at it

In the Next.js project (deployed on Vercel), set:

```
NEXT_PUBLIC_API_URL=https://ashleydevhub-api.onrender.com
```

as an environment variable in the Vercel project settings, then redeploy the frontend once. After that, you only need to touch this backend repo to:

- Edit `src/lib/knowledgeBase.ts` to update what Smith knows (roles, projects, dates, etc.)
- Change `CONTACT_TO_EMAIL` to redirect where contact-form messages land
- Tweak rate limits in `src/middleware/rateLimit.ts`

No frontend redeploy needed for any of that.

## 5. Updating the knowledge base

`src/lib/knowledgeBase.ts` is the single source of truth for Smith's behavior and facts. Edit the relevant section (`ROLES`, `PROJECTS`, etc.), commit, push — Render auto-redeploys on push to your default branch.
