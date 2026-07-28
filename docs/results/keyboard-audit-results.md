---
id: keyboard-audit-results
title: "Keyboard Navigation Audit Results"
doc_type: reference
audience: "Solidiom contributors, accessibility reviewers"
tags: [accessibility, keyboard, audit]
---

> **Purpose:** Records keyboard navigation audit results for every public Solidiom primitive.

## Methodology

- Environment: macOS, Chromium, VoiceOver
- Date: 2026-07-23
- Solid version: 2.0.0-beta.21
- Standard: ARIA APG keyboard interaction patterns

## Results

| Primitive        | Focus Management | Arrow Keys            | Enter/Space       | Escape     | Tab       | Status |
| ---------------- | ---------------- | --------------------- | ----------------- | ---------- | --------- | ------ |
| accordion        | ✅               | ✅ Up/Down            | ✅ Toggle         | N/A        | ✅        | Pass   |
| alert            | ✅               | N/A                   | N/A               | N/A        | ✅        | Pass   |
| badge            | N/A              | N/A                   | N/A               | N/A        | N/A       | Pass   |
| button           | ✅               | N/A                   | ✅ Activate       | N/A        | ✅        | Pass   |
| calendar         | ✅               | ✅ All directions     | ✅ Select date    | N/A        | ✅        | Pass   |
| carousel         | ✅               | ✅ Left/Right         | ✅ Activate slide | N/A        | ✅        | Pass   |
| checkbox         | ✅               | N/A                   | ✅ Toggle         | N/A        | ✅        | Pass   |
| collapsible      | ✅               | N/A                   | ✅ Toggle         | N/A        | ✅        | Pass   |
| combobox         | ✅               | ✅ Up/Down            | ✅ Select         | ✅ Close   | ✅        | Pass   |
| command-palette  | ✅ Trap          | ✅ Up/Down            | ✅ Execute        | ✅ Close   | ✅ Within | Pass   |
| data-table       | ✅               | ✅ All directions     | ✅ Sort/Select    | N/A        | ✅        | Pass   |
| date-picker      | ✅               | ✅ All directions     | ✅ Select date    | ✅ Close   | ✅        | Pass   |
| dialog           | ✅ Trap          | N/A                   | ✅ Confirm        | ✅ Close   | ✅ Within | Pass   |
| drawer           | ✅ Trap          | N/A                   | ✅ Confirm        | ✅ Close   | ✅ Within | Pass   |
| field            | ✅               | N/A                   | N/A               | N/A        | ✅        | Pass   |
| label            | N/A              | N/A                   | N/A               | N/A        | N/A       | Pass   |
| listbox          | ✅               | ✅ Up/Down            | ✅ Select         | N/A        | ✅        | Pass   |
| menu             | ✅ Trap          | ✅ Up/Down            | ✅ Activate       | ✅ Close   | ✅ Within | Pass   |
| meter            | N/A              | N/A                   | N/A               | N/A        | N/A       | Pass   |
| pagination       | ✅               | ✅ Left/Right         | ✅ Navigate       | N/A        | ✅        | Pass   |
| popover          | ✅               | N/A                   | N/A               | ✅ Close   | ✅        | Pass   |
| progress         | N/A              | N/A                   | N/A               | N/A        | N/A       | Pass   |
| radio-group      | ✅               | ✅ Up/Down/Left/Right | ✅ Select         | N/A        | ✅        | Pass   |
| resizable-panels | ✅               | ✅ Left/Right resize  | ✅ Reset          | N/A        | ✅        | Pass   |
| select           | ✅               | ✅ Up/Down            | ✅ Select         | ✅ Close   | ✅        | Pass   |
| separator        | N/A              | N/A                   | N/A               | N/A        | N/A       | Pass   |
| slider           | ✅               | ✅ Left/Right/Up/Down | N/A               | N/A        | ✅        | Pass   |
| switch           | ✅               | N/A                   | ✅ Toggle         | N/A        | ✅        | Pass   |
| tabs             | ✅               | ✅ Left/Right         | ✅ Activate       | N/A        | ✅        | Pass   |
| toast            | ✅               | N/A                   | ✅ Dismiss        | ✅ Dismiss | ✅        | Pass   |
| toggle-group     | ✅               | ✅ Left/Right         | ✅ Toggle         | N/A        | ✅        | Pass   |
| tooltip          | N/A              | N/A                   | N/A               | ✅ Dismiss | N/A       | Pass   |
| tree             | ✅               | ✅ Up/Down/Left/Right | ✅ Expand/Select  | N/A        | ✅        | Pass   |
| virtual-list     | ✅               | ✅ Up/Down            | ✅ Select         | N/A        | ✅        | Pass   |
| visually-hidden  | N/A              | N/A                   | N/A               | N/A        | N/A       | Pass   |

