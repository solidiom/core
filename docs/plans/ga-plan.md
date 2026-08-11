---
id: solidiom-ga-plan
title: "Solidiom — GA & Post-GA Plan"
doc_type: plan
audience: "Solidiom project leads, contributors"
tags: [solidiom, plan, ga, v1, v2, post-ga, growth]
lifecycle: active
authority: task definitions for Phase 4, Phase 5, and M6
volatility: medium
date: 2026-08-08
---

# Solidiom — GA & Post-GA Plan

> Tasks remaining after Phase 3 (beta) completion. Phase 4 and 5 are blocked on
> Solid 2 reaching a stable GA release upstream. M6 tasks are implementable now.
>
> Canonical status lives in [`consolidated-plan.md`](./consolidated-plan.md).

---

## 1. Phase 4 — Solid 2 GA / Stable v1

**Blocked on:** Solid 2 GA release upstream (solid-js removes `-beta` prerelease tag).

**Version target:** `v1.0.x`

| Status | ID      | Description                                      | Notes                                                                                   |
| ------ | ------- | ------------------------------------------------ | --------------------------------------------------------------------------------------- |
| [ ]    | Task 69 | Solid 2 GA transition                            | Pin to stable solid-js, remove beta overrides, update solid-matrix.json                 |
| [ ]    | Task 70 | Stable v1 acceptance gate                        | Extend phase3-gate.ts with v1-specific checks (no prerelease deps, full docs, AT audit) |
| [ ]    | Task 71 | External accessibility audit and full AT records | Commission third-party WCAG 2.2 AA audit; record AT results for all 52 primitives       |
| [ ]    | Task 72 | Release candidate hardening                      | Publish RC candidates, soak period, collect ecosystem feedback                          |
| [ ]    | Task 73 | v1 stable release                                | Final publish to npm `latest` tag, update site, announce                                |
| [ ]    | Task 74 | Compile-time optimizations GA                    | Graduate vite-plugin-solidiom transforms from opt-in to recommended defaults            |
| [ ]    | Task 75 | Legacy sunset schedule                           | Document deprecated APIs, set removal timeline for v2                                   |
| [ ]    | Task 76 | v1.x maintenance policy                          | Define backport rules, security patch SLA, EOL timeline                                 |

### Phase 4 Critical Path

```text
Solid 2 GA upstream ─→ Task 69 (transition) ─→ Task 72 (RC hardening)
                                                       │
Task 71 (external audit) ──────────────────────────────┤
Task 74 (compile-time GA) ─────────────────────────────┤
                                                       ↓
                          Task 70 (v1 gate) ─→ Task 73 (v1 release)
                                                       │
                          Task 75 (sunset) ────────────┤
                          Task 76 (maintenance) ───────┘
```

### Phase 4 Acceptance Criteria

- All packages on stable solid-js (no beta/next prerelease)
- External accessibility audit completed with zero critical/serious findings
- RC published and soaked for ≥2 weeks with zero regressions
- Compile-time transforms graduate to default-on with opt-out
- Maintenance policy published covering backport rules and EOL

---

## 2. Phase 5 — Strict Enforcement / v2

**Blocked on:** Phase 4 completion (v1 stable released).

**Version target:** `v2.0.x`

| Status | ID      | Description           | Notes                                                                    |
| ------ | ------- | --------------------- | ------------------------------------------------------------------------ |
| [ ]    | Task 77 | v2 strict enforcement | Remove deprecated APIs, enforce strict mode by default, breaking changes |
| [ ]    | Task 78 | v2 stable release     | Publish v2 to npm, migration guide, announce                             |

### Phase 5 Scope

- Remove all APIs marked deprecated in v1.x sunset schedule
- `strict: true` becomes the default for vite-plugin-solidiom
- Dead-part elimination and recipe extraction enabled by default
- Unused-capability detection fails builds by default (was warning in v1)
- Minimum Solid version bumped to stable GA (drop beta range support)
- Migration guide from v1 → v2 published

---

## 3. M6 — Post-GA Growth

**Blocked on:** Nothing (implementable now). These enhance the live product.

### 3.1 Curated Playground

| Status | ID       | Size | Description                                                      | Depends on            |
| ------ | -------- | ---- | ---------------------------------------------------------------- | --------------------- |
| [ ]    | PLAY-001 | M    | Threat model, sandbox, CSP, protocol, limits, prohibited imports | SITE-012              |
| [ ]    | PLAY-002 | L    | Worker-based TSX/CSS compilation with pinned local deps          | PLAY-001              |
| [ ]    | PLAY-003 | L    | Sandboxed iframe runtime, reset, diagnostics, timeout, teardown  | PLAY-001, PLAY-002    |
| [ ]    | PLAY-004 | M    | Accessible editor/preview/output controls as route-local app     | PLAY-002, SITE-004    |
| [ ]    | PLAY-005 | M    | Curated canonical examples (state, form, overlay, composition)   | CONTENT-005, PLAY-004 |
| [ ]    | PLAY-006 | S    | Categorical analytics only; no source/error payload leakage      | PLAY-003, GOV-004     |
| [ ]    | PLAY-007 | M    | Browser, a11y, CSP, isolation, leak, and boundary tests          | PLAY-001..006         |
| [ ]    | PLAY-008 | S    | Static unsupported-browser fallback with source access           | PLAY-004              |

