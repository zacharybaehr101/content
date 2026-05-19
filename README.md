# School Intelligence Platform

A school marketing intelligence platform — search, benchmark, and analyze how Catholic schools use their websites, social media, and news stories to promote enrollment.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Hosting**: Vercel
- **Data**: Google Sheets (via Sheets API v4)
- **Auth**: Clerk *(Phase 4)*
- **Payments**: Stripe *(Phase 4)*

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── schools/
│   │       ├── route.ts          # GET /api/schools (search + filter)
│   │       ├── filters/route.ts  # GET /api/schools/filters (dropdown options)
│   │       └── [slug]/route.ts   # GET /api/schools/:slug (single profile)
│   └── school/
│       └── [slug]/               # School profile pages (Phase 3)
├── lib/
│   ├── types.ts      # TypeScript types + tier field masks
│   ├── sheets.ts     # Google Sheets fetcher (cached, ISR)
│   └── search.ts     # Search/filter logic + tier enforcement
└── components/       # UI components (Phase 3)
```

## Setup

### 1. Clone & Install

```bash
git clone <your-repo>
cd school-intel
npm install
```

### 2. Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add:

**`GOOGLE_SHEET_ID`** — The ID from your sheet URL:
`https://docs.google.com/spreadsheets/d/**THIS_PART**/edit`

**`GOOGLE_SHEETS_API_KEY`** — Get this from Google Cloud Console:
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create or select a project
3. Enable the **Google Sheets API**
4. Go to **APIs & Services → Credentials → Create API Key**
5. (Optional but recommended) Restrict the key to Google Sheets API only

**Make your sheet public:**
- Open your Google Sheet
- Click **Share** (top right)
- Change to **Anyone with the link → Viewer**

### 3. Run Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 4. Test the API

```bash
# All schools (free tier, default)
curl http://localhost:3000/api/schools

# Search with query
curl "http://localhost:3000/api/schools?q=jesuit&region=Northeast"

# Filter options for dropdowns
curl http://localhost:3000/api/schools/filters

# Single school profile
curl http://localhost:3000/api/schools/benet-academy

# Simulate premium tier
curl -H "x-user-tier: premium" http://localhost:3000/api/schools
```

### 5. Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Add your environment variables in the Vercel dashboard under **Settings → Environment Variables**.

## Data Layer

Data is fetched from Google Sheets via the Sheets API v4 and cached with Next.js ISR (6-hour revalidation). No database is needed for the data layer — the sheet IS the database.

### Tier Field Access

| Field Category | Free | Individual | Premium+ |
|---|---|---|---|
| Name, type, location | ✅ | ✅ | ✅ |
| Hero headline, faith posture | ✅ | ✅ | ✅ |
| Strongest phrase, CTA labels | ❌ | ✅ | ✅ |
| Outcomes, financial aid flags | ❌ | ✅ | ✅ |
| Nav labels, visual theology | ❌ | ❌ | ✅ |
| Strategic analysis, outreach angle | ❌ | ❌ | ✅ |

## Roadmap

- [x] **Phase 2** — Data layer (Google Sheets → API routes, types, search, tier masks)
- [ ] **Phase 3** — Core UI (search page, school profiles, compare view)
- [ ] **Phase 4** — Auth + paywall (Clerk + Stripe, tier enforcement middleware)
- [ ] **Phase 5** — Export, PDF reports, team seats, API access
