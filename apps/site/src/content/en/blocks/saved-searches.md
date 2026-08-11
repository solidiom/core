---
contentSchemaVersion: 1
title: Saved Searches
description: "Saved Searches block for search workflows."
keywords: [saved-searches, search, block, saved searches]
locale: en
maturity: draft
product: Saved Searches
productLayer: block
status: published
category: "SEARCH"
requiredStates: ["loading", "empty", "error", "restricted"]
---

The Saved Searches block provides a composable search workflow for managing saved searches operations.

## Usage

Saved Searches composes multiple Solidiom components into a cohesive search interface. It manages state transitions, data fetching, and user interactions specific to saved searches workflows.

## Dependencies

Saved Searches depends on the following components:

- **Button**
- **Input**
- **Field**
- **Card**
- **Alert**
- **Dialog**
- **Select**
- **Tabs**
- **Checkbox**
- **Switch**
- **Data Table**
- **Spinner**

## States

Saved Searches implements the following states:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Each state is rendered with appropriate visual indicators and user feedback.

## Data Boundary

Saved Searches operates within the following data boundary: it communicates with the relevant search service through well-defined APIs. The block does not persist data beyond its session scope; all state is derived from the service layer or user interaction.

## Installation

```sh
pnpm add @solidiom/recipes-css
```

Install the required recipe packages and component dependencies listed above.

## Layout

Saved Searches renders as a responsive container with a header, content area, and action footer. It supports both full-page and embedded layouts, adapting to available viewport space.

## Accessibility

Saved Searches delegates accessibility to its underlying components. Keyboard navigation follows the component-level contracts, and the block provides appropriate landmarks, headings, and ARIA attributes for its composite structure.
