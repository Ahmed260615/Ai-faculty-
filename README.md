# AstroHealth — Astronaut Health Monitoring Dashboard (frontend)

React + Vite + Tailwind + Chart.js + React Router + Axios + Lucide.

```bash
npm install
npm run dev        # http://localhost:5173 — demonstration data layer (no backend needed)
npm run build
```

Configure `.env` (see `.env.example`): `VITE_API_BASE_URL` points at the Express API; leave empty for demo mode.
Append `?simulate=timeout` or `?simulate=error` to any assessment URL in demo mode to preview those UI states.

- `src/services/*` — one service per module; all HTTP goes through `services/api.js` → Express. See `docs/API_CONTRACT.md`.
- `src/config/assessments.js` — measurement forms, reference ranges, protocol limits.
- `src/components/*` — shared components (layout, medical, data, ui).
- `public/images/reference/*.jpg` — the five page banners (radiation, emergency, psychological, gravity, nutrition).

**Not included:** the Express/PostgreSQL backend and the FastAPI model. Every mock result is labelled as demonstration data.
