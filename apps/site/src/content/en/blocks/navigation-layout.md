---
contentSchemaVersion: 1
title: Navigation Layout
description: "Navigation Layout block for shell workflows."
keywords: [navigation-layout, shell, block, navigation layout]
locale: en
maturity: draft
product: Navigation Layout
productLayer: block
status: published
category: "SHELL"
requiredStates: ["loading", "empty", "error", "restricted"]
---

The Navigation Layout block provides a composable shell workflow for managing navigation layout operations.

## Usage

Navigation Layout composes multiple Solidiom components into a cohesive shell interface. It manages state transitions, data fetching, and user interactions specific to navigation layout workflows.

## Dependencies

Navigation Layout depends on the following components:

- **Button**
- **Alert**
- **Avatar**
- **Badge**
- **Breadcrumbs**
- **Checkbox**
- **Data Table**
- **Navigation Menu**
- **Breadcrumb**
- **Accordion**
- **Spinner**

## States

Navigation Layout implements the following states:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Each state is rendered with appropriate visual indicators and user feedback.

## Data Boundary

Navigation Layout operates within the following data boundary: it communicates with the relevant shell service through well-defined APIs. The block does not persist data beyond its session scope; all state is derived from the service layer or user interaction.

## Installation

```sh
pnpm add @solidiom/recipes-css
```

Install the required recipe packages and component dependencies listed above.

## Layout

Navigation Layout renders as a responsive container with a header, content area, and action footer. It supports both full-page and embedded layouts, adapting to available viewport space.

## Accessibility

Navigation Layout delegates accessibility to its underlying components. Keyboard navigation follows the component-level contracts, and the block provides appropriate landmarks, headings, and ARIA attributes for its composite structure.
