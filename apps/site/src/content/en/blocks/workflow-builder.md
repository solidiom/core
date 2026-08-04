---
contentSchemaVersion: 1
title: Workflow Builder
description: "Workflow Builder block for ai workflows."
keywords: [workflow-builder, ai, block, workflow builder]
locale: en
maturity: draft
product: Workflow Builder
productLayer: block
status: draft
category: "AI"
requiredStates: ["loading", "empty", "error", "restricted"]
---

The Workflow Builder block provides a composable ai workflow for managing workflow builder operations.

## Usage

Workflow Builder composes multiple Solidiom components into a cohesive ai interface. It manages state transitions, data fetching, and user interactions specific to workflow builder workflows.

## Dependencies

Workflow Builder depends on the following components:

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
- **Switch**
- **Progress**
- **Spinner**

## States

Workflow Builder implements the following states:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Each state is rendered with appropriate visual indicators and user feedback.

## Data Boundary

Workflow Builder operates within the following data boundary: it communicates with the relevant ai service through well-defined APIs. The block does not persist data beyond its session scope; all state is derived from the service layer or user interaction.

## Installation

```sh
pnpm add @solidiom/recipes-css
```

Install the required recipe packages and component dependencies listed above.

## Layout

Workflow Builder renders as a responsive container with a header, content area, and action footer. It supports both full-page and embedded layouts, adapting to available viewport space.

## Accessibility

Workflow Builder delegates accessibility to its underlying components. Keyboard navigation follows the component-level contracts, and the block provides appropriate landmarks, headings, and ARIA attributes for its composite structure.
