# PLAN — Repair, Phase 1 (MVP)

This plan implements **Phase 1 only** of `docs/SPEC.md`: solo mode, offline-first,
no backend, no accounts, no partner linking. Where the build prompt and the spec
disagree, the spec wins on clinical and data-model questions; the prompt wins on
stack and scope. This document is the checkpoint required before any implementation
code is written.

---

## 0. Repo layout — RESOLVED

**Decision (confirmed with owner):** the Repair app is a **fresh, standalone project
with nothing to do with the Nyawira marketing site** that previously occupied this repo.
It is built **at the repo root on branch `claude/repair-phase-1-mvp-zo67sg`**; the
Nyawira marketing files are removed from this branch only. The marketing site remains
fully intact on `main` — nothing is lost. This branch's PR is the standalone app.

Consequently the prompt's `src/…` paths are honoured verbatim (no subdirectory prefix).

---

## 1. Scope reconciliation (prompt vs. spec §12)

The prompt's Phase-1 screen list is slightly wider than spec §12. Where they differ,
the prompt wins on scope (it says so). Resolved Phase-1 screen set:

**In:** S-01…S-05 (onboarding), S-06, S-07, S-08, S-09, S-10, **S-11…S-18** (full
seven-step deep log incl. S-15 cycle/emotion and S-16 attribution), S-19, S-20, S-21,
S-22, S-24, S-26 (partial), S-27, S-29, S-31, S-34, S-35.

**Out (Phase 2+):** S-23 cycle map, S-25 perpetual issues, S-28 Aftermath, S-30 Dreams,
S-32 assessments beyond CSI-16 baseline, S-33 & S-36 sharing, S-36 shared view,
therapist features.

Two reconciliations worth calling out:

- **S-16 (attribution).** Prompt: *build the screen, stub the classification.* Spec §12
  excludes S-16 but the prompt includes it as deep-log step 6. Resolution: build the
  S-16 screen; capture the two free-text fields; **stub** the Fincham & Bradbury
  classifier (`attribution_index`, locus/stability/globality/intentionality) as a
  no-op that stores nulls. No NLP in Phase 1.
- **S-20 (repair follow-up).** Prompt includes it; spec calls it "push-triggered." With
  **no network**, "push" is served by **local** notifications (`expo-notifications`
  schedules on-device, no server) plus an in-app Home card. Same for R-03/R-04/R-17
  timing.

---

## 2. Stack (from the prompt)

- **Expo (React Native) + TypeScript + expo-router** (file-based routing).
- **expo-sqlite + Drizzle ORM**, local only. Drizzle migrations via `drizzle-kit`.
- **expo-secure-store** holds the per-user encryption key; **field-level encryption**
  on sensitive columns (see §5). *Decision: field-level, not SQLCipher* — see Decisions.
- **expo-local-authentication** for the PIN/biometric app-launch gate.
- **Zustand** for UI/session state. No TanStack Query (no network).
- **date-fns**; **react-native-svg** + **victory-native** for charts (S-07, S-26).
- **expo-clipboard** for the only outbound content (S-10, S-29 scripts).
- **expo-notifications** for local-only reminders (S-20, rituals, R-17). No push server.
- **Testing:** **Vitest** for all pure logic + the six guardrail tests; **Jest +
  React Native Testing Library** for component tests (RNTL targets Jest). See Decisions.
- **No analytics/crash SDK. No network primitives.** CI fails if `fetch`, `axios`, or
  `XMLHttpRequest` appear anywhere in app `src/`.

---

## 3. Milestones (commit at each)

1. **Scaffold + CI guards** — Expo/expo-router/TS project, lint (ESLint + Prettier),
   Vitest + Jest config, the no-network static check wired into CI and as a test, a
   minimal GitHub Actions workflow. *No app features yet.*
2. **DB schema + migrations** — Drizzle schema files for all §6 tables (one file per
   table group), Zod enums with runtime validation, SQLite text + CHECK constraints,
   the encrypted data-access layer, and the resumable-draft plumbing.
3. **Metrics + tests** — the five pure functions in `src/lib/metrics/` with boundary
   tests, plus the severity-containment guard.
4. **Design system + shared components** — tokens (light/dark), typography, primitives
   (Button, Card, RadioGroup, Checklist, Chips, ProgressDots, QuickExit, ScreenGate,
   BreathingTimer). Follows the spec's warm/calm brief exactly.
5. **Onboarding** — S-01→S-05, safety screen logic + routing, CSI-16 baseline,
   solo-only mode choice. Safety-routing test.
6. **Log flows** — S-08 picker, S-09 quick log, S-10 cooldown gate (hard gate),
   S-11→S-18 resumable deep log, S-19 positive, S-20 follow-up. Cooldown-gate test.
