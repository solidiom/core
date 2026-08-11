---
contentSchemaVersion: 1
title: Notifications Center
description: "Notifications Center block for shell workflows."
keywords: [notifications-center, shell, block, notifications center]
locale: en
maturity: draft
product: Notifications Center
productLayer: block
status: published
category: "SHELL"
requiredStates: ["loading", "empty", "error", "restricted"]
---

The Notifications Center block provides a composable shell workflow for managing notifications center operations.

## Usage

Notifications Center composes multiple Solidiom components into a cohesive shell interface. It manages state transitions, data fetching, and user interactions specific to notifications center workflows.

## Dependencies

Notifications Center depends on the following components:

- **Button**
- **Card**
- **Alert**
- **Avatar**
- **Badge**
- **Toast**
- **Checkbox**
- **Data Table**
- **Select**
- **Spinner**

## States

Notifications Center implements the following states:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Each state is rendered with appropriate visual indicators and user feedback.

## Data Boundary

Notifications Center operates within the following data boundary: it communicates with the relevant shell service through well-defined APIs. The block does not persist data beyond its session scope; all state is derived from the service layer or user interaction.

## Installation

```sh
pnpm add @solidiom/recipes-css
```

Install the required recipe packages and component dependencies listed above.

## Layout

Notifications Center renders as a responsive container with a header, content area, and action footer. It supports both full-page and embedded layouts, adapting to available viewport space.

## Accessibility

Notifications Center delegates accessibility to its underlying components. Keyboard navigation follows the component-level contracts, and the block provides appropriate landmarks, headings, and ARIA attributes for its composite structure.
