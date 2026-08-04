# Product Specification — Couples Conflict & Repair Tracker

**Working name:** Repair
**Version:** 0.1 (draft for build)
**Document owner:** Product
**Status:** For review

---

## 0. Reader's guide

| Section | Contents |
|---|---|
| 1 | Product definition, positioning, non-goals |
| 2 | Clinical foundations → feature mapping |
| 3 | Modes, roles, permissions |
| 4 | Information architecture and navigation |
| 5 | Screen-by-screen wireframe definitions (S-01 … S-32) |
| 6 | Data schema, field by field |
| 7 | Derived metrics and analytics formulas |
| 8 | Intervention rules engine |
| 9 | Safety, IPV, and clinical escalation protocol |
| 10 | Notifications and engagement |
| 11 | Privacy and security architecture |
| 12 | Roadmap and release gates |
| 13 | Success metrics |
| 14 | Open questions and licensing dependencies |

---

## 1. Product definition

### 1.1 One-line

A private, clinically-grounded log that helps partners see the **cycle** they get caught in, shorten the **time to repair**, and build a positive-to-negative interaction ratio that predicts relational stability.

### 1.2 Core product thesis

Naive conflict logging is iatrogenic. A searchable archive of grievances, each with a severity score, amplifies **negative sentiment override** (Weiss, 1980) — the distressed-couple bias toward recalling negatives and reinterpreting neutral acts as hostile — and supplies ammunition for the next fight.

The product therefore inverts three defaults:

| Naive default | This product |
|---|---|
| Log the incident | Log the **cycle** the incident belongs to |
| Score blame and fault | Score **own behaviour** and **repair** only |
| Track negatives | Track negatives *and* positives, with the ratio as the headline metric |

The headline outcome metric is **time-to-repair**, not conflict frequency. Healthy couples do not fight less; they recover faster and repair more successfully.

### 1.3 Positioning

Psychoeducation and self-awareness tool. **Not** therapy, not diagnosis, not a substitute for treatment. Regulatory posture: general wellness product; explicitly avoids disease-treatment claims. See §9 and §14.

### 1.4 Non-goals (v1)

- Partner rating, fault attribution, or comparative scoring of any kind
- Legal-grade export, transcript export, or "evidence" framing
- Location tracking, device monitoring, message scraping
- Real-time conflict mediation ("who's right?") or AI verdicts
- Matchmaking, gamified streaks on conflict, leaderboards
- Couples therapy delivery

### 1.5 Target users

| Segment | Need | Priority |
|---|---|---|
| Committed couple, moderate distress, no therapist | See the pattern; stop repeating it | P0 |
| Individual partner, unilateral effort | Understand own contribution without partner buy-in | P0 |
| Couple in therapy, between sessions | Homework capture, therapist-shareable summary | P1 |
| Pre-marital / early cohabiting | Build habits before entrenchment | P2 |

---

## 2. Clinical foundations → feature mapping

| Framework | Source concept | Feature |
|---|---|---|
| Gottman Sound Relationship House | Four Horsemen; repair attempts; flooding; 5:1 ratio; 69% perpetual problems; Aftermath of a Fight; Dreams Within Conflict | Behaviour checklist, repair tracker, self-soothe timer, ratio dashboard, perpetual-problem classifier, guided protocols |
| EFT (Johnson) | Negative cycle; pursue–withdraw; primary vs. secondary emotion; attachment needs | Cycle map, primary-emotion field, attachment-need field |
| VSA model (Karney & Bradbury) | Enduring vulnerabilities × stressors × adaptive processes | Context and vulnerability flags, stressor correlation analytics |
| Dyadic coping (Bodenmann) | External stress spillover; supportive/delegated/common coping | Stress-origin classification, daily stress-reducing conversation ritual |
| Attribution theory (Fincham & Bradbury) | Distress-maintaining vs. relationship-enhancing attributions | Attribution capture + reappraisal prompt |
| PREP (Markman) | Hidden issues beneath surface topics; speaker–listener technique | Two-layer topic model, structured dialogue protocol |
| IBCT (Christensen & Jacobson) | Acceptance where change fails; unified detachment; empathic joining | Acceptance track for gridlocked perpetual issues |
| Attachment theory (Bowlby, Hazan & Shaver) | Anxious / avoidant / secure organisation | Optional ECR-S assessment, style-tailored copy |
| Polyvagal-informed regulation | Physiological arousal blocks processing | 20-minute mandatory cooldown gate |

---

## 3. Modes, roles, permissions

### 3.1 Modes

**Solo mode (default).** One user. Entries fully private. All analytics local to that user. No partner exists in the data model beyond a nickname string.

**Linked mode (opt-in, mutual, revocable).** Two users linked by invitation code. Each keeps a **private journal** and can promote selected content to a **shared view**. Promotion is per-item and irreversible only in the sense that the recipient may have seen it; the item can still be withdrawn from the shared view.

### 3.2 Sharing rules (hard constraints, enforced server-side)

| Rule | Rationale |
|---|---|
| Nothing is shared by default | Prevents surveillance dynamic |
| No field describing the partner's behaviour is ever shareable | Prevents evidence-building |
| Free-text narrative fields are never auto-shared | Prevents accidental disclosure |
| Shareable set is limited to: own primary emotion, own attachment need, own repair attempt, own responsibility statement, appreciation entries, ritual completion | These are the pro-social disclosures |
| Either party can unlink unilaterally, immediately, without notifying the other beyond a neutral system message | Coercive-control safety |
| No read receipts, no "last active", no entry counts visible to partner | Prevents monitoring and pressure |

### 3.3 Roles

| Role | Capabilities |
|---|---|
| Individual | Full solo functionality |
| Linked partner | Individual + shared view + joint rituals |
| Therapist (P2) | Read-only, time-boxed, revocable access to a **pattern summary** — never raw entries |

---

## 4. Information architecture

### 4.1 Tab bar (5 tabs)

```
┌──────┬──────┬──────────┬──────┬──────┐
│ Home │ Log  │ Patterns │ Tools│ You  │
└──────┴──────┴──────────┴──────┴──────┘
```

| Tab | Purpose |
|---|---|
| **Home** | Today's state, ratio gauge, active repair prompts, ritual reminders |
| **Log** | Entry creation (conflict, positive, repair) + timeline |
| **Patterns** | Cycle map, triggers, perpetual issues, trends |
| **Tools** | Guided protocols, self-soothe, scripts, learn library |
| **You** | Assessments, settings, sharing, privacy, help |

### 4.2 Screen inventory

| ID | Screen | Tab |
|---|---|---|
| S-01 | Onboarding — welcome & framing | — |
| S-02 | Onboarding — safety screen | — |
| S-03 | Onboarding — relationship basics | — |
| S-04 | Onboarding — baseline assessment | — |
| S-05 | Onboarding — mode choice (solo/link) | — |
| S-06 | Home dashboard | Home |
| S-07 | Ratio detail | Home |
| S-08 | Log picker (FAB sheet) | Log |
| S-09 | Quick log — conflict | Log |
| S-10 | Cooldown gate / self-soothe timer | Log |
| S-11 | Deep log 1 — context | Log |
| S-12 | Deep log 2 — topic & hidden issue | Log |
| S-13 | Deep log 3 — severity & flooding | Log |
| S-14 | Deep log 4 — my behaviour | Log |
| S-15 | Deep log 5 — cycle & emotion | Log |
| S-16 | Deep log 6 — attribution & reappraisal | Log |
| S-17 | Deep log 7 — repair & resolution | Log |
| S-18 | Deep log — summary & save | Log |
| S-19 | Positive log | Log |
| S-20 | Repair follow-up (async) | Log |
| S-21 | Timeline | Log |
| S-22 | Entry detail | Log |
| S-23 | Cycle map | Patterns |
| S-24 | Trigger insights | Patterns |
| S-25 | Perpetual issues | Patterns |
| S-26 | Trends over time | Patterns |
| S-27 | Tools home | Tools |
| S-28 | Aftermath of a Fight protocol | Tools |
| S-29 | Softened start-up rewriter | Tools |
| S-30 | Dreams Within Conflict | Tools |
| S-31 | Rituals | Tools |
| S-32 | Assessments | You |
| S-33 | Sharing & linking | You |
| S-34 | Privacy & data | You |
| S-35 | Support & crisis resources | You |
| S-36 | Shared view (linked mode) | Home |

