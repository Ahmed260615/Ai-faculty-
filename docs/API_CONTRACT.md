# AstroHealth API contract (frontend ⇄ Express)

The browser talks **only to Express** (`VITE_API_BASE_URL`). Express validates, calls the FastAPI model service,
persists the report in PostgreSQL and returns it. When `VITE_API_BASE_URL` is empty (or `VITE_USE_MOCK=true`) the
UI uses the **demonstration** layer in `src/services/mock/` — nothing there is real data or a real AI prediction.

```
React → Express → FastAPI model → Express → PostgreSQL → React
```

## Assessments
`POST /assessments/:type` — `type` ∈ `radiation | emergency | gravity | nutrition | respiration`
Body: flat object keyed by the field `key`s in `src/config/assessments.js`. The frontend allows 45 s (`AI_TIMEOUT_MS`).

Response:
```jsonc
{
  "reportId": "RPT-2026-0123",
  "status": "NORMAL | WARNING | CRITICAL",
  "riskScore": 41,                    // 0–100, optional
  "condition": "…",                   // predicted health condition
  "confidence": 0.87,                 // ONLY if the model returns it (never invented by the UI)
  "factors": ["…"],                   // contributing factors, if supported
  "recommendations": ["…"],           // if returned by the service
  "subRisks": [{ "label": "Bone Health", "status": "WARNING", "score": 40 }],
  "comparison": { "previousId": "…", "previousScore": 29, "previousStatus": "NORMAL", "previousDate": "ISO" },
  "source": "api"                     // "demo" is set only by the mock layer
}
```
Errors: non-2xx → "API Error" state; request timeout → "Timeout" state; both offer Retry and keep the user's entries.

## Reports (immutable once finalised)
- `GET /reports?type=&status=&from=&to=` → report list
- `GET /reports/:id` → full report (`measurements[]`, `abnormal[]`, `prediction`, `previous`, `version`, `superseded`)
- `POST /reports/:id/amendments` `{ note }` → creates a **new version** (`supersedes: id`); the original row is never updated.

## Psychological
- `POST /assessments/psychological/phq9` `{ answers[9], total, severity, item9, difficulty, assessedAt }` (scoring is deterministic, not AI)
- `GET /assessments/psychological/phq9/history` → `[{ date, total, severity, id }]`
- `GET|POST /psychological/checkins`

## Other
`GET /astronaut/profile`, `GET /dashboard/summary`, `GET /dashboard/analytics?days=`, `GET /notifications`,
`GET /emergency/last-vitals`, `GET /respiration/history?days=`.

## Safety rules implemented in the UI
- Critical emergency/respiratory values raise a local alert **immediately**, before and independent of the AI call.
- Protocol limits in `src/config/assessments.js` are demonstration values — replace with the approved spacecraft protocol.
- Laboratory reference intervals are configurable per field; biomarkers without an accepted interval (γ-H2AX, Comet, Micronucleus) have none.
