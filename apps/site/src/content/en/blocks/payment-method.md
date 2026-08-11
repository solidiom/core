---
contentSchemaVersion: 1
title: Payment Method
description: "Payment Method block for billing workflows."
keywords: [payment-method, billing, block, payment method]
locale: en
maturity: draft
product: Payment Method
productLayer: block
status: published
category: "BILLING"
requiredStates: ["loading", "empty", "error", "restricted"]
---

The Payment Method block provides a composable billing workflow for managing payment method operations.

## Usage

Payment Method composes multiple Solidiom components into a cohesive billing interface. It manages state transitions, data fetching, and user interactions specific to payment method workflows.

## Dependencies

Payment Method depends on the following components:

- **Button**
- **Input**
- **Field**
- **Card**
- **Alert**
- **Dialog**
- **Avatar**
- **Select**
- **Toast**
- **Spinner**

## States

Payment Method implements the following states:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Each state is rendered with appropriate visual indicators and user feedback.

## Data Boundary

Payment Method operates within the following data boundary: it communicates with the relevant billing service through well-defined APIs. The block does not persist data beyond its session scope; all state is derived from the service layer or user interaction.

## Installation

```sh
pnpm add @solidiom/recipes-css
```

Install the required recipe packages and component dependencies listed above.

## Layout

Payment Method renders as a responsive container with a header, content area, and action footer. It supports both full-page and embedded layouts, adapting to available viewport space.

## Accessibility

Payment Method delegates accessibility to its underlying components. Keyboard navigation follows the component-level contracts, and the block provides appropriate landmarks, headings, and ARIA attributes for its composite structure.
