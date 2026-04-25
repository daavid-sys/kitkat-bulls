# Available Data & Resources

## Reonic Photogrammetry Models
Location: `Exp 3D-Modells/`
- `3D_Modell Brandenburg.glb` (27 MB)
- `3D_Modell Hamburg.glb` (5 MB)
- `3D_Modell North Germany.glb` (5.5 MB)
- `3D_Modell Ruhr.glb` (9.8 MB)

These are photogrammetric 3D models of real German houses. Load with Three.js GLTFLoader or CesiumJS. Use as fallback when Google 3D Tiles doesn't cover the address.

## Reonic Customer Dataset
Provided by Reonic (location TBD — check with team). Contains:
- Real residential energy systems
- Input conditions: energy demand, electricity price, EV usage, existing heat pump, etc.
- Final designs: components sold/planned per project variant

## Google Solar API
- `buildingInsights` — roof segments, solar potential, panel configs, financial estimates
- `dataLayers` — granular solar data, DSM (digital surface model), shading
- `geoTiff` — encoded solar rasters
- Docs: https://developers.google.com/maps/documentation/solar/overview
- Live demo: https://gmp-environmental-solar.web.app/

## Google 3D Tiles API
- Photogrammetric 3D meshes of real buildings worldwide
- Render with CesiumJS (recommended) or Three.js
- Costs refunded by Reonic organizers
- Docs: https://developers.google.com/maps/documentation/tile/3d-tiles

## Reonic Legacy Demo
Location: `reonic_legacy_demo.json`
- Full transcription of Reonic's current product demo video
- Word-level timestamps, speaker IDs
- Analysis: see `REONIC_LEGACY_VS_AI.md` and `.context/legacy.md`