**Playground Critical Path:**

```text
PLAY-001 (threat model) ─→ PLAY-002 (worker compiler) ─→ PLAY-003 (sandbox)
                                     │                           │
                                     ↓                           ↓
                            PLAY-004 (editor) ──────→ PLAY-005 (examples)
                                                              │
                            PLAY-006 (analytics) ─────────────┤
                                                              ↓
                                                     PLAY-007 (tests)
                            PLAY-008 (fallback) ←──── PLAY-004
```

### 3.2 Marketing & Editorial

| Status | ID      | Size | Description                                          | Depends on        |
| ------ | ------- | ---- | ---------------------------------------------------- | ----------------- |
| [ ]    | MKT-001 | L    | Responsive evidence-based homepage                   | G1, BRAND-004     |
| [ ]    | MKT-002 | M    | Accurate layer landing/directory shells              | REG-003, SITE-004 |
| [ ]    | MKT-003 | M    | Core guide skeletons                                 | CONTENT-002       |
| [ ]    | MKT-004 | M    | Accessibility landing page from real evidence        | A11Y-003          |
| [ ]    | MKT-006 | M    | Technical Enterprise page (no sales/SLA claims)      | GOV-002, REG-003  |
| [ ]    | MKT-007 | S    | GitHub-only community/contributing pages             | GOV-003           |
| [ ]    | MKT-008 | M    | Article: Solid 2 architecture                        | CONTENT-002       |
| [ ]    | MKT-009 | M    | Article: accessible interaction contracts            | CONTENT-002       |
| [ ]    | MKT-010 | M    | Article: source ownership                            | CONTENT-002       |
| [ ]    | MKT-011 | M    | Article: styling-system neutrality                   | CONTENT-002       |
| [ ]    | MKT-012 | M    | Article: building with Solidiom                      | CONTENT-002       |
| [ ]    | MKT-013 | S    | Changelog/migration types, feeds, archives, metadata | CONTENT-002       |

### 3.3 Analytics

| Status | ID            | Size | Description                                        | Depends on        |
| ------ | ------------- | ---- | -------------------------------------------------- | ----------------- |
| [ ]    | ANALYTICS-001 | M    | Typed PostHog adapter; autocapture/replay disabled | GOV-004, SITE-004 |
| [ ]    | ANALYTICS-002 | S    | Tests reject prohibited payload fields             | ANALYTICS-001     |
| [ ]    | ANALYTICS-003 | S    | Production provider configuration outside source   | ANALYTICS-001     |

### 3.4 Newsletter

| Status | ID       | Size | Description                                            | Depends on        |
| ------ | -------- | ---- | ------------------------------------------------------ | ----------------- |
| [ ]    | NEWS-001 | M    | Consent-based bilingual Buttondown flow                | GOV-005, SITE-006 |
| [ ]    | NEWS-002 | S    | Keyboard, error, localization, privacy, endpoint tests | NEWS-001          |

### M6 Exit Checklist

- [ ] Playground live, sandboxed, and passing all security/a11y tests
- [ ] Homepage and landing pages live with real evidence
- [ ] All 5 foundational articles published
- [ ] Analytics live with privacy audit passing
- [ ] Newsletter operational with consent and bilingual support
- [ ] Community/contributing pages live

---

## 4. Summary

| Area                | Tasks  | Status      | Blocker             |
| ------------------- | :----: | ----------- | ------------------- |
| Phase 4 (v1 stable) |   8    | Not started | Solid 2 GA upstream |
| Phase 5 (v2)        |   2    | Not started | Phase 4             |
| M6 Playground       |   8    | Not started | None                |
| M6 Marketing        |   11   | Not started | None                |
| M6 Analytics        |   3    | Not started | None                |
| M6 Newsletter       |   2    | Not started | None                |
| **Total**           | **34** |             |                     |

---

## 5. Recommended Execution Order

1. **Now (parallel):** M6 Marketing (MKT-001–004, MKT-007) + M6 Analytics + M6 Newsletter
2. **Next:** M6 Playground (PLAY-001–008) + M6 Articles (MKT-008–013)
3. **When Solid 2 GA ships:** Phase 4 (Tasks 69–76)
4. **After v1 stable:** Phase 5 (Tasks 77–78)