---

## 5. Screen definitions

Wireframes are structural, not visual. `[ ]` = control, `( )` = radio, `☐` = checkbox, `▸` = navigation.

---

### S-01 — Onboarding: welcome & framing

```
┌─────────────────────────────────┐
│                                 │
│   This is not a record of       │
│   who was right.                │
│                                 │
│   It's a way to see the         │
│   pattern you both get          │
│   caught in — and get out       │
│   of it faster.                 │
│                                 │
│   • Private by default          │
│   • You only ever describe      │
│     your own behaviour          │
│   • You'll log good moments     │
│     too — that's the point      │
│                                 │
│        [ Continue ]             │
│        [ How this works ]       │
└─────────────────────────────────┘
```

**Purpose:** Set the anti-scorekeeping frame before any data is entered. This screen is doing clinical work — it pre-empts the grievance-archive mental model.

---

### S-02 — Onboarding: safety screen

```
┌─────────────────────────────────┐
│  Before we start                │
│                                 │
│  A few questions. Your          │
│  answers are private and        │
│  never shared.                  │
│                                 │
│  In your relationship, do you   │
│  ever feel afraid of your       │
│  partner?                       │
│  ( ) Never  ( ) Rarely          │
│  ( ) Sometimes ( ) Often        │
│                                 │
│  Has your partner ever          │
│  physically hurt or             │
│  threatened you?                │
│  ( ) No ( ) Yes ( ) Prefer not  │
│                                 │
│  Does your partner control      │
│  your money, movements, or      │
│  who you see?                   │
│  ( ) No ( ) Sometimes ( ) Yes   │
│                                 │
│        [ Continue ]             │
│  [ Leave this app quickly ]     │
└─────────────────────────────────┘
```

**Logic:** Any endorsement above threshold routes to S-35 with IPV-specific resourcing, disables Linked mode, and suppresses all "improve your relationship" framing. See §9.
**Quick-exit:** persistent control on every screen in this flow; clears view and opens a neutral page.

---

### S-03 — Onboarding: relationship basics

```
┌─────────────────────────────────┐
│  About your relationship        │
│                                 │
│  Partner's name or nickname     │
│  [___________________]          │
│  (only you see this)            │
│                                 │
│  Relationship status            │
│  [ Dating ▾ ]                   │
│                                 │
│  Together since                 │
│  [ MM / YYYY ]                  │
│                                 │
│  Living together?   [ Yes / No ]│
│  Children at home?  [ 0 ▾ ]     │
│  Currently in couples therapy?  │
│                     [ Yes / No ]│
│                                 │
│        [ Continue ]             │
└─────────────────────────────────┘
```

---

### S-04 — Onboarding: baseline assessment

Presents **CSI-16** (Couples Satisfaction Index) as the baseline. Optional **ECR-S** attachment measure offered but skippable.

```
┌─────────────────────────────────┐
│  Baseline  ●●○○○  (3 of 16)     │
│                                 │
│  Please indicate the degree of  │
│  happiness, all things          │
│  considered, of your            │
│  relationship.                  │
│                                 │
│  Extremely    ○ ○ ○ ○ ○ ○ ○     │
│  unhappy            Perfect     │
│                                 │
│           [ Skip assessment ]   │
└─────────────────────────────────┘
```

**Scoring is never shown as a verdict.** Result is stored and surfaced only as a trend line later (S-26). No "your relationship scored 42/81" moment.

---

### S-05 — Onboarding: mode choice

```
┌─────────────────────────────────┐
│  How do you want to use this?   │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Just me            ✓ rec. │  │
│  │ Fully private. Nothing is │  │
│  │ ever visible to anyone.   │  │
│  │ You can link later.       │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ Me and my partner         │  │
│  │ You each keep a private   │  │
│  │ journal. You choose,      │  │
│  │ item by item, what to     │  │
│  │ share.                    │  │
│  └───────────────────────────┘  │
│                                 │
│        [ Continue ]             │
└─────────────────────────────────┘
```

Solo is visually recommended. Linked mode is gated on the safety screen result.

---

### S-06 — Home dashboard

```
┌─────────────────────────────────┐
│  Tuesday                    ⚙︎  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  Connection ratio         │  │
│  │  last 14 days             │  │
│  │                           │  │
│  │      6.2 : 1              │  │
│  │  ▓▓▓▓▓▓▓▓▓░░░  target 5:1 │  │
│  │  24 positive · 4 hard     │  │
│  └───────────────────────────┘  │
│                                 │
│  ⚠ Needs attention              │
│  ┌───────────────────────────┐  │
│  │ Sunday's argument is      │  │
│  │ still unrepaired (2 days) │  │
│  │ [ Do the aftermath ▸ ]    │  │
│  └───────────────────────────┘  │
│                                 │
│  Today                          │
│  ☐ Stress-reducing conversation │
│  ☐ Log one appreciation         │
│                                 │
│  This week                      │
│  ☐ State of the Union (Sun)     │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Your pattern this month   │  │
│  │ You pursue, they withdraw │  │
│  │ in 7 of 9 conflicts.      │  │
│  │ [ See the cycle ▸ ]       │  │
│  └───────────────────────────┘  │
│                                 │
│              (+)                │
└─────────────────────────────────┘
```

**Design notes:**
- Ratio is the hero metric, not conflict count. Framed positively ("Connection ratio").
- The unrepaired-rupture card is the highest-priority slot; it is the single most actionable state in the product.
- Never show a conflict streak or "days without a fight" — that pathologises normal conflict and creates concealment incentives.

---

### S-07 — Ratio detail

```
┌─────────────────────────────────┐
│  ← Connection ratio             │
│                                 │
│  6.2 : 1  over 14 days          │
│                                 │
│  ┌───────────────────────────┐  │
│  │  ratio over 12 weeks      │  │
│  │  ╱╲    ╱╲╱╲               │  │
│  │ ╱  ╲╱╲╱     ╲─── 5:1      │  │
│  └───────────────────────────┘  │
│                                 │
│  Why 5 to 1?                    │
│  In observational research,     │
│  stable couples produced about  │
│  five positive interactions for │
│  every negative one during      │
│  conflict. Below that, decline  │
│  becomes predictable.           │
│                                 │
│  Your positives are mostly:     │
│  ▸ Appreciation      11         │
│  ▸ Affection          6         │
│  ▸ Turning toward     4         │
│  ▸ Shared humour      3         │
│                                 │
│  Thin area: shared humour and   │
│  play. [ Ideas ▸ ]              │
└─────────────────────────────────┘
```

---

### S-08 — Log picker (FAB bottom sheet)

```
┌─────────────────────────────────┐
│                                 │
│   What do you want to log?      │
│                                 │
│   ♥  Something good             │
│      15 seconds                 │
│                                 │
│   ⚡ A difficult moment          │
│      quick now, details later   │
│                                 │
│   ✓  A repair                   │
│      something that helped      │
│                                 │
│   ⊙  How I'm feeling            │
│      mood check-in              │
│                                 │
└─────────────────────────────────┘
```

Positive log is listed **first** and is the lowest-friction path. This ordering is deliberate and should not be A/B tested toward conflict-first even if it lifts engagement.

---

### S-09 — Quick log: conflict

Target completion: **under 30 seconds**, usable mid- or immediately post-conflict.

