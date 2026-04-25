# Architecture

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

## Key Risks + Mitigations

| Risk | Mitigation |
|------|-----------|
| Google 3D Tiles coverage gaps in Germany | Fall back to Reonic `.glb` photogrammetry models |
| Solar API doesn't cover the demo address | Pre-select addresses we know have coverage; hard-code fallback data |
| CesiumJS learning curve | Use CesiumJS ion quickstart; team member dedicated to this |
| Panel placement looks janky | Keep it simple — grid layout on largest roof segment, avoid over-engineering |
