# Competitor Landscape (Updated — AI Deep Dive)

Our initial assumption was wrong: these tools are NOT just manual installer tools anymore. Most have shipped serious AI features. But the gap still exists — it's just narrower and more specific than we thought.

## How AI-native are they really?

### Aurora Solar — Most AI-advanced incumbent
- **AI Roof**: auto-generates 3D roof model in <15 sec using HD imagery + LiDAR. Detects obstructions (chimneys, vents, skylights) automatically
- **Auto panel placement**: fits max panels considering size, tilt, spacing, obstacles, walkways
- **Web Proposals**: sends homeowner an interactive, mobile-friendly proposal link (not just PDF). Tracks when they view it
- **Self-serve?** Partially. The installer triggers the AI design, then sends a web proposal to the homeowner. The homeowner can VIEW and SIGN but cannot self-initiate or modify the design
- **What they DON'T have**: homeowner-initiated flow. No "type your address and see panels on your house" without an installer in the loop
- [Aurora AI](https://aurorasolar.com/aurora-ai/) | [AI Roof API docs](https://docs.aurorasolar.com/reference/ai-roof) | [Web Proposals](https://help.aurorasolar.com/hc/en-us/articles/14883209518995)

### OpenSolar 3.0 + Ada — Closest to what we're building
- **Ada AI assistant**: voice-activated design commands, auto-generates multiple system configs in seconds
- **Auto Design**: AI calculates pitch, azimuth, shading automatically. Generates bill of materials for every project
- **AI Lead Gen (BETA)**: homeowner enters address + consumption on installer's website → Ada auto-creates system design → presents savings summary. **This is basically what we're building.**
- **Sales Machine Proposal**: customer-facing interactive proposal with lifetime savings projections
- **Self-serve?** YES, via AI Lead Gen. But it's beta, and the 3D visualization is basic — no photogrammetric 3D of the actual house
- **What they DON'T have**: real 3D house model (they use flat/simple 3D), no voice narration, no interactive panel manipulation by homeowner
- [OpenSolar Auto Design](https://www.opensolar.com/auto-design/) | [Ada Voice](https://support.opensolar.com/hc/en-us/articles/13785730896911) | [AI Lead Gen](https://www.opensolar.com/ai-lead-gen/) | [OS 3.0 Launch](https://www.opensolar.com/post/news/opensolar-launches-os-3-0-the-worlds-first-free-ai-powered-solar-operating-system/)

### SurgePV — Fastest AI roof detection
- **Auto-roof**: AI creates 3D roof model in 15-30 sec with LiDAR, ±1° pitch accuracy, multi-plane support, obstruction mapping
- **Design time reduction**: claims 70% reduction vs manual
- **Integrated workflow**: design + electrical engineering (SLD) + shading + proposals in one tool
- **Self-serve?** No — purely installer-facing
- [SurgePV Solar Design](https://www.surgepv.com/solar-designing)

### Arka 360 — Best customer interaction model
- **AI auto-design**: reduces layout time by up to 80%. 95%+ accuracy
- **Virtual survey link**: installer sends link to homeowner, who can pinpoint locations and upload photos
- **Premium 3D proposals**: homeowner sees what panels look like
- **Self-serve?** Partial — homeowner participates in data collection, but installer drives the design
- **Generates proposals in <5 min** with AI-powered quotes including energy storage + financial analysis
- [Arka360](https://www.arka360.com/) | [AI Solar Layouts 2026](https://www.arka360.com/ros/how-ai-speeds-up-solar-layout-design-for-epcs)

### Google Project Sunroof / Solar API
- **Building Insights API**: returns roof segments, solar potential, panel configs, financial estimates
- **Data Layers**: granular solar data, digital surface model, shading analysis
- **Self-serve?** The API is the infrastructure — Google's own demo is just a 2D heatmap
- **What it DOESN'T have**: no 3D visualization, no proposal generation, no panel placement UI
- [Solar API docs](https://developers.google.com/maps/documentation/solar/overview) | [Demo](https://gmp-environmental-solar.web.app/)

## Updated competitive matrix

| Tool | AI Roof Detection | Auto Panel Placement | Homeowner Self-Serve | Real 3D House | Interactive Proposal | Voice |
|------|:-:|:-:|:-:|:-:|:-:|:-:|
| **Aurora Solar** | Yes (15 sec) | Yes | No (installer sends link) | No (simple 3D) | Partial (view only) | No |
| **OpenSolar 3.0** | Yes (Ada) | Yes | **Yes (AI Lead Gen beta)** | No (basic 3D) | Yes (Sales Machine) | **Yes (Ada voice)** |
| **SurgePV** | Yes (15-30 sec) | Yes | No | No | No | No |
| **Arka 360** | Yes | Yes | Partial (virtual survey) | Partial (3D proposals) | Partial | No |
| **Google Solar API** | Yes (data only) | No | N/A (API) | No | No | No |
| **Us (KitKat Bulls)** | Yes (Solar API + Gemini) | Yes (algorithm) | **Yes (full self-serve)** | **Yes (Google 3D Tiles)** | **Yes (interactive 3D)** | **Yes (Gradium)** |

## The REAL gap we're filling

~~"Nobody has AI"~~ — wrong, they all do now.

The real gap: **Nobody has a homeowner-initiated flow where your actual house appears as a photogrammetric 3D model that becomes an interactive proposal with panels you can manipulate.**

- OpenSolar's AI Lead Gen is closest but their 3D is basic and it's still beta
- Aurora has great AI but the homeowner can only view, not initiate or interact
- Nobody uses Google 3D Tiles / photogrammetry for the actual house visualization
- Nobody has voice narration of the proposal (OpenSolar has Ada voice for design commands, not proposal narration)

**Our differentiator is the experience, not the AI.** The "wow" is: type an address → see YOUR actual house in photogrammetric 3D → panels appear on YOUR roof → voice explains YOUR savings → click to adjust → submit. That full self-serve, visually stunning loop doesn't exist today.