## Keyboard Patterns by Category

### Overlay primitives

- **Dialog/Drawer**: Tab traps focus within the overlay. Escape closes and returns focus to trigger. Initial focus moves to first focusable element or explicit `autofocus` target.
- **Popover**: Focus moves to popover on open. Escape closes. Tab moves through popover content then closes on exit.
- **Tooltip**: Triggered by focus on reference element. Escape dismisses. No focusable content within tooltip.
- **Menu**: Arrow Up/Down navigates items. Enter/Space activates. Escape closes submenu or menu. Home/End jump to first/last item. Typeahead supported.
- **Command-palette**: Focus trapped. Arrow Up/Down navigates results. Enter executes. Escape closes. Typing filters results.

### Selection primitives

- **Checkbox/Switch**: Space toggles. Tab moves focus between controls.
- **Radio-group**: Arrow keys move selection within group. Tab moves focus in/out of group as a single stop.
- **Toggle-group**: Arrow Left/Right moves between toggles. Enter/Space activates.
- **Slider**: Arrow Left/Right decrements/increments. Page Up/Down for larger steps. Home/End for min/max.

### Navigation primitives

- **Tabs**: Arrow Left/Right moves between tabs (automatic activation). Tab moves into panel content.
- **Accordion**: Arrow Up/Down moves between headers. Enter/Space toggles panel. Home/End jump to first/last header.
- **Collapsible**: Enter/Space toggles content visibility.
- **Tree**: Arrow Up/Down navigates visible nodes. Arrow Right expands/enters. Arrow Left collapses/exits. Enter/Space selects.
- **Pagination**: Arrow Left/Right moves between page buttons. Enter/Space activates.

### Collection primitives

- **Listbox**: Arrow Up/Down navigates options. Enter/Space selects. Home/End jump to first/last. Typeahead supported.
- **Combobox**: Arrow Down opens listbox. Arrow Up/Down navigates. Enter selects. Escape closes. Typing filters.
- **Select**: Arrow Down opens. Arrow Up/Down navigates. Enter selects. Escape closes. Typeahead supported.
- **Data-table**: Arrow keys navigate cells. Enter activates sort or selects row. Tab moves between interactive cells.

### Carousel

- Arrow Left/Right navigates slides. Enter/Space activates slide controls. Tab moves between navigation buttons.

### Calendar/DatePicker

- Arrow keys navigate dates in grid. Enter selects date. Page Up/Down changes month. Shift+Page Up/Down changes year.

### Resizable-panels

- Arrow Left/Right (or Up/Down for vertical) resizes panel. Enter resets to default size. Tab moves between resize handles.

### Virtual-list

- Arrow Up/Down scrolls and moves focus through items. Enter/Space selects item. Home/End jump to first/last visible item.

## Known Beta Gaps

- RangeCalendar: Not implemented (deferred post-beta)
- VirtualList: Focus recovery after rapid scroll not fully verified
- Toast: Auto-dismiss timing may interrupt keyboard interaction with stacked toasts
