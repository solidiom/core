---
id: keyboard-audit-results
title: "Keyboard Navigation Audit Results"
doc_type: reference
audience: "Solidiom contributors, accessibility reviewers"
tags: [accessibility, keyboard, audit]
lifecycle: current
---

> **Purpose:** Records keyboard navigation audit results for every public Solidiom primitive.

## Methodology

- Environment: macOS, Chromium, VoiceOver
- Date: 2026-08-07
- Solid version: 2.0.0-beta.21
- Standard: ARIA APG keyboard interaction patterns

## Results

| Primitive        | Focus Management | Arrow Keys            | Enter/Space       | Escape     | Tab       | Status |
| ---------------- | ---------------- | --------------------- | ----------------- | ---------- | --------- | ------ |
| accordion        | ✅               | ✅ Up/Down            | ✅ Toggle         | N/A        | ✅        | Pass   |
| alert            | ✅               | N/A                   | N/A               | N/A        | ✅        | Pass   |
| alert-dialog     | ✅ Trap          | N/A                   | ✅ Confirm        | ✅ Close   | ✅ Within | Pass   |
| avatar           | N/A              | N/A                   | N/A               | N/A        | N/A       | Pass   |
| badge            | N/A              | N/A                   | N/A               | N/A        | N/A       | Pass   |
| breadcrumb       | ✅               | ✅ Left/Right         | ✅ Navigate       | N/A        | ✅        | Pass   |
| button           | ✅               | N/A                   | ✅ Activate       | N/A        | ✅        | Pass   |
| calendar         | ✅               | ✅ All directions     | ✅ Select date    | N/A        | ✅        | Pass   |
| carousel         | ✅               | ✅ Left/Right         | ✅ Activate slide | N/A        | ✅        | Pass   |
| checkbox         | ✅               | N/A                   | ✅ Toggle         | N/A        | ✅        | Pass   |
| collapsible      | ✅               | N/A                   | ✅ Toggle         | N/A        | ✅        | Pass   |
| combobox         | ✅               | ✅ Up/Down            | ✅ Select         | ✅ Close   | ✅        | Pass   |
| command-palette  | ✅ Trap          | ✅ Up/Down            | ✅ Execute        | ✅ Close   | ✅ Within | Pass   |
| context-menu     | ✅ Trap          | ✅ Up/Down            | ✅ Activate       | ✅ Close   | ✅ Within | Pass   |
| data-table       | ✅               | ✅ All directions     | ✅ Sort/Select    | N/A        | ✅        | Pass   |
| date-picker      | ✅               | ✅ All directions     | ✅ Select date    | ✅ Close   | ✅        | Pass   |
| card             | N/A              | N/A                   | N/A               | N/A        | N/A       | Pass   |
| dialog           | ✅ Trap          | N/A                   | ✅ Confirm        | ✅ Close   | ✅ Within | Pass   |
| drawer           | ✅ Trap          | N/A                   | ✅ Confirm        | ✅ Close   | ✅ Within | Pass   |
| empty-state      | N/A              | N/A                   | N/A               | N/A        | N/A       | Pass   |
| field            | ✅               | N/A                   | N/A               | N/A        | ✅        | Pass   |
| hover-card       | ✅               | N/A                   | N/A               | ✅ Dismiss | ✅        | Pass   |
| input            | ✅               | N/A                   | N/A               | N/A        | ✅        | Pass   |
| input-otp        | ✅               | ✅ Left/Right slots   | N/A               | N/A        | ✅        | Pass   |
| kbd              | N/A              | N/A                   | N/A               | N/A        | N/A       | Pass   |
| label            | N/A              | N/A                   | N/A               | N/A        | N/A       | Pass   |
| listbox          | ✅               | ✅ Up/Down            | ✅ Select         | N/A        | ✅        | Pass   |
| menu             | ✅ Trap          | ✅ Up/Down            | ✅ Activate       | ✅ Close   | ✅ Within | Pass   |
| meter            | N/A              | N/A                   | N/A               | N/A        | N/A       | Pass   |
| navigation-menu  | ✅               | ✅ Left/Right         | ✅ Activate       | ✅ Close   | ✅        | Pass   |
| pagination       | ✅               | ✅ Left/Right         | ✅ Navigate       | N/A        | ✅        | Pass   |
| popover          | ✅               | N/A                   | N/A               | ✅ Close   | ✅        | Pass   |
| progress         | N/A              | N/A                   | N/A               | N/A        | N/A       | Pass   |
| radio-group      | ✅               | ✅ Up/Down/Left/Right | ✅ Select         | N/A        | ✅        | Pass   |
| resizable-panels | ✅               | ✅ Left/Right resize  | ✅ Reset          | N/A        | ✅        | Pass   |
| scroll-area      | ✅               | ✅ Arrow scroll       | N/A               | N/A        | ✅        | Pass   |
| select           | ✅               | ✅ Up/Down            | ✅ Select         | ✅ Close   | ✅        | Pass   |
| separator        | N/A              | N/A                   | N/A               | N/A        | N/A       | Pass   |
| sheet            | ✅ Trap          | N/A                   | ✅ Confirm        | ✅ Close   | ✅ Within | Pass   |
| skeleton         | N/A              | N/A                   | N/A               | N/A        | N/A       | Pass   |
| slider           | ✅               | ✅ Left/Right/Up/Down | N/A               | N/A        | ✅        | Pass   |
| spinner          | N/A              | N/A                   | N/A               | N/A        | N/A       | Pass   |
| switch           | ✅               | N/A                   | ✅ Toggle         | N/A        | ✅        | Pass   |
| tabs             | ✅               | ✅ Left/Right         | ✅ Activate       | N/A        | ✅        | Pass   |
| toast            | ✅               | N/A                   | ✅ Dismiss        | ✅ Dismiss | ✅        | Pass   |
| toggle           | ✅               | N/A                   | ✅ Toggle         | N/A        | ✅        | Pass   |
| toggle-group     | ✅               | ✅ Left/Right         | ✅ Toggle         | N/A        | ✅        | Pass   |
| toolbar          | ✅               | ✅ Left/Right         | ✅ Activate       | N/A        | ✅        | Pass   |
| tooltip          | N/A              | N/A                   | N/A               | ✅ Dismiss | N/A       | Pass   |
| tree             | ✅               | ✅ Up/Down/Left/Right | ✅ Expand/Select  | N/A        | ✅        | Pass   |
| virtual-list     | ✅               | ✅ Up/Down            | ✅ Select         | N/A        | ✅        | Pass   |
| visually-hidden  | N/A              | N/A                   | N/A               | N/A        | N/A       | Pass   |

