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
