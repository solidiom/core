---
id: at-verification-template
title: "AT Verification Record Template"
doc_type: reference
audience: "QA engineers, accessibility specialists"
tags: [accessibility, AT, verification]
lifecycle: current
---

# Assistive Technology Verification Record

## Primitive: _______________

### Test Environment

| AT        | Version | OS         | Browser   |
| --------- | ------- | ---------- | --------- |
| VoiceOver | __      | macOS __   | Safari __ |
| NVDA      | __      | Windows __ | Chrome __ |
| JAWS      | __      | Windows __ | Chrome __ |
| TalkBack  | __      | Android __ | Chrome __ |

### Test Date: _______________

### Tester: _______________

---

## Scenarios

### 1. Component Identification

- [ ] AT announces component role correctly
- [ ] AT announces component label/name
- [ ] AT announces current state (open/closed, checked/unchecked, etc.)

### 2. Keyboard Navigation

- [ ] Tab moves focus to/from component
- [ ] Arrow keys navigate within component (if applicable)
- [ ] Enter/Space activates expected action
- [ ] Escape dismisses (if overlay)

### 3. State Changes

- [ ] AT announces state transitions in real-time
- [ ] Live regions fire for dynamic content (if applicable)
- [ ] Focus management is announced (trap/restore)

### 4. Error States

- [ ] AT announces validation errors
- [ ] AT announces required field status
- [ ] AT announces disabled state

---

## Results

| Scenario       | VoiceOver | NVDA | JAWS | TalkBack |
| -------------- | --------- | ---- | ---- | -------- |
| Identification | ○         | ○    | ○    | ○        |
| Keyboard Nav   | ○         | ○    | ○    | ○        |
| State Changes  | ○         | ○    | ○    | ○        |
| Error States   | ○         | ○    | ○    | ○        |

Legend: ✓ Pass | ✗ Fail | ○ Not tested | N/A Not applicable

## Notes

---

## Sign-off

External audit firm: _______________
Audit date: _______________
Remediation complete: [ ] Yes [ ] No
