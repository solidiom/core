---
contentSchemaVersion: 1
title: Account Settings
description: "Account Settings block for settings workflows."
keywords: [account-settings, settings, block, account settings]
locale: en
maturity: draft
product: Account Settings
productLayer: block
status: published
category: "SETTINGS"
requiredStates: ["loading", "empty", "error", "restricted"]
---

The Account Settings block provides a composable settings workflow for managing account settings operations.

## Usage

Account Settings composes multiple Solidiom components into a cohesive settings interface. It manages state transitions, data fetching, and user interactions specific to account settings workflows.

## Dependencies

Account Settings depends on the following components:

- **Button**
- **Input**
- **Field**
- **Card**
- **Tabs**
- **Alert**
- **Toast**
- **Avatar**
- **Spinner**

## States

Account Settings implements the following states:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Each state is rendered with appropriate visual indicators and user feedback.

## Data Boundary

Account Settings operates within the following data boundary: it communicates with the relevant settings service through well-defined APIs. The block does not persist data beyond its session scope; all state is derived from the service layer or user interaction.

## Installation

```sh
pnpm add @solidiom/recipes-css
```

Install the required recipe packages and component dependencies listed above.

## Layout

Account Settings renders as a responsive container with a header, content area, and action footer. It supports both full-page and embedded layouts, adapting to available viewport space.

## Accessibility

Account Settings delegates accessibility to its underlying components. Keyboard navigation follows the component-level contracts, and the block provides appropriate landmarks, headings, and ARIA attributes for its composite structure.
