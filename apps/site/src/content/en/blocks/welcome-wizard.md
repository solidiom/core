---
contentSchemaVersion: 1
title: Welcome Wizard
description: "Welcome Wizard block for onboard workflows."
keywords: [welcome-wizard, onboard, block, welcome wizard]
locale: en
maturity: draft
product: Welcome Wizard
productLayer: block
status: published
category: "ONBOARD"
requiredStates: ["loading", "empty", "error", "restricted"]
---

The Welcome Wizard block provides a composable onboard workflow for managing welcome wizard operations.

## Usage

Welcome Wizard composes multiple Solidiom components into a cohesive onboard interface. It manages state transitions, data fetching, and user interactions specific to welcome wizard workflows.

## Dependencies

Welcome Wizard depends on the following components:

- **Button**
- **Input**
- **Field**
- **Card**
- **Tabs**
- **Progress**
- **Alert**
- **Navigation Menu**
- **Spinner**

## States

Welcome Wizard implements the following states:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Each state is rendered with appropriate visual indicators and user feedback.

## Data Boundary

Welcome Wizard operates within the following data boundary: it communicates with the relevant onboard service through well-defined APIs. The block does not persist data beyond its session scope; all state is derived from the service layer or user interaction.

## Installation

```sh
pnpm add @solidiom/recipes-css
```

Install the required recipe packages and component dependencies listed above.

## Layout

Welcome Wizard renders as a responsive container with a header, content area, and action footer. It supports both full-page and embedded layouts, adapting to available viewport space.

## Accessibility

Welcome Wizard delegates accessibility to its underlying components. Keyboard navigation follows the component-level contracts, and the block provides appropriate landmarks, headings, and ARIA attributes for its composite structure.
