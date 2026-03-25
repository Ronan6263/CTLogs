# CoolLog — Deployment Guide

## Step 1 — Set up the Supabase database (2 min)

1. Go to https://supabase.com and open your project
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open the file `schema.sql` from this folder, copy ALL the contents, paste into the editor
5. Click **Run** (green button)
6. You should see "Success. No rows returned" — database is ready.

---

## Step 2 — Deploy to Vercel (3 min)

### Option A — Drag & Drop (easiest, no GitHub needed)

1. Go to https://vercel.com and sign in
2. From your dashboard click **Add New → Project**
3. Click **"Deploy from your computer"** or look for the drag-and-drop zone
4. Drag the entire `coollog` folder onto the page
5. Leave all settings as default, click **Deploy**
6. In ~30 seconds you'll get a live URL like `https://coollog-abc123.vercel.app`

### Option B — Via GitHub (recommended for future updates)

1. Go to https://github.com and create a new repository called `coollog`
2. Upload all files from this folder to the repo
3. Go to https://vercel.com → **Add New → Project**
4. Import your GitHub repo
5. Leave all settings as default, click **Deploy**

---

## Step 3 — Set up email dispatch (2 min)

1. Go to https://resend.com and create a free account
2. In the Resend dashboard, go to **API Keys** and create a new key
3. In Vercel, go to your project **Settings > Environment Variables**
4. Add: `RESEND_API_KEY` = (paste the key from step 2)
5. Redeploy the project (Vercel > Deployments > most recent > … > Redeploy)

Free Resend tier allows 100 emails/day and sends from `onboarding@resend.dev`.
To send from your own domain (e.g. `dispatch@yourdomain.com`), add and verify your
domain in the Resend dashboard under **Domains**, then set a `RESEND_FROM` environment
variable in Vercel (e.g. `AMC <dispatch@yourdomain.com>`).

---

## Step 4 — Share with your supervisor

Just send them the Vercel URL. Works on any device, any browser — no app install needed.

Both of you will see the same live data instantly.

---

## Notes

- Images are stored in Supabase Storage (site-images bucket) — lightweight paths in the database
- Data is shared in real time between all users
- Free tier on both Supabase and Vercel is more than enough for your usage
- To update the app in future: edit index.html and re-deploy to Vercel