```
┌─────────────────────────────────┐
│  ← A difficult moment           │
│                                 │
│  When                           │
│  [ Now ] [ Earlier today ] [📅] │
│                                 │
│  How intense did it get?        │
│  ○───○───●───○───○              │
│  tense        heated    explosive│
│                                 │
│  Right now I feel               │
│  ☐ Flooded / overwhelmed        │
│  ☐ Angry     ☐ Hurt             │
│  ☐ Numb      ☐ Scared           │
│  ☐ Ashamed   ☐ Lonely           │
│                                 │
│  In a word, what was it about?  │
│  [ money ] [ chores ] [ time ]  │
│  [ in-laws ] [ phone ] [ + ]    │
│                                 │
│    [ Save — add details later ] │
└─────────────────────────────────┘
```

If **Flooded** is checked → route immediately to S-10 before anything else.

---

### S-10 — Cooldown gate / self-soothe timer

```
┌─────────────────────────────────┐
│                                 │
│         20:00                   │
│      ◜◝◜◝◜◝◜◝◜◝                │
│                                 │
│  When your heart rate goes      │
│  past about 100, you can't      │
│  actually take in what your     │
│  partner is saying. Nothing     │
│  useful happens until your      │
│  body settles. Twenty minutes   │
│  is the minimum.                │
│                                 │
│  Say this before you go:        │
│  ┌───────────────────────────┐  │
│  │ "I'm too overwhelmed to   │  │
│  │ keep going right now. I   │  │
│  │ need twenty minutes. I    │  │
│  │ will come back."          │  │
│  │            [ Copy ]       │  │
│  └───────────────────────────┘  │
│                                 │
│  Leaving without saying you'll  │
│  return reads as abandonment.   │
│  Saying it turns a walk-out     │
│  into a break.                  │
│                                 │
│  While you wait                 │
│  [ Breathing ] [ Walk ] [ Music]│
│                                 │
│  ⚠ Don't rehearse the argument  │
│  in your head. That's what      │
│  keeps you flooded.             │
│                                 │
│         [ I'm back ]            │
└─────────────────────────────────┘
```

**Behaviour:** The deep log is **locked** until the timer completes or the user explicitly overrides ("I'm calm enough"). This is the product's most important friction: preventing users from writing entries while flooded, which produces distorted, contempt-laden records.

---

### S-11 — Deep log 1: context

```
┌─────────────────────────────────┐
│  ← Details          Step 1 of 7 │
│  ▓▓░░░░░                        │
│                                 │
│  When and where                 │
│  Date [ Sun 12 Oct ]            │
│  Time [ 21:40 ]  Lasted [ 45m ] │
│  Where [ Home ▾ ]               │
│  Who else was there             │
│  ( ) Just us  ( ) Kids present  │
│  ( ) Others   ( ) In public     │
│                                 │
│  What was already going on?     │
│  (tick anything true that day)  │
│  ☐ Short on sleep               │
│  ☐ Drinking involved            │
│  ☐ Work stress                  │
│  ☐ Money pressure               │
│  ☐ Illness / pain               │
│  ☐ Family or in-laws            │
│  ☐ Parenting load               │
│  ☐ Travel / just got back       │
│  ☐ We'd been distant for days   │
│  ☐ Nothing unusual              │
│                                 │
│  Where did the stress start?    │
│  ( ) Between us                 │
│  ( ) Outside — spilled in       │
│  ( ) Both                       │
│                                 │
│         [ Next ]                │
└─────────────────────────────────┘
```

The last question implements Bodenmann's dyadic-coping distinction. Users are consistently surprised how often they select "outside — spilled in", which is itself therapeutic.

---

### S-12 — Deep log 2: topic & hidden issue

```
┌─────────────────────────────────┐
│  ← Details          Step 2 of 7 │
│  ▓▓▓▓░░░                        │
│                                 │
│  On the surface, it was about   │
│  [ Money ▾ ]                    │
│  [ ...the credit card bill    ] │
│                                 │
│  Underneath, what was really    │
│  at stake for you?              │
│                                 │
│  ( ) Power — who decides        │
│  ( ) Caring — do you have my    │
│      back                       │
│  ( ) Recognition — does what I  │
│      do register                │
│  ( ) Commitment — are we in     │
│      this for good              │
│  ( ) Trust — can I rely on you  │
│  ( ) Acceptance — can I be who  │
│      I am here                  │
│  ( ) Freedom — do I get to have │
│      a self                     │
│  ( ) Not sure                   │
│                                 │
│  Fights about the credit card   │
│  are rarely about the credit    │
│  card.                          │
│                                 │
│         [ Next ]                │
└─────────────────────────────────┘
```

---

### S-13 — Deep log 3: severity & flooding

```
┌─────────────────────────────────┐
│  ← Details          Step 3 of 7 │
│  ▓▓▓▓▓░░                        │
│                                 │
│  How intense at its peak?       │
│  ○───○───●───○───○   (3/5)      │
│                                 │
│  How fast did it escalate?      │
│  ( ) Slow burn                  │
│  ( ) Gradual                    │
│  ( ) Zero to sixty              │
│                                 │
│  Did it become personal?        │
│  ( ) No — stayed on the issue   │
│  ( ) Drifted into character     │
│  ( ) Yes — it got personal      │
│                                 │
│  Did you flood?                 │
│  ☐ Heart racing                 │
│  ☐ Mind went blank              │
│  ☐ Wanted to escape             │
│  ☐ Couldn't hear them anymore   │
│  ☐ None of these                │
│                                 │
│  How long before you felt       │
│  normal again?                  │
│  [ ~2 hours ▾ ]                 │
│                                 │
│         [ Next ]                │
└─────────────────────────────────┘
```

Severity is deliberately **multi-dimensional**. A single 1–10 slider is rejected: it invites ranking of grievances and loses the clinically meaningful distinctions (escalation slope, personalisation, physiological flooding, recovery time).

---

### S-14 — Deep log 4: my behaviour

```
┌─────────────────────────────────┐
│  ← Details          Step 4 of 7 │
│  ▓▓▓▓▓▓░                        │
│                                 │
│  This part is only about you.   │
│  You'll never be asked to rate  │
│  your partner.                  │
│                                 │
│  Did any of these show up in    │
│  how you handled it?            │
│                                 │
│  ☐ Criticism                    │
│    "you always", "you never",   │
│    attacking who they are       │
│  ☐ Contempt                     │
│    eye-roll, sarcasm, mockery,  │
│    talking down                 │
│  ☐ Defensiveness                │
│    counter-attack, "not my      │
│    fault", innocent victim      │
│  ☐ Stonewalling                 │
│    shut down, walked off,       │
│    went silent                  │
│  ☐ None of these                │
│                                 │
│  What did you do that helped?   │
│  ☐ Started gently               │
│  ☐ Owned my part                │
│  ☐ Said what I needed clearly   │
│  ☐ Took a break properly        │
│  ☐ Softened when they softened  │
│                                 │
│  In one line, my share of it:   │
│  [_______________________]      │
│                                 │
│         [ Next ]                │
└─────────────────────────────────┘
```

**Contempt** is separated visually and tracked independently — it is the strongest single behavioural predictor of dissolution and triggers its own intervention path (§8).

---

### S-15 — Deep log 5: cycle & emotion

The clinical core of the product.

```
┌─────────────────────────────────┐
│  ← Details          Step 5 of 7 │
│  ▓▓▓▓▓▓▓                        │
│                                 │
│  When it heated up, you were    │
│  mostly:                        │
│  ( ) Pushing for a response     │
│      — pursuing, insisting      │
│  ( ) Pulling back               │
│      — shutting down, leaving   │
│  ( ) Both, in turns             │
│                                 │
│  On the outside, they saw:      │
│  [ Anger ▾ ]                    │
│                                 │
│  Underneath that, what were     │
│  you actually feeling?          │
│                                 │
│  ( ) Hurt      ( ) Afraid       │
│  ( ) Lonely    ( ) Ashamed      │
│  ( ) Unimportant                │
│  ( ) Not good enough            │
│  ( ) Rejected  ( ) Trapped      │
│                                 │
│  Anger is usually the bodyguard │
│  for something softer.          │
│                                 │
│  What were you needing to know? │
│  ( ) Are you there for me?      │
│  ( ) Do I matter to you?        │
│  ( ) Do you respect me?         │
│  ( ) Can I trust you?           │
│  ( ) Do I still get to be me?   │
│                                 │
│         [ Next ]                │
└─────────────────────────────────┘
```

