---
contentSchemaVersion: 1
title: Subscription Plans
description: "Subscription Plans block for billing workflows."
keywords: [subscription-plans, billing, block, subscription plans]
locale: en
maturity: draft
product: Subscription Plans
productLayer: block
status: draft
category: "BILLING"
requiredStates: ["loading", "empty", "error", "restricted"]
---

The Subscription Plans block provides a composable billing workflow for managing subscription plans operations.

## Usage

Subscription Plans composes multiple Solidiom components into a cohesive billing interface. It manages state transitions, data fetching, and user interactions specific to subscription plans workflows.

## Dependencies

Subscription Plans depends on the following components:

- **Button**
- **Card**
- **Alert**
- **Dialog**
- **Tabs**
- **Toast**
- **Checkbox**
- **Spinner**

## States

Subscription Plans implements the following states:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Each state is rendered with appropriate visual indicators and user feedback.

## Data Boundary

Subscription Plans operates within the following data boundary: it communicates with the relevant billing service through well-defined APIs. The block does not persist data beyond its session scope; all state is derived from the service layer or user interaction.

## Installation

```sh
pnpm add @solidiom/recipes-css
```

Install the required recipe packages and component dependencies listed above.

## Layout

Subscription Plans renders as a responsive container with a header, content area, and action footer. It supports both full-page and embedded layouts, adapting to available viewport space.

## Accessibility

Subscription Plans delegates accessibility to its underlying components. Keyboard navigation follows the component-level contracts, and the block provides appropriate landmarks, headings, and ARIA attributes for its composite structure.
