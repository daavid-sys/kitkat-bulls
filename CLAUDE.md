# CLAUDE.md — AI Agent Instructions

## What is this project?
Hackathon project for Big Berlin Hack 2026 (Reonic Track). We're building an AI-native self-serve solar proposal tool. Homeowner enters address → their actual house appears as an interactive 3D model with solar panels auto-placed → instant cost/ROI proposal with voice narration.

## Read context first
Before doing any work, read `.context/index.md` — it links to everything you need:
- `.context/project.md` — what, why, who
- `.context/architecture.md` — tech stack, system flow
- `.context/constraints.md` — hackathon rules, deadlines, partner tech
- `.context/legacy.md` — what Reonic has today vs what we're building
- `.context/data.md` — datasets, APIs, 3D models available

## Key decisions made
- **Agent-native**: no fixed language preference, use whatever works best per component
- **Partner tech**: Google Deepmind (Gemini), Lovable (frontend), Gradium (voice)
- **3D**: CesiumJS with Google 3D Tiles, fallback to Three.js with Reonic .glb files
- **Panel placement**: greedy rectangle-packing on Solar API roof segments
- **Two views, one engine**: homeowner self-serve flow first, installer dashboard second
- **Demo-first mentality**: optimize for impressive 2-min demo, not production readiness

## The hero moment
The 3D model of the homeowner's actual house becomes an interactive proposal — panels auto-placed on the roof, click to add/remove, see costs update live. It's not just a static 3D house; it's a living, interactive proposal you can manipulate.

## Repo structure
```
.context/          — AI agent context files (start here)
Exp 3D-Modells/    — Reonic photogrammetry .glb files
ARCHITECTURE.md    — Detailed tech architecture
COMPETITORS.md     — Competitor analysis
HACKATHON.md       — Full hackathon rules & manual
LINKS.md           — Figma, APIs, partner tech links
REONIC_LEGACY_VS_AI.md — Legacy 17-step flow vs our AI-native flow
reonic_legacy_demo.json — Raw transcription of Reonic demo
```

## Working conventions
- Push to `main` directly (hackathon speed, no PR process)
- Commit often with descriptive messages
- Keep `.context/` updated as decisions change
- Design work happens in Figma: https://www.figma.com/design/O55TfkwpQd6DUg9Dhd8MzS/Kitkat-Bulls
