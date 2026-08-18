# @solidiom/site

Target application for the Solidiom website (`https://solidiom.org`). Configuration and
integration wiring were validated by the Astro MDX POC (archived at
`docs/history/poc/docs-astro-poc-findings.md`).

## Baseline commands

```sh
pnpm exec nx run @solidiom/site:check         # astro check
pnpm exec nx run @solidiom/site:build         # static production build -> dist/
pnpm exec nx run @solidiom/site:search-index  # pagefind --site dist
```

`mise run site:validate` runs the CI-equivalent site pipeline: Astro check, boundaries,
i18n validation, template builds, static build, Pagefind indexing, and registry-route
validation. `dev` and `preview` are uncached Nx targets; everything else declares inputs
and outputs for caching.

## Dependency notes

- `cookie` is a **required direct dependency**, not an unused leftover. Astro 7's static
  prerenderer is imported with the app's `dist/` directory as the module-resolution base
  and needs the ESM `cookie` v2 named exports (`parseCookie`, `stringifySetCookie`).
  Without `cookie` declared here, resolution walks out of the repository and can land on
  an unrelated CommonJS `cookie`, which fails the build during "generating static routes".
  Keep it pinned to the same version Astro depends on.
- `shiki` is pinned to keep the Markdown/MDX highlighting theme pair reproducible.
- Versions are exact pins (no ranges) so the static baseline stays reproducible.
