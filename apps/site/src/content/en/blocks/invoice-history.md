---
contentSchemaVersion: 1
title: Invoice History
description: "Invoice History block for billing workflows."
keywords: [invoice-history, billing, block, invoice history]
locale: en
maturity: draft
product: Invoice History
productLayer: block
status: draft
category: "BILLING"
requiredStates: ["loading", "empty", "error", "restricted"]
---

The Invoice History block provides a composable billing workflow for managing invoice history operations.

## Usage

Invoice History composes multiple Solidiom components into a cohesive billing interface. It manages state transitions, data fetching, and user interactions specific to invoice history workflows.

## Dependencies

Invoice History depends on the following components:

- **Button**
- **Input**
- **Card**
- **Select**
- **Data Table**
- **Select**
- **Spinner**

## States

Invoice History implements the following states:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Each state is rendered with appropriate visual indicators and user feedback.

## Data Boundary

Invoice History operates within the following data boundary: it communicates with the relevant billing service through well-defined APIs. The block does not persist data beyond its session scope; all state is derived from the service layer or user interaction.

## Installation

```sh
pnpm add @solidiom/recipes-css
```

Install the required recipe packages and component dependencies listed above.

## Layout

Invoice History renders as a responsive container with a header, content area, and action footer. It supports both full-page and embedded layouts, adapting to available viewport space.

## Accessibility

Invoice History delegates accessibility to its underlying components. Keyboard navigation follows the component-level contracts, and the block provides appropriate landmarks, headings, and ARIA attributes for its composite structure.
