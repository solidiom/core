---
contentSchemaVersion: 1
title: "When the Previews Went Dark: Debugging Cloudflare Pages"
description: "How a single CSP keyword and a combined HTTP header silently broke every interactive primitive and template preview on solidiom.org — and the three fixes that brought them back."
keywords:
  [csp, strict-dynamic, cloudflare-pages, x-frame-options, astro, iframe, debugging, article]
locale: en
maturity: draft
product: "Solidiom"
productLayer: article
status: draft
date: "2026-08-17"
authors:
  - solidiom-core
tags: [operations, security, astro, debugging, solidiom]
---

# When the Previews Went Dark: Debugging Cloudflare Pages

We shipped a site deploy and everything looked fine — until it didn't. The docs rendered, navigation worked, search worked. But two things were quietly, completely broken: the **interactive primitive previews** (the live Solid islands you click on) and the **template previews** (the iframes that show a full starter app running). Both had worked in local development. Both were dead in production.

This is the story of that bug, because it's a good one: nothing threw a build error, nothing 500'd, and the root causes were three unrelated problems that happened to land on the same two features.

## Symptom 1: primitives that refused to wake up

The primitive previews are Astro islands hydrated with `client:visible`. On the deployed site they rendered their static markup and then just... sat there. No hydration, no interactivity.

The browser console told the whole story:

```
Executing inline script violates the following Content Security Policy
directive 'script-src 'self' 'unsafe-inline' 'strict-dynamic''. Either the
'unsafe-inline' keyword, a hash ('sha256-…'), or a nonce ('nonce-…') is
required to enable inline execution. The action has been blocked.
```

Eight of them, back to back.

The culprit was one keyword in our Content Security Policy:

```
script-src 'self' 'unsafe-inline' 'strict-dynamic'
```

Here's the trap. In CSP Level 3, **`'strict-dynamic'` deliberately disables `'self'`, `'unsafe-inline'`, and every host allowlist.** Its entire purpose is to say: "ignore the source lists — trust only scripts that carry a valid nonce or hash, plus whatever those trusted scripts choose to load."

That's a genuinely good security model. But it only works if your initial scripts are nonce- or hash-tagged. Astro's hydration bootstrap is emitted as plain inline scripts with no nonce. So the browser did exactly what we told it to: it saw `'strict-dynamic'`, ignored `'unsafe-inline'`, found no nonce, and blocked every island's bootstrap.

The `'unsafe-inline'` sitting right next to it was pure decoration — silently overridden. The policy _looked_ permissive and _behaved_ like a lockdown.

## Symptom 2: templates that were never even there

The template previews failed differently. Instead of a broken iframe, the page showed a polite fallback message: "Preview not available for this template."

That message is chosen at **build time**. `TemplatePreview.astro` checks whether the pre-built preview file exists and renders either an `<iframe>` or the fallback:

```ts
const previewExists =
  isSafeName &&
  existsSync(resolve(__dirname, "../../public/templates/__preview__", name, "index.html"))
```

The files were definitely on disk — our sync step had copied all 31 of them into `public/`, and they even made it into the final `dist/`. Yet `previewExists` was `false` for every template.

The problem is `__dirname`. It's derived from `import.meta.url`, and that works fine in dev where the component runs from `src/components/`. But when Astro **bundles** the component for a production build, `import.meta.url` no longer points anywhere near `src/components/`. The `../../public/...` relative walk landed in the wrong place, `existsSync` returned `false`, and every single template silently fell back.

No error. No warning. Just a build that confidently rendered "not available" for content that was sitting right next to it.

## Symptom 3: the header that fought itself

Even once we fixed the fallback and got the iframe to render, there was a third landmine waiting. Our `_headers` file did this:

```
/*
  X-Frame-Options: DENY

/templates/__preview__/*
  X-Frame-Options: SAMEORIGIN
```

The intent is reasonable: deny framing everywhere, except allow the site to frame its own template previews. On many platforms a more specific rule _overrides_ a broader one.

Cloudflare Pages doesn't override — it **combines**. The response that actually came back was:

```
X-Frame-Options: DENY, SAMEORIGIN
```

Browsers treat a multi-valued, self-contradicting `X-Frame-Options` as deny. So the same-origin iframe was blocked anyway. And critically, Cloudflare Pages' `_headers` has no way to _remove_ a header inherited from a broader match — so you can't win this fight by being more specific.

## The fixes

Three problems, three fixes.

### 1. Drop `'strict-dynamic'`

We rely on un-nonced inline scripts (that's how Astro hydrates islands), so the honest, working policy is:

```
script-src 'self' 'unsafe-inline'
```

This is the policy we'd _documented_ all along — the deployed header had quietly drifted. `'strict-dynamic'` is worth adopting later, but only paired with build-time nonces or hashes for every inline script. Half of that pattern is worse than neither half.

### 2. Anchor the build-time check to the site root

Instead of trusting `import.meta.url` inside a bundled component, resolve the preview path against known roots and probe each one:

```ts
const previewCandidates = isSafeName
  ? [
      resolve(process.cwd(), "public/templates/__preview__", name, "index.html"),
      resolve(process.cwd(), "apps/site/public/templates/__preview__", name, "index.html"),
      resolve(__dirname, "../../public/templates/__preview__", name, "index.html"),
    ]
  : []
const previewExists = previewCandidates.some((candidate) => existsSync(candidate))
```

The original module-relative path stays as a dev-time fallback, so the check is strictly more robust than before, not just different.

### 3. Make the framing policy consistent

Since Cloudflare combines headers and can't scope an override, `DENY`-everywhere and same-origin previews are mutually exclusive. So we set a single, consistent policy site-wide:

```
X-Frame-Options: SAMEORIGIN
Content-Security-Policy: …; frame-ancestors 'self'; …
```

`SAMEORIGIN` plus `frame-ancestors 'self'` still blocks cross-origin clickjacking — the actual threat — while letting the site frame its own preview content. The per-path override was deleted entirely, because it never could have worked here.

## Lessons

A few things this bug drove home:

- **`'strict-dynamic'` is not additive.** Adding it doesn't tighten an existing allowlist — it replaces the model. If your scripts aren't nonced, it's a kill switch.
- **`import.meta.url` is not stable across a bundler.** Any build-time filesystem check anchored to it is a latent bug. Anchor to the project root instead.
- **Platform header semantics matter.** "More specific overrides broader" is a common assumption and it's wrong on Cloudflare Pages, which combines. Read the response headers, don't assume the config.
- **A green build proves nothing about behavior.** Every one of these failed loudly in the browser and silently in CI. The only reliable verification was loading the deployed pages and reading the console and the real response headers.

The previews are back. And the CSP finally does what its comment always claimed.
