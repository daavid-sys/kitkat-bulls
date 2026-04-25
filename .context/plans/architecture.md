# Architecture

## Two key architectural decisions

These are the load-bearing decisions everything else hangs off. Read them first.

### 1. Hybrid 3D rendering (not "just Google 3D Tiles")

Google Photorealistic 3D Tiles look incredible from 200m up but get soft and blurry at roof-close zoom in the suburban/small-town addresses where most solar customers actually live. Coverage outside major German metros is patchy. So:

- **World layer (context shot)** — Google Photorealistic 3D Tiles via CesiumJS. The cinematic "your house in its neighborhood" moment.
- **Roof layer (close-up)** — our own meshes, reconstructed from the **Google Solar API DSM + roof segment polygons**. Crisp, controllable lighting, panels sit cleanly on top.
- **Fallback for hand-picked demo addresses** — the **Reonic `.glb` photogrammetry models** in `Exp 3D-Modells/` (drone-quality scans of specific German houses).

The viewer transitions between layers with a camera move, so the homeowner sees their actual house from far away and a clean, panel-ready roof from close up.

### 2. Hybrid agentic architecture (not "feed the mesh to Gemini")

LLMs reason poorly over raw geometry (vertex lists, GLTF blobs, point clouds) and burn massive context for almost no benefit. The actual decisions ("which segment, how many panels, what orientation, avoid this chimney") are about a small set of *attributes per roof surface* — exactly what the Google Solar API already returns. So:

- **The 3D model is for the human; structured roof state + tools are for the agent.** The agent never sees raw geometry.
- **Vision is enrichment, not perception.** A top-down + oblique render of the 3D model goes to Gemini Vision *once* to tag obstructions the Solar API misses (chimneys, skylights, dormers, trees) — output appended as more JSON to the world model.
- **Geometry is deterministic; intent is agentic.** Greedy rectangle-packing places panels on segment polygons in code; the agent decides *which segments, how many, with what tradeoffs*. This keeps decisions fast, inspectable, and demo-stable.

The agent loop:
```
Solar API → roof segments JSON ─┐
3D render → Gemini Vision      ─┤→ world model (JSON)
User requirements              ─┘        │
                                         ▼
                              Agent (Gemini) — reasons via tools
                                         │
                          ┌──────────────┼──────────────┐
                          ▼              ▼              ▼
                  place_panels()  evaluate_layout()  add_battery()
                          │              │              │
                          └──────────────┴──────────────┘
                                         │
                                         ▼
                              Final layout JSON
                                         │
                                         ▼
                            3D viewer renders panels
```

**Agent's world model (input JSON shape):**
```jsonc
{
  "address": "Friedrichstrasse 43, 10117 Berlin",
  "roof": {
    "segments": [
      {
        "id": "seg_a",
        "polygon": [[lat, lng], ...],
        "pitch_deg": 32,
        "azimuth_deg": 178,        // south-facing
        "area_m2": 41.2,
        "annual_sunshine_hours": 1620,
        "max_panels_default": 14
      }
    ],
    "obstructions": [
      { "type": "chimney", "segment_id": "seg_a", "polygon": [...], "source": "vision" }
    ]
  },
  "requirements": {
    "monthly_bill_eur": 180,
    "battery_preference": "if_payback_under_8y",
    "budget_ceiling_eur": null
  },
  "components": {
    "panels": [{ "model": "...", "watts": 440, "price_eur": 220 }],
    "batteries": [...]
  }
}
```

**Agent tools (function-calling surface):**
- `place_panels(segment_id, count, orientation)` → returns updated layout
- `evaluate_layout(layout)` → `{ kWh_year, cost_eur, payback_years, self_consumption }`
- `add_battery(model, kWh)` → returns updated economics
- `flag_obstruction(segment_id, polygon, reason)` → for vision-detected blockers
- `propose_alternative(constraint)` → "what if we cap cost at X?"

**Agent output:**
```jsonc
{
  "layout": [{ "segment_id": "seg_a", "panels": [...], "orientation": "portrait" }],
  "battery": { "model": "...", "kWh": 10 },
  "summary": "16 panels on the south face, skipping the chimney area...",
  "rationale": "South face has 1620h sunshine vs 1100h on east; battery pays back in 7.2y at your usage profile."
}
```

The viewer renders `layout`, the proposal card renders `summary` + economics, Gradium narrates `rationale`.

## Partner Technologies

1. **Google Deepmind (Gemini)** — AI backbone: roof image analysis, proposal generation, agent reasoning
2. **Lovable** — Rapid frontend: onboarding flow, 3D viewer embed, proposal cards, installer dashboard
3. **Gradium** — Voice AI: narrates the proposal to the homeowner for a "holy shit" demo moment

## System Flow

```
Address Input → Google Solar API (roof data + segments)
                    ↓
            Google 3D Tiles (photogrammetric model of actual house)
            OR Reonic .glb files (fallback for German addresses)
                    ↓
            CesiumJS viewer (browser 3D) + panel placement algorithm
                    ↓
            Gemini 3.1 Pro (analyze roof screenshot → proposal text + ROI)
                    ↓
            Gradium (voice narration of proposal)
                    ↓
            Lovable (builds the entire UI: onboarding flow + 3D embed + proposal card)
```

