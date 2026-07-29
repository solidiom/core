---
contentSchemaVersion: 1
title: Dialog accessibility contract
description: Keyboard, focus, semantic, and consumer responsibilities for Dialog.
locale: en
maturity: beta
product: Dialog
productLayer: primitive
status: published
package: "@solidiom/dialog"
primitive: dialog
section: accessibility
keyboard:
  - key: Enter or Space
    behavior: Activates the trigger or a focused close action.
  - key: Escape
    behavior: Dismisses the open dialog and returns focus to its trigger.
  - key: Tab and Shift+Tab
    behavior: Keeps focus within a modal dialog while it is open.
focus:
  - Modal Dialog moves focus into its content after it opens.
  - Modal Dialog restores focus to the trigger after dismissal.
  - Background controls are isolated while a modal Dialog is open.
semantics:
  - Content has role dialog and aria-modal=true for modal dialogs.
  - Title and Description are connected to Content with aria-labelledby and aria-describedby.
aria:
  - Trigger exposes aria-haspopup=dialog.
  - Trigger exposes aria-expanded and aria-controls while the dialog is open.
  - Backdrop is hidden from assistive technology.
consumerDuties:
  - Provide a concise Title and Description for every modal Dialog.
  - Keep a visible, keyboard-operable dismissal action unless the workflow has a documented exception.
  - Use an alert dialog for confirmations that require an explicit destructive-action decision.
nonApplicableCriteria:
  - Native portalling is deferred while Solid 2 Portal APIs are unstable; the API contract does not depend on DOM relocation.
reviewStatus: reviewed
---

## Automated evidence

The evidence summary below is generated from the repository’s executable axe scan for `@solidiom/dialog`. It records automated checks only; it is not a claim of complete conformance.

## Manual verification

Review keyboard dismissal, focus restoration, zoom/reflow, touch targets, reduced motion, contrast, and screen-reader announcements in the consuming product. A consumer’s layout, labels, and workflow can change the accessibility result.