**This is the highest-leverage screen in the product.** Moving a user from *"he never listens"* to *"I felt alone"* is the single mechanism most likely to produce change. Instrument completion rate on this step as a primary product health metric.

---

### S-16 — Deep log 6: attribution & reappraisal

```
┌─────────────────────────────────┐
│  ← Details          Step 6 of 7 │
│  ▓▓▓▓▓▓▓▓                       │
│                                 │
│  Why do you think they acted    │
│  the way they did?              │
│  [_______________________]      │
│                                 │
│  ─────────────────────────      │
│                                 │
│  A harder question:             │
│  What's a reason for their      │
│  behaviour that has nothing     │
│  to do with not caring          │
│  about you?                     │
│                                 │
│  [_______________________]      │
│                                 │
│  Not because your first answer  │
│  is wrong. Because holding two  │
│  explanations at once is what   │
│  stops a fight becoming a       │
│  verdict.                       │
│                                 │
│  [ Skip ]        [ Next ]       │
└─────────────────────────────────┘
```

**Classification (server-side, never shown as a label):** the first free-text response is scored on Fincham & Bradbury's dimensions — locus, stability, globality, intent, blame — to produce a distress-maintaining vs. relationship-enhancing index used in trend analytics (§7.6).

---

### S-17 — Deep log 7: repair & resolution

```
┌─────────────────────────────────┐
│  ← Details          Step 7 of 7 │
│  ▓▓▓▓▓▓▓▓▓                      │
│                                 │
│  Did either of you try to       │
│  de-escalate during it?         │
│  (a joke, a touch, "wait —      │
│  let me start again", an        │
│  apology mid-fight)             │
│                                 │
│  I tried        ( ) Yes ( ) No  │
│  → Did it land? ( ) Yes ( ) No  │
│  They tried     ( ) Yes ( ) No  │
│  → Did I accept?( ) Yes ( ) No  │
│                                 │
│  Where did it end up?           │
│  ( ) Resolved                   │
│  ( ) Calmed down, not resolved  │
│  ( ) Parked for later           │
│  ( ) Still open                 │
│  ( ) This one never resolves    │
│                                 │
│  Are you reconnected now?       │
│  ( ) Yes → how long did it take?│
│      [ ~3 hours ▾ ]             │
│  ( ) Not yet                    │
│                                 │
│         [ Finish ]              │
└─────────────────────────────────┘
```

"Did I accept?" is one of the few high-value self-report items about the interaction — Gottman's finding is that in distressed couples repair attempts are *made* but not *received*.

---

### S-18 — Deep log: summary & save

```
┌─────────────────────────────────┐
│  ← Before you save              │
│                                 │
│  Sunday, 21:40 · 45 min · Home  │
│  About: money                   │
│  Really about: recognition      │
│                                 │
│  You pursued. You showed        │
│  criticism. Underneath the      │
│  anger was feeling unimportant. │
│  You needed to know you matter. │
│                                 │
│  Still unrepaired.              │
│                                 │
│  ┌───────────────────────────┐  │
│  │ This is the 4th time this │  │
│  │ month the underlying      │  │
│  │ issue was recognition.    │  │
│  │ [ See the pattern ▸ ]     │  │
│  └───────────────────────────┘  │
│                                 │
│  [ Save ]                       │
│  [ Save + do the aftermath ▸ ]  │
│  [ Save + share one line with   │
│    Ana ▸ ]                      │
└─────────────────────────────────┘
```

The share option offers **only** the primary emotion and attachment need — never the behaviour, attribution, or narrative fields.

---

### S-19 — Positive log

```
┌─────────────────────────────────┐
│  ← Something good               │
│                                 │
│  What kind?                     │
│  [♥ Appreciation] [☺ Affection] │
│  [→ They turned toward me]      │
│  [☼ Laughed together]           │
│  [✓ They did something for me]  │
│  [♦ Felt close]                 │
│                                 │
│  What happened?                 │
│  [_______________________]      │
│                                 │
│  Did you tell them?             │
│  ( ) Yes  ( ) Not yet           │
│      → [ Tell them now ▸ ]      │
│                                 │
│         [ Save ]                │
└─────────────────────────────────┘
```

Sub-15-second completion. "Did you tell them?" converts private noticing into an actual positive interaction — the observable behaviour that the ratio is meant to represent.

---

### S-20 — Repair follow-up (async, push-triggered)

Fires 24h after any entry with `repair_status ≠ reconnected`.

```
┌─────────────────────────────────┐
│  Sunday's argument              │
│                                 │
│  It's been 2 days. Where are    │
│  things?                        │
│                                 │
│  ( ) We're okay now             │
│  ( ) Surface okay, not really   │
│  ( ) Still cold                 │
│  ( ) It blew up again           │
│                                 │
│  Time apart doesn't repair.     │
│  Ruptures that aren't addressed │
│  don't fade — they accumulate.  │
│                                 │
│  [ Do the aftermath together ▸ ]│
│  [ Send a reach-out ▸ ]         │
│  [ Not now ]                    │
└─────────────────────────────────┘
```

---

### S-21 — Timeline

```
┌─────────────────────────────────┐
│  Timeline        [ All ▾ ] [🔍] │
│                                 │
│  This week                      │
│  ♥ Tue  She made coffee before  │
│         her early meeting       │
│  ♥ Mon  Laughed about the dog   │
│  ⚡ Sun  Money → recognition     │
│         intensity 3 · unrepaired│
│  ♥ Sun  He apologised first     │
│                                 │
│  Last week                      │
│  ♥ Sat  ...                     │
│  ⚡ Thu  Phone → caring          │
│         intensity 2 · repaired  │
│                                 │
│  ─────────────────────────      │
│  ⓘ Timeline is chronological    │
│  only. There's no "worst        │
│  fights" view, by design.       │
└─────────────────────────────────┘
```

**Deliberate omissions:** no sort-by-severity, no "top conflicts", no partner-behaviour filter. Search is available but does not rank by intensity.

---

### S-23 — Cycle map (Patterns)

```
┌─────────────────────────────────┐
│  ← Your cycle                   │
│                                 │
│  Built from 14 conflicts        │
│                                 │
│      ┌──────────────┐           │
│      │  YOU         │           │
│      │  I push      │           │
│   ┌──│  harder      │◀──┐       │
│   │  │  ↓           │   │       │
│   │  │  underneath: │   │       │
│   │  │  "I don't    │   │       │
│   │  │   matter"    │   │       │
│   │  └──────────────┘   │       │
│   ▼                     │       │
│  ┌──────────────┐       │       │
│  │  THEM        │───────┘       │
│  │  They go     │               │
│  │  quiet       │               │
│  │  ↓           │               │
│  │  (your guess:│               │
│  │  "I'll only  │               │
│  │  make it     │               │
│  │  worse")     │               │
│  └──────────────┘               │
│                                 │
│  The more you push, the more    │
│  they withdraw. The more they   │
│  withdraw, the more you push.   │
│  Neither of you is the problem. │
│  The loop is.                   │
│                                 │
│  You've stepped out of it 3     │
│  times. What worked:            │
│  • You named it out loud        │
│  • You took a proper break      │
│                                 │
│  [ Share this map with Ana ▸ ]  │
└─────────────────────────────────┘
```

The partner's inner experience is shown as an explicit **guess**, never as data. In linked mode, the partner may choose to fill their own half.

---

### S-24 — Trigger insights

