# AstroHealth motion system

Every motion has a job. One easing curve (`--ease: cubic-bezier(.2,.7,.2,1)`), four duration tiers, and nothing loops
except where the loop *means* something.

| Tier | Duration | Used for |
|---|---|---|
| Feedback | 120–200 ms | button press (`scale .97`), hover colour, dropdown/dialog backdrop |
| State | 280 ms | card lift on hover (−3 px), step-circle fill, progress-bar width changes |
| Entrance | 450–480 ms | page transition (10 px rise), scroll reveal (14 px rise, once), dialog pop |
| Hero | 700–1200 ms | banner image settle (scale 1.06→1), mission progress grow, chart draw (700 ms) |

**Stagger:** `index × 60 ms`, capped at 360 ms, so a full grid is never slower than ~0.8 s.

## What moves — and why
| Motion | Purpose |
|---|---|
| 3D hero: slow auto-rotate (0.05 rad/s), Earth spin, orb bob ±0.06 | Shows the model is live; slow enough not to distract. Pausable. Pauses when off-screen or tab hidden. |
| 3D focus ease (~4/s) + selection scale (~8/s) | Tells the user *which* domain they chose. |
| Critical alert pulse | **Urgency only.** The only infinite attention animation in the app. |
| Indeterminate orbit loader | Honest "working" signal. **No percentages, no fake progress.** |
| Answer feedback (bump / shake, 280–320 ms) | Puzzle correctness cue (text label always shown too). |
| Chart entrance | Draws data once on load; disabled for reduced motion. |

## Deliberately NOT animated
- **Medical values never count up or tick.** A reading must never flash a wrong number such as "0 BPM" on its way to the real one.
- No parallax, no cursor effects, no looping decoration — the crew may be using the UI while the cabin vibrates.

## Reduced motion (`prefers-reduced-motion: reduce`)
CSS durations collapse to ~0, reveals are visible immediately, charts do not animate, and the 3D scene performs **no autonomous motion**
(it renders a still frame and only re-renders in response to the user's own drag/tap). Print always shows everything.

## Performance
The 3D scene is code-split (loaded only on the dashboard), caps pixel ratio at 1.75, stops its render loop when off-screen or hidden,
and falls back to a static SVG if WebGL is unavailable. The same information is always available through real buttons.
