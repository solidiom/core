---
contentSchemaVersion: 1
title: Resource List
description: "Resource List block for resource workflows."
keywords: [resource-list, resource, block, resource list]
locale: en
maturity: draft
product: Resource List
productLayer: block
status: draft
category: "RESOURCE"
requiredStates: ["loading", "empty", "error", "restricted"]
---

The Resource List block provides a composable resource workflow for managing resource list operations.

## Usage

Resource List composes multiple Solidiom components into a cohesive resource interface. It manages state transitions, data fetching, and user interactions specific to resource list workflows.

## Dependencies

Resource List depends on the following components:

- **Input**
- **Card**
- **Alert**
- **Avatar**
- **Badge**
- **Select**
- **Checkbox**
- **Data Table**
- **Select**
- **Spinner**

## States

Resource List implements the following states:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Each state is rendered with appropriate visual indicators and user feedback.

## Data Boundary

Resource List operates within the following data boundary: it communicates with the relevant resource service through well-defined APIs. The block does not persist data beyond its session scope; all state is derived from the service layer or user interaction.

## Installation

```sh
pnpm add @solidiom/recipes-css
```

Install the required recipe packages and component dependencies listed above.

## Layout

Resource List renders as a responsive container with a header, content area, and action footer. It supports both full-page and embedded layouts, adapting to available viewport space.

## Accessibility

Resource List delegates accessibility to its underlying components. Keyboard navigation follows the component-level contracts, and the block provides appropriate landmarks, headings, and ARIA attributes for its composite structure.
