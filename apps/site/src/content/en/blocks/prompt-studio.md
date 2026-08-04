---
contentSchemaVersion: 1
title: Prompt Studio
description: "Prompt Studio block for ai workflows."
keywords: [prompt-studio, ai, block, prompt studio]
locale: en
maturity: draft
product: Prompt Studio
productLayer: block
status: draft
category: "AI"
requiredStates: ["loading", "empty", "error", "restricted"]
---

The Prompt Studio block provides a composable ai workflow for managing prompt studio operations.

## Usage

Prompt Studio composes multiple Solidiom components into a cohesive ai interface. It manages state transitions, data fetching, and user interactions specific to prompt studio workflows.

## Dependencies

Prompt Studio depends on the following components:

- **Button**
- **Input**
- **Field**
- **Card**
- **Alert**
- **Dialog**
- **Select**
- **Tabs**
- **Data Table**
- **Toast**
- **Checkbox**
- **Spinner**

## States

Prompt Studio implements the following states:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Each state is rendered with appropriate visual indicators and user feedback.

## Data Boundary

Prompt Studio operates within the following data boundary: it communicates with the relevant ai service through well-defined APIs. The block does not persist data beyond its session scope; all state is derived from the service layer or user interaction.

## Installation

```sh
pnpm add @solidiom/recipes-css
```

Install the required recipe packages and component dependencies listed above.

## Layout

Prompt Studio renders as a responsive container with a header, content area, and action footer. It supports both full-page and embedded layouts, adapting to available viewport space.

## Accessibility

Prompt Studio delegates accessibility to its underlying components. Keyboard navigation follows the component-level contracts, and the block provides appropriate landmarks, headings, and ARIA attributes for its composite structure.
