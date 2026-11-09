# Seed Design Document
SOURCE: supahero.io/gallery/pos20-precision-studio | GALLERY: supahero.io | DATE CRAWLED: 2026-11-09 | PAGES VISITED: [home, laboratory, showcase, docs]

## 1. Concept and voice
- Big idea in one sentence: A forensic surgical dissection of web choreography rendered as an architectural calibration instrument.
- Tone of copy: Direct, technical, uncompromising. Zero marketing buzzwords. Every sentence describes measurable behavior.

## 2. Color system
| Token/role | Hex | Approx. share of screen | Used for |
|---|---|---|---|
| Background Base | #FFFFFF | 65% | Primary canvas surface |
| Ink Heavy | #0A0A0C | 25% | Typography, deep solids, crisp hairlines |
| Structural Muted | #F4F4F6 | 7% | Code backgrounds, interactive canvas stage |
| Spot Accent | #FF3B00 | 3% | Cadmium vermilion accent: callouts, active nodes, curves |

- Contrast structure: 18.2:1 contrast ratio between heavy ink `#0A0A0C` and white surface `#FFFFFF`.
- Zero gradients: pure solid fills, crisp 1px mechanical hairlines, crisp inverted color blocks.

## 3. Typography
| Role | Family | Size | Weight | Line-height | Tracking | Case |
|---|---|---|---|---|---|---|
| Display Hero | Bodoni Moda | clamp(3.5rem, 9vw, 9.5rem) | 900 Italic | 0.92 | -0.04em | Title/Mixed |
| Section Headline | Familjen Grotesk | clamp(2rem, 4.5vw, 4.2rem) | 700 | 1.05 | -0.03em | Upper/Mixed |
| Subhead / Lead | Familjen Grotesk | clamp(1.1rem, 1.8vw, 1.5rem) | 500 | 1.4 | -0.01em | Mixed |
| Body / Narrative | Familjen Grotesk | 1.05rem | 400 | 1.55 | 0 | Mixed |
| Mechanical Code | Fira Code | 0.85rem | 500 | 1.45 | -0.01em | Monospace |
| Micro Label | Fira Code | 0.72rem | 600 | 1.2 | +0.08em | UPPERCASE |

## 4. Layout and spacing
- Grid: 12-column architectural grid with 24px gutters, max-width 1440px.
- Spacing rhythm: 8px baseline grid (8, 16, 24, 48, 80, 120, 160px).
- Navigation: NOT a top bar. Bottom floating mechanical dock HUD (`#0A0A0C` pill with active indicator and quickjump telemetry).
- Pinning structure: Pinned horizontal scrub stages and pinned multi-layer forensic layer explosions.

## 5. Components
- Interactive sampler simulator: real-time curve drawing canvas with live GSAP easing playback.
- Build showcase gallery: interactive sandbox cards where visitors can trigger and scrub transplanted animations (Cards Fan, Magnetic Skew, Kinetic Split, Inertia Drag).
- Code console & Snippets: interactive tabs with copy actions for Snippet A (Discover), Snippet B (Sampler), Snippet C (Fit), and CLI commands.
- Community build submitter modal / form: allows users to submit their transplant demo URLs and specs.

## 6. Motion spec
- Core Library: GSAP 3.12.5, ScrollTrigger, CustomEase, Lenis 1.1.18.
- Easings:
  - `power3.out` (0.215, 0.61, 0.355, 1) - snappy enters
  - `power4.inOut` (0.77, 0, 0.175, 1) - stage transitions
  - `back.out(1.4)` - tactile overshoot on card snaps
  - `none` - scroll scrubbed real-time synchronization
- Animation catalog:
  1. Hero reveal: staggered upward translation (y: 80 -> 0) + clip reveal on display serif.
  2. Velocity skew: dynamic skewY based on Lenis/GSAP scroll velocity clamped between -8deg and +8deg.
  3. Pinned 4-Layer Forensic Explode: pin trigger on scroll, scrubbing 4 stacked layers (Reference -> DOM skeleton -> Fit curve -> Clean code) separating horizontally and in 3D perspective.
  4. How-It-Works 6-Phase Pinned Step Sequencer: left column pinned with active phase telemetry while right column steps through Locate, Capture, Spec, Rebuild, Verify, Integrate.
  5. Interactive Curve Visualizer: SVG parametric path drawing with animated scrubber dot matching DOMMatrix samples.
  6. Build Showcase Cards: live hover/scrub triggers with interactive speed slider and real-time DOMMatrix transform readout.

