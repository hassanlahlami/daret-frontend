# Changelog — Daret Frontend

All notable changes to the Daret web app. Versioning is
[SemVer](https://semver.org/); dates are ISO-8601.

## [1.0.0-rc] — 2026-07-05

First release candidate. Next.js 14 (App Router) + TypeScript + Tailwind +
next-intl (**fr / ar / darija**, RTL) + TanStack Query, on a JWT session layer
with a role guard and a cohesive design system.

### Pages & flows
- Auth (login/register), KYC submission with CNDP consent.
- Circle discovery with sharia/amount filters + invite-only lock badge.
- Circle detail: join, fee preview, invites, vouching, payout-rotation order,
  raise-dispute form.
- Member dashboard: score gauge, vouches, pay-now, score-trend chart.
- Notification center with unread badge.
- Compliance console: audit timeline + integrity, KYC queue, AML flags,
  disputes, **erasure-request review**.
- Admin console: overview, circles, users, fees, ops, **analytics** (BarChart).
- **`/mes-donnees`** — CNDP data rights: export personal data (JSON download +
  summary) and file a right-to-erasure request (F1).
- Public `/securite` trust page.

### Design & i18n
- Brand teal + amber accent, Inter, custom `BarChart` / `ScoreGauge` / `Stepper`
  / `AuditTimeline` components (no chart lib; built per the dataviz mark specs).
- Full fr / ar / darija message catalogs with RTL.

### Release closeout (F2)
- Version bump to `1.0.0-rc`, README status badges, this changelog,
  `v1.0.0-rc` tag.

### Verification
- `npm run build` green; Playwright E2E **19 passed + 1 skipped** against a
  seeded backend jar.