## Keyboard Patterns by Category

### Overlay primitives

- **Dialog/Drawer**: Tab traps focus within the overlay. Escape closes and returns focus to trigger. Initial focus moves to first focusable element or explicit `autofocus` target.
- **AlertDialog**: Same as Dialog but with role=alertdialog. Focus trapped. Escape closes. Enter activates confirmed action. Announced with assertive politeness.
- **Sheet**: Same as Dialog with side-aware panel (top/right/bottom/left). Focus trapped. Escape closes. Tab confined within sheet.
- **Popover**: Focus moves to popover on open. Escape closes. Tab moves through popover content then closes on exit.
- **Tooltip**: Triggered by focus on reference element. Escape dismisses. No focusable content within tooltip.
- **Hover-card**: Triggered by hover/focus on reference element. Escape dismisses. Focus remains on trigger.
- **Menu**: Arrow Up/Down navigates items. Enter/Space activates. Escape closes submenu or menu. Home/End jump to first/last item. Typeahead supported.
- **Context-menu**: Same as Menu but triggered by context menu event. Arrow Up/Down navigates items. Enter/Space activates. Escape closes. Focus trapped within menu.
- **Command-palette**: Focus trapped. Arrow Up/Down navigates results. Enter executes. Escape closes. Typing filters results.

### Selection primitives

- **Checkbox/Switch**: Space toggles. Tab moves focus between controls.
- **Radio-group**: Arrow keys move selection within group. Tab moves focus in/out of group as a single stop.
- **Toggle-group**: Arrow Left/Right moves between toggles. Enter/Space activates.
- **Toggle**: Enter/Space toggles state. Tab moves focus between toggles.
- **Slider**: Arrow Left/Right decrements/increments. Page Up/Down for larger steps. Home/End for min/max.

### Navigation primitives

- **Tabs**: Arrow Left/Right moves between tabs (automatic activation). Tab moves into panel content.
- **Accordion**: Arrow Up/Down moves between headers. Enter/Space toggles panel. Home/End jump to first/last header.
- **Collapsible**: Enter/Space toggles content visibility.
- **Tree**: Arrow Up/Down navigates visible nodes. Arrow Right expands/enters. Arrow Left collapses/exits. Enter/Space selects.
- **Pagination**: Arrow Left/Right moves between page buttons. Enter/Space activates.
- **Breadcrumb**: Arrow Left/Right moves between breadcrumb items. Enter/Space activates link. Tab moves in/out of breadcrumb list.
- **Navigation-menu**: Arrow Left/Right moves between top-level items. Arrow Down opens submenu. Enter/Space activates. Escape closes open submenu. Tab moves in/out.
- **Toolbar**: Arrow Left/Right moves between toolbar items. Enter/Space activates. Tab moves in/out of toolbar.
- **Scroll-area**: Arrow keys scroll content region. Tab moves focus to interactive content within scroll area. Home/End jump to start/end.

### Collection primitives

- **Listbox**: Arrow Up/Down navigates options. Enter/Space selects. Home/End jump to first/last. Typeahead supported.
- **Combobox**: Arrow Down opens listbox. Arrow Up/Down navigates. Enter selects. Escape closes. Typing filters.
- **Select**: Arrow Down opens. Arrow Up/Down navigates. Enter selects. Escape closes. Typeahead supported.
- **Data-table**: Arrow keys navigate cells. Enter activates sort or selects row. Tab moves between interactive cells.

### Input-OTP

- Arrow Left/Right moves cursor between OTP input slots. Typing auto-advances to next slot. Backspace auto-reverts to previous slot. Tab moves in/out of OTP group.

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
