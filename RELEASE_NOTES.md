# Daret — Release Notes

## v1.0.0-rc — 2026-07-05

**Daret** is a digital *daret* (Moroccan rotating savings / ROSCA) platform: a
group of people contribute a fixed amount each cycle and take turns receiving
the pooled pot. This is the first **release candidate** — feature-complete for
the MVP plus the full post-MVP extension set, hardened for a regulated launch.

> ⚠️ **Money is mocked.** Every cash movement goes through a `PaymentProvider`
> port with a mock adapter. The platform never holds or moves real funds; wiring
> a licensed PSP is the one remaining launch-blocker (see *Parking lot*).

### What's in the box

**For members**
- Join or discover circles (filter by amount / sharia-compliant), request a slot.
- See fees before committing (transparent fee preview).
- A dashboard: credit score + trend, upcoming obligations with **pay-now**,
  payout rotation order, vouches received.
- In-app notifications, dispute flow, and full **CNDP data rights** — export
  your data or request erasure at `/mes-donnees`.
- Trilingual UI: **French, Arabic, Darija** with proper RTL.

**For compliance & ops**
- Tamper-evident **hash-chained audit log** with one-click integrity check.
- KYC review queue, AML flags, dispute resolution, erasure-request review.
- Admin console: overview, circles, users, fee schedules, ops actions, analytics.

**Under the hood**
- Double-entry ledger with derived balances and a sign-aware platform cut.
- Async settlement via HMAC-signed PSP webhook + idempotent poll reconciler.
- Pluggable scoring with a score gate, gap-fill exposure caps, and a default
  sweep.
- Security: JWT auth with refresh, login lockout, CSP/HSTS headers.

### Reliability
- Actuator liveness/readiness probes and graceful shutdown.
- A committed **k6 smoke script** (`../Backend/ops/k6-smoke.js`).

### Verification at tag time
- Backend: 23 unit tests + Testcontainers integration suite; migrations at V12.
- Frontend: production build green; Playwright E2E **19 passed + 1 skipped**.

### Parking lot (post-1.0, needs external infra)
Real PSP adapter, real SMS/web-push, Redis-backed rate-limit/lockout,
Keycloak/MFA/Vault, scoring-v2 (ML), TigerBeetle, native mobile, multi-currency.