7. **Home + timeline** — S-06 dashboard (ratio hero, unrepaired-rupture card, rituals,
   resume-draft), S-07 ratio detail, S-21 timeline (chronological only), S-22 detail.
8. **Patterns + trends** — S-24 trigger insights (threshold-gated), S-26 partial trends.
9. **Tools + rituals** — S-27 tools home, S-29 softened start-up rewriter, S-31 rituals.
10. **Rules engine** — `src/lib/interventions/rules.ts`, single evaluator on foreground
    + after save, rate limits, `intervention_log`. R-01…R-08, R-13, R-14, R-17, R-18.
11. **Settings/privacy/support** — S-34 privacy & data (incl. immediate full deletion,
    PIN toggle, discreet-mode flag), S-35 support & crisis resources.
12. **Final guardrail sweep** — run all six required tests + lint + typecheck; README.

Tests and lint run before every commit.

---

## 4. File structure (app at repo root)

```
  app/                         # expo-router routes
    _layout.tsx                # root: PIN/biometric gate, theme, onboarding redirect
    onboarding/                # S-01…S-05
    (tabs)/                    # Home | Log | Patterns | Tools | You
      home/                    # S-06, S-07
      log/                     # S-08…S-22
      patterns/                # S-24, S-26
      tools/                   # S-27, S-29, S-31
      you/                     # S-34, S-35
    quick-exit.tsx             # neutral decoy screen
  src/
    db/
      client.ts                # expo-sqlite + Drizzle, key bootstrap
      crypto.ts                # field-level encrypt/decrypt (key from secure-store)
      schema/                  # one file per §6 table group
        user.ts relationship.ts conflictEvent.ts conflictContext.ts
        conflictContent.ts conflictSeverity.ts conflictBehaviour.ts
        conflictCycle.ts conflictAttribution.ts conflictRepair.ts
        positiveEvent.ts assessment.ts ritual.ts interventionLog.ts index.ts
      enums.ts                 # Zod unions mirrored to CHECK constraints
      repositories/            # typed data access; decrypt boundary lives here
      migrations/
    lib/
      metrics/                 # computeCompositeSeverity, computeConnectionRatio,
                               #   computeTimeToRepair, computeTriggerAssociations,
                               #   computeRepairEfficacy  (+ __tests__)
      interventions/rules.ts   # declarative rule set + evaluator + rate limiting
      safety/                  # S-02 scoring → safety_flag
      assessments/csi16.ts     # item set, scoring (no verdict surfaced)
      notifications.ts         # local scheduling wrappers
    design/                    # tokens, theme, typography
    components/                # shared primitives
    stores/                    # Zustand
    copy/                      # exact spec wireframe strings, centralized
  scripts/check-no-network.mjs # static scan, CI + test
  vitest.config.ts  jest.config.js  eslint  tsconfig  app.json  drizzle.config.ts
.github/workflows/ci.yml
```

---

## 5. Data model (§6 → schema files)

Every §6 table implemented with exact table/field/enum names. Enums are TS union
types + Zod schemas (`src/db/enums.ts`), mirrored to SQLite `text` columns with
`CHECK` constraints. `enum[]` stored as JSON text with element validation. Phase 1
persists solo-mode data; `shared_item` (§6.15) and linked-only fields exist in schema
but are unused (no linking UI).

**Encrypted at rest** (field-level, key in secure-store): all free-text and the table
groups the prompt names — `conflict_content.narrative`, `conflict_content.surface_topic_detail`,
`conflict_behaviour.own_contribution`, `conflict_attribution.initial_attribution` /
`reappraisal`, all of `conflict_cycle`'s emotion/role fields, `positive_event.note`,
`assessment_result.raw_responses`, `relationship.partner_alias`. Derived numerics used
by metrics (e.g. `peak_intensity`, `composite_severity`) stay queryable in-clear locally
— they never leave the device and encrypting them would break local aggregation; noted
as a decision.

**Resumable deep log:** entering step 1 inserts a `conflict_event` with
`entry_depth='deep'`, `completed_steps=0`; each step advances `completed_steps` (0–7).
Home queries for any event with `completed_steps < 7` and offers resume.

---

## 6. Derived metrics (§7 → `src/lib/metrics/`, pure, unit-tested)

| Function | Spec | Boundary behaviour under test |
|---|---|---|
| `computeCompositeSeverity` | §7.1 | weighting; **internal only** — severity-containment test proves it never reaches a render path |
| `computeConnectionRatio` | §7.2 | expressed/unexpressed weighting, contempt ×1.5, reconnected ×0.7; **returns `null` below 10 events** |
| `computeTimeToRepair` | §7.3 | median over trailing 90d; unrepaired events **censored and counted separately** |
| `computeTriggerAssociations` | §7.5 | **empty array** unless n≥8 conflicts AND lift≥1.5 AND flag in ≥3 conflicts (all three) |
| `computeRepairEfficacy` | §7.7 | landing rate & partner-accept rate; divide-by-zero → null |

