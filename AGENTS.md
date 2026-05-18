# AGENTS.md

## Purpose
This repo is a **Next.js + Vercel Go Functions** app for a radio station experience:
- show currently spinning track metadata
- show recent/upcoming schedule
- play live audio stream

This document is the canonical architecture/deployment reference for future edits.

---

## High-level architecture

```text
Browser (React/Next.js)
  ├─ GET /api/spins      -> Go function (scrapes Spinitron current spin)
  ├─ GET /api/calendar   -> Go function (fetches Spinitron calendar feed)
  ├─ GET /api/show?...   -> Go function (scrapes show details page)
  └─ Audio src /api/radio -> Next rewrite -> external audio stream URL
```

### Layers
1. **UI layer (Next.js pages/components)**
   - Renders Player + Calendar
   - Uses SWR for polling/fetching `/api/*`
2. **API layer (Vercel serverless Go functions in `/api/*.go`)**
   - Fetch/scrape external data
   - Return JSON/text responses to UI
3. **External services**
   - `spinitron.com` (metadata)
   - `patmos.cdnstream.com` (audio stream)

---

## Code map

- `pages/index.js`:
  - Main page composition (`<Player />` and `<Shows />`)
- `components/Player.js`:
  - Fetches `/api/spins`
  - Creates `new Audio('/api/radio')`
- `components/Calendar.js`:
  - Fetches `/api/calendar`
  - Fetches `/api/show?path=...` per schedule slot
- `api/spins.go`:
  - Scrapes current spin from `SPINS_URL`
- `api/calendar.go`:
  - Pulls JSON schedule from `SPINS_URL + "calendar-feed"`
- `api/show.go`:
  - Scrapes show details from Spinitron show page
- `api/stream.go`:
  - Reverse proxy utility (alternate stream route, if used)
- `next.config.js`:
  - `distDir: "build"`
  - rewrite for `/api/radio` to external streaming URL

---

## Runtime behavior

### Player flow
1. `Player` SWR calls `/api/spins`
2. User taps play
3. Browser audio element loads `/api/radio`
4. Next rewrite proxies to external MP3 stream

### Calendar flow
1. `Calendar` SWR calls `/api/calendar`
2. UI renders slots
3. Slot click calls `/api/show?path=...`
4. Show details render inline

---

## Environment variables

Required (server-side):
- `SPINS_URL` (example: `https://spinitron.com/WXOX/`)

Optional (client-side):
- `NEXT_PUBLIC_SPINS_DEFAULT_IMAGE`

Notes:
- `SPINS_URL` should include trailing slash for current code assumptions.

---

## Deployment model (Vercel)

This app is **not** static-only.
It needs:
- Next.js app runtime
- Vercel Go Functions under `/api/*`

### Vercel project settings (important)
- Framework Preset: `Next.js`
- Build Command: `npm run build`
- Output Directory: **empty** (do not force static output dir)

Even with `distDir: "build"` in Next config, Vercel Output Directory should generally stay unset.

---

## Local development modes

### 1) Frontend-only dev
```bash
npm run dev
```
- Runs Next only
- `/api/*.go` functions are NOT executed
- `/api/*` will 404 unless separately proxied

### 2) Full-stack emulation
```bash
SPINS_URL=https://spinitron.com/WXOX/ npx vercel dev
```
- Intended to run Next + Vercel Functions locally
- Use this mode to test `/api/spins`, `/api/calendar`, `/api/show`

---

## Common failure signatures

1. **`Unexpected token '<'` in Calendar/Player fetches**
   - Cause: endpoint returned HTML 404 page, not JSON
   - Usually means API route not active locally

2. **`GET /api/spins 404` (local)**
   - Usually running `next dev` instead of full Vercel runtime

3. **Audio `NotSupportedError: no supported sources`**
   - `/api/radio` returned HTML/error instead of `audio/mpeg`
   - verify rewrite and response headers

4. **Vercel build error: output directory not found**
   - Output Directory misconfigured in Vercel settings

---

## First-principles verification checklist

After any reset/rebuild:

1. **Frontend renders**
   - `/` loads
2. **APIs return data**
   - `/api/spins` returns JSON-ish payload
   - `/api/calendar` returns JSON array
3. **Audio endpoint works**
   - `/api/radio` returns `Content-Type: audio/mpeg`
4. **Production deploy parity**
   - same checks on deployed URL

---

## Change policy for future agents

When changing architecture-critical behavior, update this file:
- API route names/contracts
- Stream URL strategy (`/api/radio` rewrite vs `/api/stream` function)
- Vercel settings assumptions
- Required env vars
