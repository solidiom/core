---
contentSchemaVersion: 1
title: Resource Detail
description: "Resource Detail block for resource workflows."
keywords: [resource-detail, resource, block, resource detail]
locale: en
maturity: draft
product: Resource Detail
productLayer: block
status: draft
category: "RESOURCE"
requiredStates: ["loading", "empty", "error", "restricted"]
---

The Resource Detail block provides a composable resource workflow for managing resource detail operations.

## Usage

Resource Detail composes multiple Solidiom components into a cohesive resource interface. It manages state transitions, data fetching, and user interactions specific to resource detail workflows.

## Dependencies

Resource Detail depends on the following components:

- **Button**
- **Card**
- **Alert**
- **Dialog**
- **Avatar**
- **Tabs**
- **Toast**
- **Breadcrumb**
- **Data Table**
- **Spinner**

## States

Resource Detail implements the following states:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Each state is rendered with appropriate visual indicators and user feedback.

## Data Boundary

Resource Detail operates within the following data boundary: it communicates with the relevant resource service through well-defined APIs. The block does not persist data beyond its session scope; all state is derived from the service layer or user interaction.

## Installation

```sh
pnpm add @solidiom/recipes-css
```

Install the required recipe packages and component dependencies listed above.

## Layout

Resource Detail renders as a responsive container with a header, content area, and action footer. It supports both full-page and embedded layouts, adapting to available viewport space.

## Accessibility

Resource Detail delegates accessibility to its underlying components. Keyboard navigation follows the component-level contracts, and the block provides appropriate landmarks, headings, and ARIA attributes for its composite structure.
