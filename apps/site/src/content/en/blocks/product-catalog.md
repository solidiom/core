---
contentSchemaVersion: 1
title: Product Catalog
description: "Product Catalog block for commerce workflows."
keywords: [product-catalog, commerce, block, product catalog]
locale: en
maturity: draft
product: Product Catalog
productLayer: block
status: draft
category: "COMMERCE"
requiredStates: ["loading", "empty", "error", "restricted"]
---

The Product Catalog block provides a composable commerce workflow for managing product catalog operations.

## Usage

Product Catalog composes multiple Solidiom components into a cohesive commerce interface. It manages state transitions, data fetching, and user interactions specific to product catalog workflows.

## Dependencies

Product Catalog depends on the following components:

- **Button**
- **Input**
- **Card**
- **Alert**
- **Select**
- **Avatar**
- **Checkbox**
- **Data Table**
- **Select**
- **Spinner**

## States

Product Catalog implements the following states:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Each state is rendered with appropriate visual indicators and user feedback.

## Data Boundary

Product Catalog operates within the following data boundary: it communicates with the relevant commerce service through well-defined APIs. The block does not persist data beyond its session scope; all state is derived from the service layer or user interaction.

## Installation

```sh
pnpm add @solidiom/recipes-css
```

Install the required recipe packages and component dependencies listed above.

## Layout

Product Catalog renders as a responsive container with a header, content area, and action footer. It supports both full-page and embedded layouts, adapting to available viewport space.

## Accessibility

Product Catalog delegates accessibility to its underlying components. Keyboard navigation follows the component-level contracts, and the block provides appropriate landmarks, headings, and ARIA attributes for its composite structure.
