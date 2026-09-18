# ✨ Zodiac Play

A playful, mobile-first astrology web app (installable PWA) built with React, Vite and Tailwind CSS.
Everything runs in the browser — no backend, no paid APIs, works offline.

## Features

| Screen | What it does |
|---|---|
| **Daily Horoscope** | Overall, 💖 Love, 💼 Work & Career, 💰 Money, 🌿 Health — star ratings, tips, mood, energy, lucky numbers/colour/time, best match. Yesterday / Today / Tomorrow. |
| **Tarot** | Card of the Day, Past·Present·Future, Love reading, Yes/No tarot. Full 78-card deck with upright & reversed meanings. |
| **Fortune Cookie** | Tap to crack, fortune + lucky numbers. |
| **Yes or No** | Magic 8-ball style orb. |
| **Heads or Tails** | 3D coin flip with stats and history. |
| **Personality** | From birthday: sign traits, element, modality, love & work style, numerology life path, Chinese zodiac. |
| **Love Match** | Compatibility % between two signs with love / friendship / communication / trust scores. |
| **Profile** | Name, birthday, daily streak, install-app button. |

Every result can be shared as an image (native share sheet on mobile, download on desktop).

## How the content works (all free)

- **Horoscopes** are generated on-device from hand-written phrase pools (`src/data/horoscopeText.ts`)
  using a seeded random generator keyed on *sign + date* — so every visitor sees the same reading for
  a sign on a given day, and it changes at midnight. No API keys, no rate limits, no downtime.
- **Tarot** meanings are original text (`src/data/tarot.ts`); the cards are drawn with CSS + emoji,
  so there are no image licensing issues.
- Profile, streaks and stats live in `localStorage` on the user's device.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173 (also on your LAN for phone testing)
npm run build     # production build in dist/
npm run preview   # serve the production build
```

## Deploy (free)

- **Cloudflare Workers**: build command `npm run build`, deploy command `npx wrangler deploy`
  (`wrangler.jsonc` serves `dist/` with single-page-app routing).
- **Vercel**: import the GitHub repo → framework "Vite" → deploy (`vercel.json` handles routing).
- **Netlify**: import the repo; `netlify.toml` sets the build and routing.

## Project structure

```
src/
  data/        signs, horoscope phrases, tarot deck, fortunes
  lib/         horoscope generator, compatibility, numerology, storage, share-image, PWA install
  components/  layout + bottom nav, shared UI, tarot card
  pages/       one file per screen
```

_For entertainment only._