```
┌─────────────────────────────────┐
│  ← What sets it off             │
│  Based on 14 conflicts          │
│                                 │
│  Strongest signals              │
│                                 │
│  Alcohol                        │
│  ▓▓▓▓▓▓▓▓░░  6 of 14            │
│  present in 43% of conflicts,   │
│  8% of ordinary days            │
│                                 │
│  After 21:00                    │
│  ▓▓▓▓▓▓▓░░░  9 of 14            │
│                                 │
│  Under 6h sleep                 │
│  ▓▓▓▓▓░░░░░  7 of 14            │
│                                 │
│  Sunday evenings                │
│  ▓▓▓▓░░░░░░  5 of 14            │
│                                 │
│  ─────────────────────────      │
│  Association, not proof —       │
│  small sample.                  │
│                                 │
│  One thing to try               │
│  Nothing important after 21:00. │
│  Park it for tomorrow, on       │
│  purpose, out loud.             │
│  [ Set as an agreement ▸ ]      │
└─────────────────────────────────┘
```

**Statistical honesty rule:** no correlation is surfaced below n=8 conflicts and a minimum lift threshold; all insights carry the association caveat.

---

### S-25 — Perpetual issues

```
┌─────────────────────────────────┐
│  ← Recurring themes             │
│                                 │
│  About seven in ten of the      │
│  things couples argue about     │
│  never get solved. They come    │
│  from real differences in       │
│  personality and values. The    │
│  goal isn't to win them — it's  │
│  to be able to talk about them  │
│  without damage.                │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Time together vs. apart   │  │
│  │ 6 conflicts · 4 months    │  │
│  │ Status: GRIDLOCKED        │  │
│  │ Same positions, rising    │  │
│  │ intensity, no movement.   │  │
│  │ [ Explore what's under it]│  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ How much we spend         │  │
│  │ 4 conflicts · 3 months    │  │
│  │ Status: IN DIALOGUE       │  │
│  │ Intensity falling. You're │  │
│  │ managing this one well.   │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ School run logistics      │  │
│  │ Status: SOLVABLE          │  │
│  │ Concrete, situational.    │  │
│  │ [ Problem-solve it ▸ ]    │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

Reclassifying a recurring fight from *failure to solve* to *perpetual issue to dialogue* is one of the strongest despair-reducing moves available. Classification logic in §7.4.

---

### S-26 — Trends

```
┌─────────────────────────────────┐
│  ← Over time      [ 6 months ▾ ]│
│                                 │
│  Time to repair ✓ improving     │
│  ┌───────────────────────────┐  │
│  │ 40h╲                      │  │
│  │     ╲──╲                  │  │
│  │         ╲──╲___  6h       │  │
│  └───────────────────────────┘  │
│  This is the number that        │
│  matters most.                  │
│                                 │
│  Connection ratio               │
│  ┌───────────────────────────┐  │
│  │ ─╱╲──╱╲─── 6.2:1          │  │
│  └───────────────────────────┘  │
│                                 │
│  Repair attempts landing        │
│  ┌───────────────────────────┐  │
│  │ 30% → 71%                 │  │
│  └───────────────────────────┘  │
│                                 │
│  Contempt          0 in 60 days │
│  Defensiveness  ▓▓▓▓░ still     │
│                  common for you │
│                                 │
│  Satisfaction (CSI)             │
│  ┌───────────────────────────┐  │
│  │ ──╱────╱──                │  │
│  └───────────────────────────┘  │
│  [ Retake — due in 12 days ]    │
│                                 │
│  Conflict frequency  4.2/month  │
│  Roughly unchanged — and that's │
│  fine. Frequency isn't the      │
│  target. Recovery is.           │
└─────────────────────────────────┘
```

Conflict frequency is shown **last and de-emphasised**, with an explicit note. Making frequency the target incentivises conflict avoidance, which predicts worse outcomes than well-managed conflict.

---

### S-28 — Aftermath of a Fight protocol

Five-step guided sequence, doable solo or together. One step per screen.

```
┌─────────────────────────────────┐
│  ← Aftermath        Step 2 of 5 │
│  ▓▓▓▓░░░░░░                     │
│                                 │
│  Two realities                  │
│                                 │
│  Say what you experienced —     │
│  what you saw, heard, felt.     │
│  No interpreting them. No       │
│  "you made me".                 │
│                                 │
│  My side:                       │
│  [_______________________]      │
│                                 │
│  Then swap. When they speak,    │
│  your only job is to be able    │
│  to summarise it back well      │
│  enough that they say "yes,     │
│  that's it."                    │
│                                 │
│  ☐ I summarised theirs and      │
│    they confirmed I got it      │
│  ☐ I found something in their   │
│    version that makes sense,    │
│    even a little               │
│                                 │
│  Both realities are real. You   │
│  are not establishing facts.    │
│                                 │
│         [ Next ]                │
└─────────────────────────────────┘
```

Steps: (1) Feelings — name without justifying · (2) Two realities — describe and validate · (3) Triggers — what this touched from earlier in life · (4) Own your part · (5) One concrete thing each next time.

---

### S-29 — Softened start-up rewriter

Triggered when a harsh start-up or criticism is logged, or opened directly.

```
┌─────────────────────────────────┐
│  ← Say it so it can be heard    │
│                                 │
│  What you want to say:          │
│  [ You never help with          │
│    anything around here.      ]  │
│                                 │
│         ↓                       │
│                                 │
│  ┌───────────────────────────┐  │
│  │ I feel [ overwhelmed ▾ ]  │  │
│  │ about [ how the evening   │  │
│  │ jobs are landing on me  ] │  │
│  │ and I need [ us to split  │  │
│  │ bedtime this week       ] │  │
│  └───────────────────────────┘  │
│                                 │
│  "I feel ___ about ___ and I    │
│  need ___."                     │
│                                 │
│  Three rules: describe, don't   │
│  judge. Talk about the          │
│  situation, not their           │
│  character. Ask for what you    │
│  want, not what you don't.      │
│                                 │
│  Conversations tend to end the  │
│  way they start.                │
│                                 │
│  [ Copy ]      [ Save script ]  │
└─────────────────────────────────┘
```

---

### S-31 — Rituals

```
┌─────────────────────────────────┐
│  ← Rituals                      │
│                                 │
│  Daily                          │
│  ┌───────────────────────────┐  │
│  │ Stress-reducing           │  │
│  │ conversation      20 min  │  │
│  │ Talk about anything       │  │
│  │ except the two of you.    │  │
│  │ Listen. Take their side.  │  │
│  │ Don't problem-solve.      │  │
│  │ ●●●●○○○  4 of 7 this week │  │
│  │ [ Start ▸ ]               │  │
│  └───────────────────────────┘  │
│                                 │
│  Weekly                         │
│  ┌───────────────────────────┐  │
│  │ State of the Union 45 min │  │
│  │ What went well · what's   │  │
│  │ unfinished · one issue,   │  │
│  │ properly                  │  │
│  │ Next: Sunday 20:00        │  │
│  │ [ Prepare ▸ ]             │  │
│  └───────────────────────────┘  │
│                                 │
│  Micro                          │
│  ☐ Six-second kiss              │
│  ☐ Goodbye: know one thing      │
│    about their day              │
│  ☐ Reunion before logistics     │
└─────────────────────────────────┘
```

---

### S-33 — Sharing & linking

```
┌─────────────────────────────────┐
│  ← Sharing                      │
│                                 │
│  Linked with Ana since 4 Mar    │
│                                 │
│  What Ana can see               │
│  ✓ Things I choose to share,    │
│    one at a time                │
│  ✓ Rituals we do together       │
│                                 │
│  What Ana can never see         │
│  ✗ My journal                   │
│  ✗ Anything I wrote about her   │
│  ✗ When or how often I log      │
│  ✗ My assessment answers        │
│                                 │
│  Ana cannot tell whether you    │
│  have opened this app today.    │
│                                 │
│  Currently shared        3 items│
│  ▸ Sunday — "I felt unimportant"│
│  ▸ Our cycle map                │
│  ▸ 4 appreciations              │
│                                 │
│  [ Withdraw an item ]           │
│  [ Unlink ]                     │
│                                 │
│  Unlinking is immediate and     │
│  doesn't need Ana's agreement.  │
└─────────────────────────────────┘
```

---

### S-35 — Support & crisis resources

Reachable from every screen via the You tab, and auto-surfaced by the rules in §9.

```
┌─────────────────────────────────┐
│  ← Getting more help            │
│                                 │
│  This app can help you notice   │
│  patterns. It can't do what a   │
│  person can.                    │
│                                 │
│  Worth talking to someone if:   │
│  • contempt keeps showing up    │
│  • the same fight for months    │
│  • you feel afraid              │
│  • one of you has checked out   │
│                                 │
│  [ Find a couples therapist ▸ ] │
│  [ Find a therapist for me ▸ ]  │
│                                 │
│  ─────────────────────────      │
│  If you're in danger or in      │
│  crisis right now               │
│  [ Local emergency & support    │
│    lines ▸ ]                    │
│                                 │
│  ⓘ We don't list these by       │
│  default on other screens, so   │
│  the app looks ordinary to      │
│  anyone glancing at your phone. │
└─────────────────────────────────┘
```

---

## 6. Data schema

Types: `uuid`, `str`, `text`, `int`, `dec`, `bool`, `ts`, `date`, `enum`, `enum[]`, `json`.
`Share` column: **N** = never shareable · **O** = opt-in shareable · **A** = always visible in shared view when linked.

---

### 6.1 `user`

| Field | Type | Notes | Share |
|---|---|---|---|
| id | uuid | PK | — |
| created_at | ts | | — |
| display_name | str(60) | | A |
| dob_year | int | Age band only | N |
| gender | enum | `female, male, non_binary, other, undisclosed` | N |
| locale | str(10) | | — |
| timezone | str(40) | Drives ritual and cooldown timing | — |
| onboarding_stage | enum | `welcome, safety, basics, baseline, mode, complete` | — |
| mode | enum | `solo, linked` | — |
| safety_flag | enum | `clear, caution, elevated` | N |
| safety_screened_at | ts | Re-screen every 90 days | N |
| linked_mode_eligible | bool | False if `safety_flag = elevated` | N |
| pin_enabled | bool | | — |
| discreet_mode | bool | Neutral app name and icon | — |

### 6.2 `relationship`

| Field | Type | Notes | Share |
|---|---|---|---|
| id | uuid | PK | — |
| user_id | uuid | FK | — |
| partner_alias | str(60) | Local label only | N |
| partner_user_id | uuid? | Null in solo mode | — |
| status | enum | `dating, engaged, cohabiting, married, civil_union, separated` | O |
| together_since | date | | O |
| cohabiting | bool | | O |
| children_in_home | int | | O |
| in_couples_therapy | bool | Unlocks therapist share | N |
| therapist_share_token | uuid? | Time-boxed, revocable | N |

### 6.3 `conflict_event` — root record

| Field | Type | Notes | Share |
|---|---|---|---|
| id | uuid | PK | — |
| user_id | uuid | FK | — |
| relationship_id | uuid | FK | — |
| created_at | ts | Record creation | — |
| occurred_at | ts | Event start | N |
| duration_min | int? | | N |
| entry_depth | enum | `quick, deep` | N |
| completed_steps | int | 0–7, for resumable flow | — |
| logged_while_flooded | bool | Set if cooldown gate overridden | N |

### 6.4 `conflict_context`

| Field | Type | Notes | Share |
|---|---|---|---|
| conflict_id | uuid | FK, 1:1 | — |
| setting | enum | `home, car, phone, text, work, in_public, travel, other` | N |
| privacy | enum | `alone, children_present, others_present, public` | N |
| vulnerabilities | enum[] | `low_sleep, alcohol, substance, work_stress, money_pressure, illness_pain, inlaws_family, parenting_load, travel_reentry, prolonged_distance, hormonal_cycle, none` | N |
| stress_origin | enum | `internal, external_spillover, both, unclear` | N |
| days_since_positive | int | Derived at write time | N |
| sleep_hours | dec? | Optional, or wearable import (P2) | N |
| alcohol_units | int? | Optional | N |

### 6.5 `conflict_content`

| Field | Type | Notes | Share |
|---|---|---|---|
| conflict_id | uuid | FK, 1:1 | — |
| surface_topic | enum | `money, chores_division, sex_intimacy, time_together, phones_screens, in_laws, parenting, work_hours, jealousy_trust, communication, plans_future, health_habits, pets, mess_order, punctuality, friends_social, alcohol, driving, other` | O |
| surface_topic_detail | str(140) | | N |
| hidden_issue | enum | `power_control, caring, recognition, commitment, trust_integrity, acceptance, autonomy_freedom, closeness_distance, unclear` | O |
| perpetual_theme_id | uuid? | FK, assigned by clustering | O |
| narrative | text | Free text | N |

### 6.6 `conflict_severity`

| Field | Type | Notes | Share |
|---|---|---|---|
| conflict_id | uuid | FK, 1:1 | — |
| peak_intensity | int | 1–5 | N |
| escalation_slope | enum | `slow, gradual, rapid` | N |
| personalisation | enum | `issue_focused, drifted, personal` | N |
| flooding_signs | enum[] | `heart_racing, mind_blank, urge_to_flee, couldnt_hear, none` | N |
| flooded | bool | Derived: any sign ≠ none | N |
| recovery_minutes | int? | Self-settling time | N |
| composite_severity | dec | Derived, §7.1 — internal only, never displayed as a number | N |

### 6.7 `conflict_behaviour` — self-report only

| Field | Type | Notes | Share |
|---|---|---|---|
| conflict_id | uuid | FK, 1:1 | — |
| horsemen | enum[] | `criticism, contempt, defensiveness, stonewalling, none` | N |
| contempt_present | bool | Denormalised; drives alerting | N |
| antidotes | enum[] | `gentle_startup, took_responsibility, stated_need, self_soothed_properly, accepted_influence, none` | N |
| own_contribution | text | "My share of it" | O |

> **Schema-level guarantee:** there is no table, column, or enum anywhere in this system that stores a rating, score, or checklist item describing the *partner's* behaviour, character, or fault. The only partner-directed field is `partner_role` in §6.8 — a descriptive position in the interaction cycle, not a judgement — and `partner_repair_attempt`, which is a *positive* observation. This is a deliberate architectural constraint, not an oversight.

### 6.8 `conflict_cycle` — EFT core

| Field | Type | Notes | Share |
|---|---|---|---|
| conflict_id | uuid | FK, 1:1 | — |
| own_role | enum | `pursue, withdraw, alternating, unclear` | O |
| partner_role | enum? | Perceived; labelled as perception in all UI | N |
| cycle_type | enum | Derived: `pursue_withdraw, withdraw_pursue, attack_attack, withdraw_withdraw, mixed` | O |
| secondary_emotion | enum | `anger, irritation, frustration, coldness, contempt, indifference, anxiety` | N |
| primary_emotion | enum | `hurt, fear, loneliness, shame, rejection, inadequacy, helplessness, feeling_unimportant, feeling_trapped` | **O** |
| attachment_need | enum | `are_you_there_for_me, do_i_matter, do_you_respect_me, can_i_trust_you, do_i_get_to_be_me` | **O** |
| need_voiced | bool | Was the primary emotion actually said aloud? | O |

`primary_emotion` and `attachment_need` are the two fields designed to be shared. They are the disclosures that de-escalate.

### 6.9 `conflict_attribution`

| Field | Type | Notes | Share |
|---|---|---|---|
| conflict_id | uuid | FK, 1:1 | — |
| initial_attribution | text | | N |
| reappraisal | text? | Alternative benign explanation | N |
| locus | enum | `partner, self, situation, both` — derived | N |
| stability | enum | `stable, unstable` — derived | N |
| globality | enum | `global, specific` — derived | N |
| intentionality | enum | `intentional, unintentional` — derived | N |
| attribution_index | dec | −1 (distress-maintaining) → +1 (relationship-enhancing) | N |
| reappraisal_completed | bool | | N |

### 6.10 `conflict_repair`

| Field | Type | Notes | Share |
|---|---|---|---|
| conflict_id | uuid | FK, 1:1 | — |
| own_repair_attempt | bool | | O |
| own_repair_received | bool? | Did it land | N |
| partner_repair_attempt | bool? | | O |
| partner_repair_accepted | bool? | Did I accept it | N |
| repair_types | enum[] | `humour, physical_touch, apology, i_take_responsibility, lets_start_over, expressed_appreciation, asked_for_break, expressed_affection, agreed_to_disagree` | O |
| resolution | enum | `resolved, de_escalated, parked, open, perpetual` | O |
| reconnected | bool | | O |
| reconnected_at | ts? | | N |
| time_to_repair_hours | dec? | Derived | N |
| reconnection_ritual | str(140)? | | O |
| aftermath_completed | bool | S-28 done for this event | O |

### 6.11 `positive_event`

| Field | Type | Notes | Share |
|---|---|---|---|
| id | uuid | PK | — |
| user_id | uuid | FK | — |
| occurred_at | ts | | — |
| type | enum | `appreciation, affection, turned_toward, shared_humour, act_of_service, felt_close, shared_meaning, sexual_intimacy, support_received, support_given` | O |
| note | text? | | O |
| expressed_to_partner | bool | Noticing vs. telling | O |
| intensity | int | 1–3, default 2 | N |
| weight | dec | Ratio weight, §7.2 | — |

### 6.12 `perpetual_theme`

| Field | Type | Notes | Share |
|---|---|---|---|
| id | uuid | PK | — |
| relationship_id | uuid | FK | — |
| label | str(80) | User-editable | O |
| dominant_hidden_issue | enum | | O |
| conflict_count | int | | O |
| first_seen / last_seen | date | | O |
| classification | enum | `solvable, perpetual_dialogue, gridlocked` | O |
| intensity_trend | enum | `rising, flat, falling` | O |
| dreams_explored | bool | S-30 completed | O |
| own_dream / own_core_need | text? | | O |
| acceptance_track_active | bool | IBCT path engaged | O |

### 6.13 `assessment_result`

| Field | Type | Notes | Share |
|---|---|---|---|
| id | uuid | PK | — |
| user_id | uuid | FK | — |
| instrument | enum | `csi16, ecr_s, safety_screen, custom` | N |
| taken_at | ts | | N |
| raw_responses | json | Encrypted at rest | N |
| score | dec | | N |
| subscales | json | e.g. anxiety / avoidance | N |
| band | enum | `low, moderate, high` — internal routing only | N |

Assessment results are **never** shareable, including with a linked partner. Instrument licensing: see §14.

### 6.14 `ritual_instance`

| Field | Type | Notes | Share |
|---|---|---|---|
| id | uuid | PK | — |
| relationship_id | uuid | FK | — |
| ritual_type | enum | `stress_reducing_conversation, state_of_union, six_second_kiss, departure_ritual, reunion_ritual, weekly_date, appreciation_daily` | A |
| scheduled_for / completed_at | ts | | A |
| completed_by | enum | `me, both, neither` | A |
| quality_rating | int? | 1–5 | N |

### 6.15 `shared_item`

| Field | Type | Notes |
|---|---|---|
| id | uuid | PK |
| from_user_id / to_user_id | uuid | FK |
| source_type | enum | `conflict_disclosure, cycle_map, positive_event, appreciation, ritual, dream` |
| source_id | uuid | FK |
| payload | json | **Whitelisted fields only** — enforced server-side against §3.2 |
| shared_at / withdrawn_at | ts | |
| viewed | bool | **Not exposed to sender** |

### 6.16 `intervention_log`

| Field | Type | Notes |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK |
| trigger_rule | str(60) | Rule ID from §8 |
| intervention | enum | `self_soothe, softened_startup, aftermath, dreams, acceptance_track, ratio_nudge, contempt_alert, professional_referral, crisis_resources` |
| surfaced_at / engaged_at / completed_at | ts | |
| outcome | enum? | `completed, dismissed, snoozed` |

---

## 7. Derived metrics

### 7.1 Composite severity (internal only)

```
severity = 0.30·norm(peak_intensity)
         + 0.25·flooded
         + 0.20·personalisation_weight
         + 0.15·norm(escalation_slope)
         + 0.10·norm(recovery_minutes)
