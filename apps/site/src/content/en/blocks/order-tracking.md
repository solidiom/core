---
contentSchemaVersion: 1
title: Order Tracking
description: "Order Tracking block for commerce workflows."
keywords: [order-tracking, commerce, block, order tracking]
locale: en
maturity: draft
product: Order Tracking
productLayer: block
status: published
category: "COMMERCE"
requiredStates: ["loading", "empty", "error", "restricted"]
---

The Order Tracking block provides a composable commerce workflow for managing order tracking operations.

## Usage

Order Tracking composes multiple Solidiom components into a cohesive commerce interface. It manages state transitions, data fetching, and user interactions specific to order tracking workflows.

## Dependencies

Order Tracking depends on the following components:

- **Button**
- **Input**
- **Card**
- **Alert**
- **Tabs**
- **Badge**
- **Breadcrumb**
- **Select**
- **Data Table**
- **Progress**
- **Spinner**

## States

Order Tracking implements the following states:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Each state is rendered with appropriate visual indicators and user feedback.

## Data Boundary

Order Tracking operates within the following data boundary: it communicates with the relevant commerce service through well-defined APIs. The block does not persist data beyond its session scope; all state is derived from the service layer or user interaction.

## Installation

```sh
pnpm add @solidiom/recipes-css
```

Install the required recipe packages and component dependencies listed above.

## Layout

Order Tracking renders as a responsive container with a header, content area, and action footer. It supports both full-page and embedded layouts, adapting to available viewport space.

## Accessibility

Order Tracking delegates accessibility to its underlying components. Keyboard navigation follows the component-level contracts, and the block provides appropriate landmarks, headings, and ARIA attributes for its composite structure.
