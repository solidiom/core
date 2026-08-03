---
contentSchemaVersion: 1
title: Alert
description: Inline, non-modal alert for status messages with live region semantics.
keywords: [alert, notification, status, live-region, accessibility, info, success, warning, error]
locale: en
maturity: draft
product: Alert
productLayer: primitive
status: draft
package: "@solidiom/alert"
primitive: alert
section: overview
notApplicable:
  - section: composition
    reason: Self-contained primitive with no compound sub-primitives to compose.
  - section: relationships
    reason: No sibling primitives; used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive. No primitive-specific non-obvious behavior exists.
---

Alert renders an inline, non-modal notification area with ARIA live region semantics. It supports four visual variants (info, success, warning, error) and two assertiveness levels (assertive, polite) to control how screen readers announce the message. Title and Description parts are automatically wired via `aria-labelledby` and `aria-describedby` using SSR-safe stable IDs.

## Usage

Alert composes from three composable parts: `Root`, `Title`, and `Description`. Configure the variant and assertiveness through props on `Root`.

```tsx
import * as Alert from "@solidiom/alert"

;<Alert.Root type="info">
  <Alert.Title>Information</Alert.Title>
  <Alert.Description>This is an informational message.</Alert.Description>
</Alert.Root>
```

## Installation

Install the package with `pnpm add @solidiom/alert`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Props

### Root

| Prop            | Type                                          | Default       | Description                                                                                                                                          |
| --------------- | --------------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`          | `"info" \| "success" \| "warning" \| "error"` | `"info"`      | Alert variant that controls visual appearance.                                                                                                       |
| `assertiveness` | `"assertive" \| "polite"`                     | `"assertive"` | Live region assertiveness. Assertive uses `role="alert"` and interrupts the user. Polite uses `role="status"` and announces at the next opportunity. |

### Title

| Prop       | Type          | Default | Description                             |
| ---------- | ------------- | ------- | --------------------------------------- |
| `children` | `JSX.Element` | —       | Title text. Required for accessibility. |

### Description

| Prop       | Type          | Default | Description                      |
| ---------- | ------------- | ------- | -------------------------------- |
| `children` | `JSX.Element` | —       | Body text for the alert message. |

## Styling

Alert carries `data-scope="alert"`, `data-part`, and `data-state` attributes for styling hooks.

| Part        | `data-part`   | `data-state`                                    |
| ----------- | ------------- | ----------------------------------------------- |
| Root        | `root`        | Variant (`info`, `success`, `warning`, `error`) |
| Title       | `title`       | —                                               |
| Description | `description` | —                                               |

Apply your visual recipe using the data attributes for targeting. Root renders as a `<div>`, Title as an `<h5>`, and Description as a `<div>`.

## Keyboard & behavior

This primitive has no keyboard interaction. It renders static content that does not receive focus or respond to key events.

## SSR and hydration

Alert uses `createStableId` for SSR-safe ID generation, ensuring `aria-labelledby` and `aria-describedby` references are consistent between server and client renders.
