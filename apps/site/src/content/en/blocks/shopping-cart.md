---
contentSchemaVersion: 1
title: Shopping Cart
description: "Shopping Cart block for commerce workflows."
keywords: [shopping-cart, commerce, block, shopping cart]
locale: en
maturity: draft
product: Shopping Cart
productLayer: block
status: published
category: "COMMERCE"
requiredStates: ["loading", "empty", "error", "restricted"]
---

The Shopping Cart block provides a composable commerce workflow for managing shopping cart operations.

## Usage

Shopping Cart composes multiple Solidiom components into a cohesive commerce interface. It manages state transitions, data fetching, and user interactions specific to shopping cart workflows.

## Dependencies

Shopping Cart depends on the following components:

- **Button**
- **Input**
- **Field**
- **Card**
- **Alert**
- **Dialog**
- **Avatar**
- **Select**
- **Toast**
- **Switch**
- **Data Table**
- **Spinner**

## States

Shopping Cart implements the following states:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Each state is rendered with appropriate visual indicators and user feedback.

## Data Boundary

Shopping Cart operates within the following data boundary: it communicates with the relevant commerce service through well-defined APIs. The block does not persist data beyond its session scope; all state is derived from the service layer or user interaction.

## Installation

```sh
pnpm add @solidiom/recipes-css
```

Install the required recipe packages and component dependencies listed above.

## Layout

Shopping Cart renders as a responsive container with a header, content area, and action footer. It supports both full-page and embedded layouts, adapting to available viewport space.

## Accessibility

Shopping Cart delegates accessibility to its underlying components. Keyboard navigation follows the component-level contracts, and the block provides appropriate landmarks, headings, and ARIA attributes for its composite structure.