## Component Breakdown

### 1. Address Input + Roof Data
- **Google Solar API** — `buildingInsights` endpoint returns roof segments, solar potential, panel configurations, and financial analysis from coordinates
- **Google 3D Tiles API** — photogrammetric 3D models of actual buildings, rendered with **CesiumJS** (geospatial-native, handles terrain + tiles out-of-box)
- **Fallback**: Reonic `.glb` files (photogrammetry models of German houses) loaded via Three.js GLTFLoader

### 2. Roof Detection + Panel Placement
- Extract roof polygons from Google Solar API response (provides roof segment data)
- **Greedy rectangle-packing algorithm** for panel placement — start top-left, respect pitch, avoid edges/obstructions
- No complex ML needed — Solar API already provides segment boundaries
- For extra impressiveness: Gemini 3.1 Pro vision can analyze a satellite/3D screenshot to identify obstructions

### 3. 3D Interactive Proposal (The Hero Moment)
- **CesiumJS** for rendering Google 3D Tiles in the browser — fastest path to "real house in 3D"
- Overlay solar panel meshes on detected roof segments
- **The 3D model IS the proposal**: click panels to add/remove, see costs update live, toggle battery storage, watch break-even shift in real-time
- Interactive: rotate, zoom, toggle panels on/off, drag to reposition
- Alternative: Three.js with `.glb` models if API keys are slow to provision

### 4. Proposal Generation
- **Gemini 3.1 Pro** (`gemini-3.1-pro-preview`) for heavy reasoning:
  - Analyze roof data → estimate system size, annual generation, costs
  - Generate human-readable proposal with ROI breakdown
  - Vision analysis of roof screenshots to identify obstructions
- **Gemini 2.5 Flash** (`gemini-2.5-flash`) for utility calls:
  - Quick address parsing, unit conversions, formatting
- Inputs: roof area, panel count, local electricity rates, solar irradiance
- Outputs: system cost, annual savings, payback period, 25-year ROI

### 5. Voice Narration
- **Gradium** voice AI reads the proposal aloud
- "Based on your roof in Brandenburg, we recommend 16 panels generating 8,200 kWh/year, saving you 1,400 EUR annually..."
- One API call — text in, audio out

### 6. Frontend (Lovable)
- Homeowner onboarding flow: address → electric bill → preferences
- 3D viewer (CesiumJS/Three.js embed)
- Proposal card with costs, savings, ROI
- Installer dashboard: list of customer proposals, editable parameters, margin controls

## Product Strategy

**Build both views in one flow:**
- **Homeowner view**: enters address → sees 3D → gets simplified proposal ("You'll save 1,400 EUR/year")
- **Installer view**: same engine but with a dashboard showing all customer proposals, editable parameters, margin controls

**For the hackathon: build the homeowner flow first** — it's the impressive demo. Then add an installer dashboard list view on top.

## Mobile-first delivery

Per `principles.md` we build mobile-first. Concretely:

- **Layout pattern**: full-bleed 3D viewer + floating UI. Address bar lives at the **bottom** on mobile (thumb reach), top on desktop. Result/proposal expands as a **bottom sheet** above the address bar.
- **Touch controls**: lock the camera to one-finger orbit + pinch zoom. No free-fly. Disable Cesium's right-click pan, double-click zoom-to-feature, etc. — they don't translate.
- **Viewport**: `viewport-fit=cover` + `100dvh` so the iOS bottom bar doesn't eat the address input. Safe-area insets on the bottom sheet.
- **Performance**: CesiumJS is heavy (~15MB initial). For mobile we (a) lower `maximumScreenSpaceError` to ~24 to stream fewer/coarser tiles, (b) pre-warm the demo address tiles, (c) keep `requestRenderMode: true` so the GPU only works when something changes. If CesiumJS still feels too heavy on mid-range Android, the fallback plan is to swap to **Three.js + `3d-tiles-renderer`** for a lighter bundle and fully custom touch UX.

## Key Risks + Mitigations

| Risk | Mitigation |
|------|-----------|
| Google 3D Tiles look soft at roof zoom | Hybrid: Google Tiles for context, our own roof mesh from Solar API DSM for close-up |
| Google 3D Tiles coverage gaps in Germany | Fall back to Reonic `.glb` photogrammetry models for demo addresses |
| Solar API doesn't cover the demo address | Pre-select addresses we know have coverage; hard-code fallback data |
| CesiumJS learning curve | Use CesiumJS ion quickstart; team member dedicated to this |
| CesiumJS too heavy on mid-range mobile | Lower screen-space error; pre-warm tiles; fallback to Three.js + 3d-tiles-renderer |
| Panel placement looks janky | Keep it simple — grid layout on largest roof segment, avoid over-engineering |
| Agent hallucinates geometry it can't see | Agent never sees raw mesh; only structured Solar API JSON + vision-tagged obstructions |