```
`personalisation_weight`: issue_focused 0 · drifted 0.5 · personal 1.0

Used for trend lines and clustering. **Never surfaced as a number** — a "7.4/10 fight" is exactly the artefact that turns a log into a ledger.

### 7.2 Connection ratio

```
ratio = Σ(positive_weight) / Σ(negative_weight)   over rolling 14 days

positive_weight = intensity × (expressed_to_partner ? 1.0 : 0.6)
negative_weight = 1 + composite_severity
                     × (contempt_present ? 1.5 : 1.0)
                     × (reconnected ? 0.7 : 1.0)
```
Rationale: unexpressed positives count less (they aren't interactions); contempt is weighted up; successful repair discounts the negative, because repair is what actually determines impact.

Benchmark line at 5:1. Minimum 10 events before display.

### 7.3 Time to repair — **primary outcome metric**

`median(reconnected_at − occurred_at)` over trailing 90 days, with unrepaired events censored at the observation date and flagged separately.

### 7.4 Perpetual issue classification

Cluster on `hidden_issue` + `surface_topic` + narrative embedding similarity (cosine > 0.72).

| Condition | Classification |
|---|---|
| n ≥ 3 over ≥ 60 days, intensity trend flat/falling, repair rate ≥ 50% | `perpetual_dialogue` |
| n ≥ 3 over ≥ 60 days, intensity rising or repair rate < 30% | `gridlocked` |
| n ≤ 2, concrete/situational topic, resolved at least once | `solvable` |

### 7.5 Trigger association

For each vulnerability flag: `lift = P(flag | conflict) / P(flag | baseline day)`.
Display only when n ≥ 8 conflicts, lift ≥ 1.5, and flag appears in ≥ 3 conflicts. Baseline requires ambient day-level logging (P2) or user estimate (v1).

### 7.6 Attribution index trend

Rolling mean of `attribution_index`. A rising index — the same partner behaviour explained less globally and less intentionally over time — is a strong early signal of improvement and typically moves *before* satisfaction scores do.

### 7.7 Repair efficacy

```
own_repair_landing_rate     = own_repair_received / own_repair_attempt
partner_repair_accept_rate  = partner_repair_accepted / partner_repair_attempt
```
The second is the more clinically informative and the one the user can directly change.

---

## 8. Intervention rules engine

| Rule ID | Trigger | Response | Screen |
|---|---|---|---|
| R-01 | `flooded = true` at quick log | Force 20-min cooldown; lock deep log | S-10 |
| R-02 | `criticism` logged, or harsh start-up detected in narrative | Offer softened start-up rewriter | S-29 |
| R-03 | `reconnected = false` at +24h | Repair follow-up push | S-20 |
| R-04 | `reconnected = false` at +72h | Escalate: aftermath protocol strongly surfaced, home card pinned | S-28 |
| R-05 | `contempt_present` twice in 30 days | Contempt-specific education + fondness-and-admiration exercise | Tools |
| R-06 | `contempt_present` four times in 60 days | Professional referral card, non-alarming tone | S-35 |
| R-07 | Ratio < 5:1 for 14 consecutive days | Positive-logging nudge; suggest daily appreciation ritual | S-31 |
| R-08 | Ratio < 3:1 for 21 days | Referral card + Magic Six Hours module | S-35 |
| R-09 | Theme classified `gridlocked` | Dreams Within Conflict invitation | S-30 |
| R-10 | Gridlocked theme unchanged after Dreams completed, +60 days | IBCT acceptance track: unified detachment, empathic joining, tolerance building | Tools |
| R-11 | `own_role = pursue` in ≥ 70% of last 10 conflicts | Cycle education tailored to pursuer position + de-escalation script | S-23 |
| R-12 | `own_role = withdraw` in ≥ 70% of last 10 | Withdrawer-position education: the promised return, re-entry scripts | S-23 |
| R-13 | Same vulnerability flag in ≥ 50% of conflicts, n ≥ 8 | Trigger insight + concrete agreement proposal | S-24 |
| R-14 | `logged_while_flooded = true` | Gentle prompt to revisit the entry after 24h; entry marked internally as lower-reliability | S-22 |
| R-15 | CSI decline > 15% across two administrations | Referral card; suppress optimistic framing copy | S-35 |
| R-16 | Any safety-screen endorsement above threshold | IPV protocol — see §9 | S-35 |
| R-17 | 14 days no logging of any type | Single re-engagement message, then silence. No streak guilt. | — |
| R-18 | `resolution = perpetual` selected by user | Immediate reframe: normalise, reclassify from problem to dialogue | S-25 |

**Rate limiting:** maximum one intervention surfaced per session, two per week, excluding R-01 and R-16 which always fire.

---

## 9. Safety, IPV, and clinical escalation

### 9.1 The core risk

A conflict-tracking app is trivially weaponisable. Three failure modes must be designed out, not policed later:

1. **Surveillance** — a controlling partner compels the other to log, then reads it
2. **Evidence-building** — either partner accumulates a grievance file for use in argument, separation, or custody proceedings
3. **False reassurance** — an abusive dynamic gets reframed as a "communication problem" the app can help with

### 9.2 Mitigations

| Risk | Mitigation |
|---|---|
| Surveillance | PIN/biometric lock; discreet mode (neutral name and icon); no notification content on lock screen; quick-exit control; nothing in the shared view reveals logging frequency or timing |
| Compelled disclosure | Partner-facing surfaces are structurally incapable of showing journal content — enforced by server-side field whitelist, not client logic |
| Evidence-building | No export of raw entries in any format; therapist share is a generated pattern summary only; no severity ranking or sorting; no partner-behaviour fields exist to export |
| Misapplied framing | Safety screen before any relationship content; elevated flag disables linked mode, suppresses improvement framing, and routes to specialist resources |

### 9.3 IPV protocol

Screening uses a validated brief instrument (HITS or WAST-short) embedded in S-02, re-administered every 90 days and after any entry indicating fear or physical incident.

On elevated flag:
- No diagnosis, no accusation, no "you are in an abusive relationship" language
- Neutral, non-directive framing: *"Some of what you've described is outside what this app is built for. Here are people who work specifically with this."*
- Region-appropriate DV resources; no logging of the fact that resources were viewed in any partner-visible surface
- Linked mode permanently disabled for the flagged account until re-screened
- All "strengthen your relationship" copy suppressed

### 9.4 Clinical escalation

Referral cards (R-06, R-08, R-15) use non-catastrophising language and appear once per 30 days maximum. The product never claims to treat, and never predicts relationship outcomes for an individual user — aggregate research findings are described as such, and the copy says so explicitly wherever a benchmark is shown.

### 9.5 Minors and vulnerable users

Age gate at 18+. No accounts for minors. Content moderation on shared free text is out of scope because free text is never shared.

---

## 10. Notifications

| Type | Timing | Constraint |
|---|---|---|
| Repair follow-up | +24h, +72h after unrepaired conflict | Highest priority; content neutral on lock screen |
| Ritual reminder | User-set | Opt-in only |
| Appreciation prompt | Daily, user-set time | Skippable permanently in one tap |
| Assessment due | Every 90 days | One reminder, no nagging |
| Insight ready | On new pattern detection | Max one per week |

**Never sent:** streak alerts, guilt-based re-engagement, conflict-frequency comparisons, anything visible to the partner, anything whose lock-screen text reveals the app's purpose.

---

## 11. Privacy and security architecture

| Layer | Approach |
|---|---|
| At rest | Field-level encryption on all narrative, assessment, and behaviour tables; keys per-user |
| Client | Local-first store with encrypted sync; app works fully offline |
| Auth | Email/passkey + mandatory device-level PIN or biometric |
| Sharing | Server-side whitelist enforcement of shareable fields; client cannot request non-whitelisted fields |
| Analytics | No third-party SDKs in any screen that touches conflict content; product analytics on events only, never payloads |
| Retention | User-initiated deletion is immediate and complete, including from partner's shared view |
| Data sale | Never. Stated in-product, not just in the policy. |
| Regulatory | GDPR (special-category data — health/sex life implications), CCPA; DPIA required pre-launch |
| Therapist access | Time-boxed token (default 30 days), revocable, summary-only, logged |

---

## 12. Roadmap

**Phase 1 — MVP.** Solo mode. S-01 to S-22 (excl. S-16, S-20), S-24, S-26 (partial), S-27, S-29, S-31, S-34, S-35. Self-soothe timer. Ratio and trigger dashboard. **Gate:** safety screen and IPV protocol shipped, DPIA complete.

**Phase 2 — Pattern intelligence.** Cycle map (S-23), perpetual issues (S-25), attribution capture (S-16), full trends, assessments (S-32), Aftermath and Dreams protocols (S-28, S-30). **Gate:** ≥ 60% completion rate on the primary-emotion step.

**Phase 3 — Linked mode.** S-33, S-36, joint rituals, shared cycle map. **Gate:** independent security review of the sharing whitelist; IPV re-screen enforced; adversarial red-team on coercive-use scenarios.

**Phase 4 — Therapist companion.** Read-only summary view, session-prep export, in-app homework assignment. **Gate:** clinical advisory sign-off.

---

## 13. Success metrics

**Primary (outcome).** Median time-to-repair, 90-day trend, cohorted by tenure. **Target:** −30% by day 90.

**Secondary (mechanism).**
- Primary-emotion field completion rate — target ≥ 60% of deep logs
- Connection ratio moving toward 5:1 among users starting below
- Contempt frequency, 60-day trend
- Attribution index trend
- CSI change at 90 and 180 days

**Health / guardrail.**
- Positive-to-conflict *entry* ratio ≥ 2:1 — if inverted, the product is drifting into grievance archiving
- Aftermath protocol completion rate
- Uninstall reasons, qualitatively coded
- **Guardrail:** any evidence of app content being cited during conflicts. Surface in research interviews. If present, redesign sharing.

**Explicitly not a metric:** conflict frequency reduction, session count, time in app, streak length.

---

## 14. Open questions and dependencies

**Licensing.** CSI-16 (Funk & Rogge) is freely available for research and generally permissive, but commercial use requires confirmation with the authors. The **DAS is copyrighted and licensed commercially — do not use.** Gottman Institute materials, the Sound Relationship House model, and named protocol content are proprietary; the *underlying research findings* are public and citable, but protocol wording, branded exercises, and questionnaires require licence. Budget for either licensing or clean-room reimplementation from primary literature. Legal review required before Phase 2.

**Clinical governance.** Appoint a licensed couples therapist (ideally EFT- and Gottman-trained) as clinical advisor with sign-off authority over copy in S-10, S-15, S-25, S-28, S-35 and all of §8 and §9.

**Open design questions.**
1. Should linked mode allow the partner to complete *their* half of the cycle map? High therapeutic value, non-trivial risk of turning into a rebuttal mechanism. Recommend Phase 3 with a mandatory delay between halves.
2. Ambient day-level check-ins are needed for statistically honest trigger baselines (§7.5) but add friction. Recommend a passive 5-second daily mood ping in Phase 2.
3. Wearable HR import would objectify flooding, which is currently self-reported and unreliable. Attractive, but raises the surveillance profile. Recommend deferring past Phase 4.
4. Free-text attribution classification (§6.9) requires either on-device NLP or server processing of the most sensitive text in the system. On-device is strongly preferred even at accuracy cost.
5. Non-English localisation: attachment-need and hidden-issue vocabularies do not translate cleanly. Requires clinical review per locale, not translation.

---

*This specification encodes a clinical position: the product's job is to shorten repair, surface the cycle, and grow the positive base. Any feature that makes it easier to catalogue what a partner did wrong is a defect, however well it performs on engagement.*
