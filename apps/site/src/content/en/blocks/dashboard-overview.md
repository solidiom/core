---
contentSchemaVersion: 1
title: Dashboard Overview
description: "Dashboard Overview block for obs workflows."
keywords: [dashboard-overview, obs, block, dashboard overview]
locale: en
maturity: draft
product: Dashboard Overview
productLayer: block
status: published
category: "OBS"
requiredStates: ["loading", "empty", "error", "restricted"]
---

The Dashboard Overview block provides a composable obs workflow for managing dashboard overview operations.

## Usage

Dashboard Overview composes multiple Solidiom components into a cohesive obs interface. It manages state transitions, data fetching, and user interactions specific to dashboard overview workflows.

## Dependencies

Dashboard Overview depends on the following components:

- **Card**
- **Tabs**
- **Alert**
- **Badge**
- **Data Table**
- **Meter**
- **Progress**
- **Spinner**

## States

Dashboard Overview implements the following states:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Each state is rendered with appropriate visual indicators and user feedback.

## Data Boundary

Dashboard Overview operates within the following data boundary: it communicates with the relevant obs service through well-defined APIs. The block does not persist data beyond its session scope; all state is derived from the service layer or user interaction.

## Installation

```sh
pnpm add @solidiom/recipes-css
```

Install the required recipe packages and component dependencies listed above.

## Layout

Dashboard Overview renders as a responsive container with a header, content area, and action footer. It supports both full-page and embedded layouts, adapting to available viewport space.

## Accessibility

Dashboard Overview delegates accessibility to its underlying components. Keyboard navigation follows the component-level contracts, and the block provides appropriate landmarks, headings, and ARIA attributes for its composite structure.
