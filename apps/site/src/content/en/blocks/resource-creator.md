---
contentSchemaVersion: 1
title: Resource Creator
description: "Resource Creator block for resource workflows."
keywords: [resource-creator, resource, block, resource creator]
locale: en
maturity: draft
product: Resource Creator
productLayer: block
status: draft
category: "RESOURCE"
requiredStates: ["loading", "empty", "error", "restricted"]
---

The Resource Creator block provides a composable resource workflow for managing resource creator operations.

## Usage

Resource Creator composes multiple Solidiom components into a cohesive resource interface. It manages state transitions, data fetching, and user interactions specific to resource creator workflows.

## Dependencies

Resource Creator depends on the following components:

- **Button**
- **Input**
- **Field**
- **Card**
- **Alert**
- **Dialog**
- **Select**
- **Tabs**
- **Toast**
- **Checkbox**
- **Switch**
- **Breadcrumb**
- **Progress**
- **Spinner**

## States

Resource Creator implements the following states:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Each state is rendered with appropriate visual indicators and user feedback.

## Data Boundary

Resource Creator operates within the following data boundary: it communicates with the relevant resource service through well-defined APIs. The block does not persist data beyond its session scope; all state is derived from the service layer or user interaction.

## Installation

```sh
pnpm add @solidiom/recipes-css
```

Install the required recipe packages and component dependencies listed above.

## Layout

Resource Creator renders as a responsive container with a header, content area, and action footer. It supports both full-page and embedded layouts, adapting to available viewport space.

## Accessibility

Resource Creator delegates accessibility to its underlying components. Keyboard navigation follows the component-level contracts, and the block provides appropriate landmarks, headings, and ARIA attributes for its composite structure.
