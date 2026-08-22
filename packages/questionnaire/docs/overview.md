---
contentSchemaVersion: 1
title: Questionnaire
description: Multi-step form and survey flow with progress tracking.
keywords: [questionnaire, survey, multi-step, form, wizard, progress, steps]
locale: en
maturity: ga
product: Questionnaire
productLayer: primitive
status: draft
package: "@solidiom/questionnaire"
primitive: questionnaire
section: overview
notApplicable:
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Questionnaire is a multi-step form and survey flow with progress tracking. It uses `createControllableValue` for step management, with navigation controls to move between steps and a submit control to finalize.

## Usage

Compose `Root`, `Step`, `StepTitle`, `StepContent`, `Navigation`, `NextButton`, `PrevButton`, `Progress`, and `Submit`. `NextButton`/`PrevButton` move between steps, `Progress` shows completion, and `Submit` finalizes.

```tsx
import * as Questionnaire from "@solidiom/questionnaire"

;<Questionnaire.Root>
  <Questionnaire.Progress />
  <Questionnaire.Step>
    <Questionnaire.StepTitle>Step one</Questionnaire.StepTitle>
    <Questionnaire.StepContent>{/* fields */}</Questionnaire.StepContent>
  </Questionnaire.Step>
  <Questionnaire.Navigation>
    <Questionnaire.PrevButton>Back</Questionnaire.PrevButton>
    <Questionnaire.NextButton>Next</Questionnaire.NextButton>
    <Questionnaire.Submit>Submit</Questionnaire.Submit>
  </Questionnaire.Navigation>
</Questionnaire.Root>
```

## Installation

Install the package with `pnpm add @solidiom/questionnaire`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

questionnaire exposes 9 parts:

- **Root** — the container that manages step state via `createControllableValue`.
- **Step** — a single step in the flow.
- **StepTitle** — the title for a step.
- **StepContent** — the content region for a step.
- **Navigation** — the container for the step navigation controls.
- **NextButton** — advances to the next step.
- **PrevButton** — returns to the previous step.
- **Progress** — shows completion across the steps.
- **Submit** — finalizes the questionnaire.

## Styling

questionnaire carries `data-scope="questionnaire"` and `data-part` attributes on each part for CSS/recipe targeting.

## Keyboard & behavior

Navigation is driven by the `NextButton` and `PrevButton` controls, which move between steps; `Progress` reflects completion and `Submit` finalizes the flow. The primitive does not define additional keyboard shortcuts of its own.

## Composition

Compose field, input, and button primitives inside each `StepContent` to build the survey; the navigation parts orchestrate movement across steps.

## SSR and hydration

The current step renders as static HTML on the server; step management and navigation handlers activate on hydration.
