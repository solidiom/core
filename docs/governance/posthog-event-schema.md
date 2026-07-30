---
id: posthog-event-schema
title: "PostHog Event Schema — Privacy Allowlist"
doc_type: reference
audience: "Solidiom platform engineers, privacy reviewers"
tags: [governance, posthog, privacy, analytics, GOV-004]
lifecycle: current
date: 2026-07-27
---

# PostHog Event Schema — Privacy Allowlist

> GOV-004 · Status: Approved
> Implements: docs/website-imp.md §2.3 (Privacy)

## 1. Overview

This document defines the typed event schema for PostHog analytics on
`solidiom.org`. It serves as the **allowlist** — only events defined here
may be emitted. Any event, property, or payload not explicitly listed is
**prohibited**.

## 2. Global Constraints

| Constraint          | Rule                                                    |
| ------------------- | ------------------------------------------------------- |
| Autocapture         | **Disabled** — no automatic click/input/pageview events |
| Session replay      | **Disabled** — no DOM recording or session capture      |
| Heatmaps            | **Disabled** — no cursor or scroll tracking             |
| Feature flags       | Allowed for A/B testing tool/builder behavior only      |
| Group analytics     | Disabled                                                |
| User identification | Anonymous only — no email, name, or account linkage     |

## 3. Prohibited Payloads

The following data types **must never** appear in any event property:

- Search query text or terms
- Source code (user-edited or displayed)
- Theme token values or custom CSS
- Email addresses
- Form field values
- Error stack traces containing user data
- Pathname segments that encode user-generated content
- Free-form text from any input

## 4. Allowed Events

### 4.1 Navigation

| Event       | Properties                                                                                                                    | Notes                                                             |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `page_view` | `path` (pathname only, no query), `locale` (`en`\|`es`), `theme` (`light`\|`dark`\|`system`), `referrer_domain` (domain only) | Emitted once per navigation. Path must not contain search params. |

### 4.2 Search

| Event                    | Properties                                                                                | Notes                                                      |
| ------------------------ | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `search_opened`          | `trigger` (`keyboard`\|`click`\|`command`)                                                | User opened the search dialog. **No query text.**          |
| `search_result_selected` | `result_type` (`primitive`\|`component`\|`guide`\|`blog`\|`api`\|`a11y`), `result_locale` | User clicked a result. **No query text, no result title.** |

### 4.3 Theme

| Event           | Properties                                                           | Notes                      |
| --------------- | -------------------------------------------------------------------- | -------------------------- |
| `theme_changed` | `from` (`light`\|`dark`\|`system`), `to` (`light`\|`dark`\|`system`) | Explicit user action only. |

### 4.4 Locale

| Event            | Properties                             | Notes                      |
| ---------------- | -------------------------------------- | -------------------------- |
| `locale_changed` | `from` (`en`\|`es`), `to` (`en`\|`es`) | Explicit user switch only. |

### 4.5 CLI / Install

| Event            | Properties                                                         | Notes                           |
| ---------------- | ------------------------------------------------------------------ | ------------------------------- |
| `install_copied` | `primitive` (name), `method` (`cli`\|`npm`\|`pnpm`\|`yarn`\|`bun`) | User copied an install command. |

### 4.6 Tools (playground and theme builder)

| Event               | Properties                                     | Notes                                                  |
| ------------------- | ---------------------------------------------- | ------------------------------------------------------ |
| `playground_opened` | `example_id` (canonical example name)          | User opened a playground example. **No source code.**  |
| `playground_run`    | `example_id`                                   | User executed the playground. **No source or output.** |
| `builder_opened`    | —                                              | User opened the theme builder.                         |
| `builder_exported`  | `format` (`json`\|`css`\|`tailwind`\|`unocss`) | User exported a theme. **No token values.**            |
| `builder_shared`    | —                                              | User generated a share URL. **No state data.**         |

### 4.7 Newsletter

| Event                   | Properties | Notes                                              |
| ----------------------- | ---------- | -------------------------------------------------- |
| `newsletter_subscribed` | `locale`   | Form submitted successfully. **No email address.** |

## 5. Implementation Requirements

### 5.1 Adapter behavior

- The PostHog adapter must be a typed module with one function per event.
- Each function validates its payload against this schema at the type level.
- Unknown properties cause a TypeScript error (no `Record<string, unknown>` escape).
- The adapter must no-op gracefully when:
  - `window` is undefined (SSR/build time).
  - PostHog fails to load.
  - The environment is not production.

### 5.2 Environment safety

- The PostHog API key must come from Cloudflare environment variables.
- No key may exist in source code, `.env` files, or build output.
- Non-production builds must emit to a no-op sink (console in dev, nothing in CI).

### 5.3 Testing

- Payload tests must prove that calling any event function with a prohibited
  field causes a type error.
- Integration tests must verify that no network request to PostHog contains
  prohibited field names or values matching prohibited patterns.

## 6. Audit Checklist

- [ ] Every event in production code matches an entry in §4.
- [ ] No event carries query text, source code, token values, or email.
- [ ] Autocapture and session replay are confirmed disabled in PostHog project settings.
- [ ] The adapter type-checks against this schema.
- [ ] CI tests verify prohibited payload rejection.
