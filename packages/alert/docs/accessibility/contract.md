---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Alert - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Alert.
keywords: [alert, accessibility, live-region, screen-reader, aria-label, role-alert, role-status]
locale: en
maturity: draft
product: Alert
productLayer: primitive
status: draft
package: "@solidiom/alert"
primitive: alert
section: accessibility
keyboard: []
focus: []
semantics:
  - 'Renders Root as a `<div>` with `role="alert"` (assertive) or `role="status"` (polite).'
  - "Title renders as an `<h5>` and is wired to `aria-labelledby` on the Root."
  - "Description renders as a `<div>` and is wired to `aria-describedby` on the Root."
  - "IDs are generated with `createStableId` for SSR-safe consistency."
  - 'Carries `data-scope="alert"`, `data-part`, and `data-state` attributes on all parts.'
aria:
  - '`role="alert"` indicates an assertive live region that interrupts the user to announce the message immediately.'
  - '`role="status"` indicates a polite live region that announces the message at the next opportunity without interruption.'
  - "`aria-labelledby` on Root references the Title's stable ID to provide a name for the alert."
  - "`aria-describedby` on Root references the Description's stable ID to provide a description for the alert."
consumerDuties:
  - Always include a Title so screen readers can announce a meaningful alert name.
  - 'Use `assertiveness="polite"` for non-urgent updates like status changes or notifications.'
  - 'Use `assertiveness="assertive"` (default) for critical information that requires immediate attention.'
  - "Do not programmatically remove and re-create the alert to trigger re-announcements; use a polite role or manage `aria-live` changes instead."
nonApplicableCriteria:
  - criterion: keyboard
    rationale: Alert is a non-interactive display element with no keyboard interactions.
  - criterion: focus
    rationale: Alert is a non-interactive display element and does not receive focus. It announces content to assistive technologies without stealing focus.
reviewStatus: draft
---
