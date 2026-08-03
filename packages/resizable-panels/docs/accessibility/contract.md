---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Resizable Panels - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for Resizable Panels.
keywords: [resizable-panels, accessibility, keyboard, focus, aria]
locale: en
maturity: draft
product: Resizable Panels
productLayer: primitive
status: draft
package: "@solidiom/resizable-panels"
primitive: resizable-panels
section: accessibility
keyboard: []
focus:
  - "PanelGroup receives focus via standard tab order."
semantics:
  - 'Carries `data-scope="resizable-panels"` and `data-part` attributes on all parts.'
aria: []
consumerDuties:
  - "Ensure visible labels or aria-label are provided where required."
nonApplicableCriteria: []
reviewStatus: draft
---
