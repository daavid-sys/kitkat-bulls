# Principles — Core Experience First

These principles guide what we build *now* (and, just as importantly, what we don't).

## The core experience (current focus)

We are leaning toward building **one thing, end-to-end, and making it feel magical** before adding anything else. The core loop:

1. **Input** — homeowner enters their address and a short list of requirements (e.g. monthly bill, battery preference, budget ceiling).
2. **3D house** — their actual house appears as a real-time, interactive 3D model. It should look genuinely cool — this is the moment that makes a stranger lean in.
3. **One button** — the homeowner clicks a single button ("Design my system" / "Find the best setup").
4. **Agentic design** — an agentic system reasons over the roof, the requirements, and known constraints to figure out *the best solar panel infrastructure for this house*: which roof segments to use, how many panels, layout, optional battery, expected output. The result is rendered back onto the 3D model.

If a feature does not directly serve one of those four steps, it's out of scope for now.

## Principle 1 — The 3D house is the product

The 3D model isn't decoration. It's the canvas the agent reasons over and the surface the homeowner manipulates. Everything else (proposal text, ROI numbers, voice narration, installer dashboard) hangs off it.

Implication: invest disproportionately in making the 3D viewer feel premium — smooth load, nice lighting, clean camera moves, panels that look real on the roof.

## Principle 2 — One address in, one design out

The flow is *self-serve and one-shot*. The homeowner shouldn't have to draw on the roof, pick segments, or tune parameters before getting a result. They get a fully-designed system from a single click, then refine.

Implication: defaults must be opinionated. The agent decides; the user adjusts.

## Principle 3 — Agent-native, not form-native

We are not rebuilding Reonic's 17-step form. The agent reads the roof, reads the requirements, and produces a layout. Steps that exist only because legacy software couldn't reason are deleted.

Implication: when in doubt between "ask the user" and "let the agent decide and let the user override", choose the latter.

## Principle 4 — Demo-first, not production-first

We are optimizing for an impressive 2-minute demo on a known address, not for a robust system that handles every German postcode. Hard-coded fallbacks are fine. Pre-flighting the demo address is fine. Hand-tuning the camera path is fine.

Implication: don't spend time on edge cases the demo won't hit. Spend it on the hero moment.

## Principle 5 — Mobile-first, desktop-respectful

Homeowners look up their roof on their phone, not on a desktop. We design for **one-handed mobile use first** (thumb-reachable address bar at the bottom, big touch targets, bottom-sheet result panel) and let the desktop layout fall out of the same components at a wider breakpoint.

Implication: every new screen is mocked at 375×812 (iPhone width) before any desktop polish. The 3D viewer is full-bleed; UI floats over it. Anything that requires hover, right-click, or precise mouse aiming gets redesigned.

## Principle 6 — Build the spine before the skin

The current build order is:
1. **3D visualization layer** — address input → real 3D model rendered in the browser. *(in progress)*
2. **Agentic design layer** — button → agent → panel layout overlaid on the model.
3. **Proposal layer** — costs, ROI, voice narration.
4. **Installer view** — same engine, dashboard skin.

Don't jump ahead. Each layer should work on a real address before the next one starts.

## Out of scope (for now)

- Installer dashboard / multi-customer views
- PDF export, e-signature, CRM integration
- Authentication, accounts, persistence
- Multiple addresses, batch processing
- Editing the 3D model geometry itself (we *overlay*, we don't *remodel*)

These are great. They are not what we are building this week.
