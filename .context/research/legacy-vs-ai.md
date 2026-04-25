# Reonic Legacy Flow vs. AI-Native Flow

## What Reonic Has Today (from demo transcription)

The current flow is **installer-operated**, with ~15 manual steps across multiple screens. The installer does everything; the homeowner never touches the tool.

### Step-by-step breakdown

| # | Step | Who | Time est. | What happens |
|---|------|-----|-----------|-------------|
| 1 | **Lead funnel: address** | Installer or homeowner | 30s | Enter address, select/confirm house |
| 2 | **Lead funnel: energy profile** | Installer or homeowner | 1 min | Household size, consumption trend, existing solar (yes/no), heating question, EV ownership, annual mileage, EV charger |
| 3 | **Lead funnel: product selection** | Installer or homeowner | 30s | Check boxes: PV system, battery storage, EV charger. See basic simulation on the left |
| 4 | **Lead funnel: inquiry submission** | Homeowner | 30s | Contact info, building ownership, data protection consent |
| 5 | **Portal: lead processing** | Installer | 2 min | Lead appears in CRM. Open it up, review contact data |
| 6 | **Pre-qualification call** | Installer | 5-10 min | Customizable call guideline: what they want, timeline, ownership, notes. Mark as completed |
| 7 | **Create offer** | Installer | 30s | Click "Offer", optional consultation questionnaire |
| 8 | **3D planning: load map** | Installer | 30s | Open 3D editor, switch between Google/Apple map materials, load Google Solar/Earth 3D data (3-5 sec) to see tree heights and building context |
| 9 | **3D planning: DRAW ROOF MANUALLY** | Installer | 3-5 min | Click "Draw Roof", trace outer edges of roof with mouse clicks. System tries to assemble a roof shape. Manual adjustments: flatten sides, move lines, correct measurements. Use ruler tool to verify |
| 10 | **3D planning: add obstructions** | Installer | 1 min | Manually add chimney, vents, etc. |
| 11 | **3D planning: place modules** | Installer | 2 min | Manually place/drag solar panels onto roof, adjust positioning |
| 12 | **Inverter selection** | Installer | 2 min | Select inverter based on system size (~4kW → 5kW inverter), draw string, assign MPP tracker, verify voltage range |
| 13 | **Component planning** | Installer | 2-3 min | Import planning package OR add components individually (installation fees, accessories, etc.) |
| 14 | **Battery storage** | Installer | 1 min | Add via planning package (battery + interconnect + control unit) |
| 15 | **Review simulations** | Installer | 1 min | Energy flow visualization, economy/break-even analysis (e.g. 4 years, ~6k investment), feed-in and grid usage |
| 16 | **PDF offer generation** | Installer | 2 min | Finalize & preview. Customizable layout: cover letter, colors, page order, MCS standardization, data sheets, system photo, components, simulation, profitability |
| 17 | **Send & sign** | Installer → homeowner | 1-2 min | Download/print for physical signature OR send digital signature request. Confirmation email on signature |

**Total installer time: ~25-35 minutes per lead**

---

## What STAYS (non-negotiable, even in an AI-native world)

These are the things that matter regardless of how smart the tool gets:

| What | Why it stays |
|------|-------------|
| **Address input** | You need to know which house. This is the entry point |
| **Energy profile basics** | Household size, consumption, EV ownership — these drive the system sizing. But they can be inferred/pre-filled |
| **Product selection intent** | PV, battery, EV charger — the homeowner needs to express what they want |
| **Roof geometry** | You must know the roof shape, pitch, orientation, and obstructions to place panels. The question is WHO does this work |
| **Component/inverter selection** | A real system needs real components. But this can be AI-selected based on system size |
| **Financial analysis** | ROI, break-even, costs — this is the core value prop for the homeowner. Stays, but should be instant |
| **Legal/consent** | Data protection, building ownership — regulatory requirement |
| **Offer document** | The homeowner needs something to sign. But it doesn't have to be a slow PDF |

---

## What GOES (killed by AI)

| Legacy step | How AI kills it | Time saved |
|-------------|----------------|------------|
| **Manual roof drawing** (step 9) | Google Solar API returns roof segments automatically. Google 3D Tiles provides photogrammetric model. Gemini vision can detect obstructions from satellite/3D imagery. **Zero manual tracing.** | 3-5 min → 0 |
| **Manual obstruction marking** (step 10) | AI detects chimneys, vents, trees from 3D model / satellite image | 1 min → 0 |
| **Manual module placement** (step 11) | Greedy rectangle-packing algorithm auto-places panels on detected roof segments, avoiding obstructions | 2 min → 0 |
| **Inverter selection** (step 12) | AI selects optimal inverter based on system size from Reonic's component database. String design is algorithmic | 2 min → 0 |
| **Component planning** (step 13) | AI assembles full BOM (bill of materials) from planning packages based on system config | 2-3 min → 0 |
| **Pre-qualification call** (step 6) | The homeowner self-qualifies through the onboarding flow. If needed, Gradium voice agent can do the qualification call | 5-10 min → 0 |
| **Lead processing in portal** (step 5) | Lead goes straight from submission to auto-generated proposal. Installer reviews, doesn't build from scratch | 2 min → 0 |
| **PDF generation wait** (step 16) | Proposal is a live interactive page, not a static PDF. Instant | 2 min → instant |

---

## The AI-Native Flow (Our Hackathon Build)

### Homeowner experience (< 2 minutes total)

```
1. Enter address                          [5 sec]
     ↓
2. See your house in 3D instantly         [3 sec — Google 3D Tiles / .glb]
     ↓
3. Quick profile: household size,         [30 sec — smart defaults, minimal questions]
   electric bill, EV, what you want
     ↓
4. AI auto-detects roof, places panels,   [5 sec — Solar API + placement algorithm]
   shows them on YOUR 3D house
     ↓
5. See proposal: cost, savings/year,      [instant — Gemini generates from data]
   break-even, 25-year ROI
     ↓
6. Gradium voice walks you through it     ["You'll save €1,400/year with 16 panels..."]
     ↓
7. Refine: add/remove panels, toggle      [interactive — drag panels, see numbers update]
   battery, change preferences
     ↓
8. Submit to installer OR sign digitally  [one click]
```

### Installer experience

```
Dashboard: see all auto-generated proposals from homeowners
  → Review AI-designed system
  → Adjust margins, swap components, override panel placement
  → Approve & send final offer
  → Track signature status
```

### What changes for the installer

| Before (legacy) | After (AI-native) |
|-----------------|-------------------|
| 25-35 min per proposal | **Review & approve in 2 min** |
| Draw every roof manually | AI did it, installer just verifies |
| Select every component | AI selected, installer overrides if needed |
| Build PDF from scratch | Live proposal already sent to homeowner |
| Call to pre-qualify | Homeowner self-qualified through flow |
| One lead at a time | **Batch review dozens of AI-generated proposals** |

---

## The "10x moment" for the demo

The single most impressive comparison:

> **Legacy**: Installer spends 5 minutes manually tracing a roof outline, dragging panels one by one, selecting an inverter, checking voltage ranges...
>
> **Us**: Homeowner types an address. Their actual house appears in 3D — and it's not just a model, it's an **interactive proposal**. Panels are already on the roof. Click to add or remove them, see costs update live. A voice says "Based on your roof, we recommend 16 panels saving you €1,400 per year." Toggle battery storage, see the break-even shift. The 3D model IS the proposal.
>
> **That's the 2-minute demo.**
