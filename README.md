# Repair

A private, offline-first mobile app that helps someone track conflict with their
partner in a way that **shortens time-to-repair** and **grows the positive
interaction base** — rather than accumulating a record of grievances.

This repository contains **Phase 1 (MVP)** as scoped in `docs/SPEC.md` §12: solo
mode, no backend, no accounts, no partner linking. The full product specification
in `docs/SPEC.md` is authoritative; `PLAN.md` records the build plan and every
decision made where the spec was ambiguous.

## Why there is no backend

Zero backend is a deliberate design choice. It makes the Phase 1 privacy
guarantees **structural rather than promised**: all data lives on the device,
encrypted at rest, and the app makes **no network calls whatsoever**. A CI check
(`scripts/check-no-network.mjs`) fails the build if any network primitive appears
in application source.

## Stack

- **Expo (React Native) + TypeScript + expo-router** (file-based routing)
- **expo-sqlite + Drizzle ORM** — all data local to the device
- **expo-secure-store** for the encryption key; field-level encryption for
  narrative, behaviour, cycle and assessment data
- **expo-local-authentication** for the PIN/biometric gate
- **Zustand** for UI state · **date-fns** · **react-native-svg** + **victory-native**
- **Vitest** for logic and guardrail tests · **React Native Testing Library** (Jest)
  for components
- No analytics SDK. No crash-reporting SDK that transmits payloads.

## The non-negotiables

These are the reason the product exists (see `PLAN.md` §9 for how each is enforced):

1. No partner-rating fields exist anywhere in the schema.
2. No raw export (no share sheet, CSV, PDF, or copy-all).
3. No severity ranking or sorting; the timeline is chronological only.
4. The cooldown gate is a hard gate.
5. The safety screen runs before any relationship content.
6. Positive logging is first-class and lowest-friction.
7. No streaks, no gamification, no guilt notifications.

## Getting started

```bash
npm install
npm start            # Expo dev server
```

## Checks

```bash
npm run check:no-network   # fails if any network primitive appears in src/ or app/
npm run lint
npm run typecheck
npm run test:logic         # Vitest: metrics, rules, and the six guardrail tests
npm run test:components    # Jest + RNTL component tests
npm test                   # no-network guard + logic suite
```

## Layout

```
app/            expo-router routes (onboarding + 5 tabs)
src/db/         Drizzle schema (one file per §6 table group), enums, repositories, crypto
src/lib/        metrics/ · interventions/ · safety/ · assessments/ · notifications
src/design/     design tokens and theme (warm, calm, WCAG AA, full dark mode)
src/components/ shared UI primitives
src/copy/       exact wireframe copy from the spec, centralized for clinical audit
docs/SPEC.md    authoritative product specification
PLAN.md         build plan and decisions
```
