# `app/` — 3D visualization layer

The first scaffold of the Kitkat Bulls homeowner experience.

**What it does today:** type an address → the app geocodes it → CesiumJS flies the camera to the location and renders Google Photorealistic 3D Tiles so you see *the actual house* in real-time 3D.

**What comes next** (per [`.context/plans/principles.md`](../.context/plans/principles.md)):
1. ✅ 3D visualization — address in, real house out
2. ⬜ Agentic design — one button → solar layout overlaid on the roof
3. ⬜ Proposal — costs, ROI, voice narration
4. ⬜ Installer view

## Stack

- **Vite + React 18 + TypeScript**
- **CesiumJS** for the 3D viewer
- **Google Photorealistic 3D Tiles** as the world (no Cesium Ion needed)
- **Google Geocoding API** for address → lat/lng

## Setup

```bash
cd app
cp .env.example .env.local
# edit .env.local and add a Google Maps Platform API key with:
#   - Geocoding API
#   - Map Tiles API   (Photorealistic 3D Tiles)
npm install
npm run dev
```

Open http://localhost:5173, type an address, click **Show my house**.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server on :5173 |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Type-check without building |

## File map

```
app/
├── src/
│   ├── App.tsx                  ← top-level layout & state machine
│   ├── main.tsx                 ← React entry point
│   ├── styles.css               ← all styling (kept in one file for hackathon speed)
│   ├── components/
│   │   ├── AddressBar.tsx       ← address input + submit
│   │   └── Viewer3D.tsx         ← CesiumJS viewer + Google 3D Tiles
│   └── lib/
│       ├── env.ts               ← reads VITE_GOOGLE_MAPS_API_KEY
│       ├── geocode.ts           ← address → { lat, lng }
│       └── types.ts             ← shared types
├── index.html
├── vite.config.ts
├── tsconfig*.json
└── .env.example
```

## Notes for future work

- The "Design my solar setup" button is wired in the UI but disabled — that's where the agentic layer plugs in next.
- Google's 3D Tiles attribution is rendered automatically by CesiumJS in the bottom-right; **don't remove it** (terms of service require it).
- Cesium Ion is intentionally disabled (`Ion.defaultAccessToken = ""`); we only depend on Google's tiles.
- For the demo: pre-flight the address and warm the tile cache. Coverage is excellent in major German cities, sometimes patchy in small villages.
