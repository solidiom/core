# Website translation lifecycle policy

This policy implements I18N-004 for content under `apps/site/src/content`.

## Source and review record

Spanish content records the SHA-256 hash of its complete English source in `translationSourceHash`. Each translated entry also records `translationStatus` as `draft`, `human-reviewed`, or `stale`. A `human-reviewed` entry must additionally include `translationReviewedBy` and `translationReviewedAt`.

The hash intentionally covers English frontmatter and body content. Any English change therefore makes the Spanish record stale until a translator reviews it and records the newly generated hash. Run `pnpm --filter @solidiom/site run translation:check` to inspect the current status.

## Release policy

- **Draft and beta content:** translated entries may remain `draft`; the validator reports their state without blocking a release.
- **GA content:** every Spanish counterpart must exist, have a matching source hash, and be `human-reviewed` with review provenance. The validator exits nonzero for violations.
- A translation that is no longer accurate must be marked `stale` or have its old hash retained; neither is permitted for GA content.

Before promoting a content item to `maturity: ga`, a fluent Spanish reviewer must confirm terminology, technical meaning, accessibility guidance, metadata, links, and examples.

## Accessibility content human-review checklist (A11Y-006)

Accessibility contracts (`packages/*/docs/{accessibility,es/accessibility}/contract.md`) and accessibility UI copy carry a higher bar than general prose: an inaccurate translation here can misstate what a primitive actually guarantees. In addition to the standard translation review above, a human reviewer confirms every item below before marking accessibility content `human-reviewed`:

- [ ] Every `keyboard` entry's translated `behavior` describes the same key and outcome as the English source — not a paraphrase that drops a detail (e.g. which control receives focus, what "closes" versus "dismisses" means).
- [ ] `focus`, `semantics`, and `aria` statements preserve exact ARIA role/attribute names (`role="dialog"`, `aria-modal`, `aria-haspopup`, etc.) untranslated, per the glossary's `doNotTranslate` terms.
- [ ] `consumerDuties` translations preserve the obligation as a "must" statement — a softened translation (e.g. turning a requirement into a suggestion) is a defect, not a stylistic choice.
- [ ] `nonApplicableCriteria` rationale is translated in full; a truncated or summarized rationale is rejected even if grammatically correct.
- [ ] Accessibility terminology (`accessibility`, `keyboard`, `focus`, `screen reader`, `reduced motion`, `contrast`, `touch target`, etc.) matches `TERMINOLOGY_GLOSSARY` in `apps/site/src/lib/translation.ts`; assistive-technology product names (VoiceOver, NVDA, JAWS, TalkBack) and standard names (WCAG, ARIA, axe-core) remain untranslated.
- [ ] The reviewer has read both the English and Spanish `AccessibilityEvidence.astro` rendering (contract fields plus generated evidence) for the primitive and confirms neither locale overstates conformance beyond what the automated evidence and manual matrix (`docs/results/manual-evidence-matrix.md`) support.
- [ ] `reviewedBy`/`reviewedAt` on the Spanish contract identify the person who performed this checklist, separately from whoever wrote the English contract.

A GA primitive's Spanish accessibility contract is not `human-reviewed` until every box above is checked, in addition to passing `pnpm --filter @solidiom/site run translation:check`.

## Terminology and source integrity

`apps/site/src/lib/translation.ts` is the canonical glossary. The validator enforces protected Solidiom, framework, package, API, command, and technical literals where they appear in translated prose. Code, package names, attributes, commands, and identifiers remain unchanged. Preferred translated glossary terms are checked in prose when the canonical English form appears.

## Required closure checks

A translation item is complete only when all of the following pass:

```sh
pnpm --filter @solidiom/site run route-parity
pnpm --filter @solidiom/site run translation:check
pnpm --filter @solidiom/site check
pnpm exec nx run @solidiom/site:build
```

The browser suite additionally verifies locale routes, keyboard activation of the language switcher, persisted preference without URL overrides, and canonical/`hreflang` tags.
