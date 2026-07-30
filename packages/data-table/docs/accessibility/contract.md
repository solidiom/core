---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Data Table accessibility contract
description: Keyboard, focus, semantic, and consumer responsibilities for Data Table.
locale: en
maturity: beta
product: Data Table
productLayer: primitive
status: published
package: "@solidiom/data-table"
primitive: data-table
section: accessibility
keyboard:
  - key: Enter or Space
    behavior: Toggles sort direction on the focused sortable header cell (cycles ascending, descending, none).
  - key: Tab
    behavior: Navigates focus between sortable header cells.
focus:
  - Sortable header cells are focusable via tabindex=0.
  - Non-sortable header cells do not receive focus via Tab.
semantics:
  - Uses native table, thead, th, tbody, tr, and td elements for proper table semantics.
  - aria-sort is applied to the currently sorted column header with ascending or descending value.
aria:
  - aria-sort ascending on the active header when sorted in ascending order.
  - aria-sort descending on the active header when sorted in descending order.
  - aria-selected on rows when row selection mode is enabled (single or multiple).
consumerDuties:
  - Provide meaningful column headers that describe the data in each column.
  - Ensure row data is accessible and does not rely solely on visual cues.
  - Handle empty and loading states with appropriate messaging for assistive technology.
nonApplicableCriteria: []
reviewStatus: draft
---

## Automated evidence

The evidence summary below is generated from the repository's executable axe scan for `@solidiom/data-table`. It records automated checks only; it is not a claim of complete conformance.

## Manual verification

Review keyboard sort toggling, focus movement between headers, zoom/reflow, touch targets, reduced motion, contrast, and screen-reader announcements in the consuming product. A consumer's layout, labels, and workflow can change the accessibility result.