Not built in Phase 1 (out-of-scope screens): perpetual classification §7.4 (S-25),
attribution-index trend §7.6 (S-16 classifier stubbed).

---

## 7. Intervention rules (§8 → `src/lib/interventions/rules.ts`)

Declarative: each rule is `{ id, evaluate(state), intervention, screen, rateLimit }`.
One evaluator runs on app foreground and after each save; logs every surfacing to
`intervention_log`. Rate limit: **1 per session, 2 per week**, except **R-01 and R-16
always fire**.

Phase 1 rules: **R-01** (cooldown, hard), **R-02** (softened start-up), **R-03**/**R-04**
(unrepaired +24h/+72h, local-notification + Home card), **R-05**/**R-06** (contempt
education / referral), **R-07**/**R-08** (ratio nudges / referral), **R-13** (trigger
insight), **R-14** (revisit flooded entry), **R-17** (14-day re-engage, single message),
**R-18** (perpetual reframe).

- **R-16 (safety)** is not a §8 "surfaced intervention" in the rate-limit sense but its
  routing is implemented in onboarding (S-02 → S-35) and always takes precedence.
- **R-18** targets S-25 (out of scope). Resolution: fire an **inline reframe card** with
  the normalising copy instead of navigating to S-25. No perpetual-issues screen in P1.

---

## 8. Design direction

The spec pins this tightly, so I follow the brief rather than inventing a look:
warm low-saturation neutrals, one restrained accent, **red reserved exclusively for the
quick-exit control**, generous whitespace, single-column, one decision per screen,
humanist sans, body ≥16pt, slow/minimal motion (the cooldown timer "breathes"), full
dark mode, dynamic type, WCAG AA. Copy uses the **exact wireframe strings** from §5,
centralized in `src/copy/` so their clinical wording is auditable in one place. No
exclamation marks, no therapy-speak, no jargon.

---

## 9. Non-negotiable constraints → enforcement mechanism

| # | Constraint | How it's structurally enforced |
|---|---|---|
| 1 | No partner-rating fields | Schema-guarantee test walks Drizzle metadata; allowlist = `relationship.partner_alias`, `relationship.partner_user_id`, `conflict_cycle.partner_role`, `conflict_repair.partner_repair_attempt`, `conflict_repair.partner_repair_accepted`; any other partner-ish field name/enum fails the build |
| 2 | No raw export | No share sheet / CSV / PDF / copy-all anywhere; only S-10 & S-29 single-line scripts use clipboard |
| 3 | No severity ranking/sort | `composite_severity` computed, stored, never rendered; timeline is chronological only; severity-containment test |
| 4 | Cooldown is a hard gate | Flooded quick log locks deep log behind S-10 timer; single explicit override sets `logged_while_flooded=true`; cooldown-gate test |
| 5 | Safety screen first | S-02 runs before any relationship content; elevated → disables linked affordances, suppresses improvement copy, routes S-35; never says "abuse"; safety-routing test |
| 6 | Positive logging first-class | S-08 lists "Something good" first, lowest friction; not A/B'd toward conflict |
| 7 | No streaks/gamification/guilt | No conflict-free streaks; R-17 is one message then silence; ritual counts are neutral progress, never punitive |

---

## 10. Required tests (beyond normal coverage)

1. **Schema guarantee** (Vitest) — walk schema metadata, assert no partner
   behaviour/fault/character field or enum, explicit two-field+ allowlist.
2. **No-network** (Vitest + CI) — static scan of app `src/` for `fetch`/`axios`/`XMLHttpRequest`.
3. **Severity containment** (Vitest) — `composite_severity` never reaches a component prop
   or rendered string (grep of route/component tree + metrics-boundary assertion).
4. **Cooldown gate** (RNTL) — deep log unreachable from a flooded quick log without timer
   completion or explicit override.
5. **Safety routing** (Vitest/RNTL) — each above-threshold answer routes to S-35 and sets
   `safety_flag`.
6. **Metrics thresholds** (Vitest) — trigger insights empty below every threshold; ratio
   null below 10 events.

---

## 11. Decisions (ambiguities resolved; will also live in-repo)

- **D1 Repo layout:** RESOLVED — app at repo root on this branch; Nyawira site removed
  from this branch, preserved on `main` (see §0).
- **D2 Encryption:** field-level AES on sensitive columns with the key in
  `expo-secure-store`, **instead of** SQLCipher/op-sqlite. Rationale: keeps the app
  buildable on standard Expo without a custom native dev-build, and still delivers
  at-rest encryption of narrative/behaviour/cycle/assessment data per §11. Derived
  numerics stay in-clear locally so metrics can aggregate.
- **D3 "Push" without network:** S-20 / R-03 / R-04 / R-17 use `expo-notifications`
  local scheduling + in-app cards. Zero network calls.
- **D4 S-16 classifier stubbed:** screen built, free text captured, attribution index
  and derived dimensions stored null. No on-device NLP in P1.
- **D5 R-18 target:** inline reframe card (S-25 is out of scope).
- **D6 Two test runners:** Vitest for logic/guardrail tests (fast, pure TS), Jest+RNTL
  for component tests (RNTL is Jest-native). One `npm test` runs both.
- **D7 discreet_mode:** flag stored and applied to in-app title/appearance now; dynamic
  home-screen **app icon/name** switching needs native config and is deferred (noted,
  not silently dropped).
- **D8 Quick-exit "neutral page":** an innocuous local decoy route (e.g. a plain
  notes/weather-style blank), since there's no browser to open to.
- **D9 Age gate (§9.5):** an 18+ confirmation added to onboarding basics (S-03).
- **D10 Severity recovery-time scale:** §7.1 gives the 0.10 weight for
  `norm(recovery_minutes)` but no scale; the composite saturates recovery at
  4 hours (240 min) so a very long cooldown cannot dominate the score.
- **D11 Encryption library:** field-level AES-256-GCM uses the audited pure-JS
  `@noble/ciphers` (no native module, runs under Hermes and in Node tests).
- **D14 Ratio-streak proxy (R-07/R-08):** true consecutive-day ratio streaks
  need day-by-day ratio history; Phase 1 uses the current 14-day ratio as a
  proxy for the streak gate (below 5 → treat as the 14-day threshold met; below
  3 → the 21-day threshold). Day-level history is a Phase 2 refinement.
- **D13 "encrypt the cycle table" vs CHECK constraints:** the prompt lists the
  cycle table among those to field-encrypt, but `conflict_cycle` holds only
  CHECK-constrained enum categories and one boolean — no free text. Encrypting a
  categorical column would break its CHECK constraint and its queryability for
  no real confidentiality gain (the values are a fixed vocabulary, not private
  prose). So cycle stays unencrypted; free-text elsewhere (narrative, own
  contribution, attribution text, notes, alias, assessment responses) IS
  field-encrypted. Full at-rest DB encryption (SQLCipher/op-sqlite) is the
  recommended production hardening for categorical columns and is noted for a
  later milestone. `contempt_present` also stays in clear because R-05/R-06 and
  trends query it.
- **D12 intervention_log enum extension:** §8 says "log every surfacing to
  intervention_log," but §6.16's `intervention` enum lacks buckets for R-03/R-04
  (repair follow-up), R-13 (trigger insight), R-17 (re-engagement), and R-18
  (perpetual reframe). To keep the log honest I added `repair_followup`,
  `trigger_insight`, `reengagement`, and `perpetual_reframe` to that enum. The
  precise rule is always also stored in `trigger_rule` (e.g. "R-13").

---

## 12. Where I need clinical sign-off (flagging, not inventing)

Per spec §14, these carry clinical/licensing dependencies. I will **implement the
screens and the plain-language wireframe copy exactly as written in §5**, but I will
**not invent validated clinical cutoffs or instrument wording and present them as
validated.** Specifically:

- **S-02 safety screen thresholds.** The wireframe gives three plain questions. Spec §9.3
  names HITS / WAST-short as the validated instruments. I'll implement the three
  wireframe questions with a **documented, provisional** threshold→`safety_flag` mapping
  (e.g. any "Yes" on harm/threat, or "Often" afraid → `elevated`) and mark it in code as
  **requiring clinical governance sign-off before launch** (§9, §14). I won't relabel it
  as a validated HITS score.
- **CSI-16 items.** Implemented as the baseline instrument; item wording flagged for the
  commercial-licensing confirmation §14 calls for. Scoring never surfaced as a verdict.
- **Crisis resources (S-35).** Screen and framing built; the **actual regional hotline
  numbers/links are left as clearly-marked placeholders** for you to populate with
  verified, region-correct resources — I won't hard-code emergency numbers I can't verify.

These three are the only places I'm deliberately not filling in authoritative content,
because getting them wrong is the failure mode the whole product is built to avoid.

---

**Next step:** on your go-ahead for the layout (§0) and this plan, I start Milestone 1
(scaffold + CI guards) and commit per milestone.
