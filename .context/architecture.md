# Architecture

## Partner technologies (hackathon requirement: min 3)
1. **Google Deepmind (Gemini Flash)** — AI backbone: roof analysis, proposal generation, agent reasoning
2. **Lovable** — Rapid frontend builder: onboarding flow, 3D viewer embed, proposal cards
3. **Gradium** — Voice AI: narrates proposals for demo wow-factor

## System flow
```
Address → Google Solar API (roof segments, solar potential)
            ↓
        Google 3D Tiles / Reonic .glb (photogrammetric 3D model)
            ↓
        CesiumJS (browser 3D viewer) + panel placement algorithm
            ↓
        Gemini Flash (roof analysis → proposal text + ROI)
            ↓
        Gradium (voice narration of proposal)
            ↓
        Lovable frontend (onboarding + 3D embed + proposal card)
```

## Key APIs
- **Google Solar API** — `buildingInsights` endpoint: roof segments, panel configs, financial analysis from lat/lng
- **Google 3D Tiles API** — photogrammetric 3D meshes of real buildings, rendered with CesiumJS
- **Gemini Flash** — vision + reasoning, ~100ms/call, free tier 15 req/min
- **Gradium** — text-to-speech, one API call

## Frontend
- Built with **Lovable** (AI app builder, React + Tailwind)
- 3D viewer: **CesiumJS** (geospatial-native, handles 3D Tiles out-of-box)
- Fallback 3D: **Three.js** with GLTFLoader for Reonic .glb files

## Panel placement
- Greedy rectangle-packing on roof segments from Solar API
- No ML needed — Solar API provides segment boundaries
- Optional: Gemini vision for obstruction detection from satellite imagery

## Two product surfaces, one engine
- **Homeowner view**: address → 3D → simplified proposal
- **Installer view**: dashboard of AI-generated proposals, editable params, margin controls
- Hackathon priority: homeowner flow first, installer dashboard second
