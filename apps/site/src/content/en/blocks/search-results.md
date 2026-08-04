---
contentSchemaVersion: 1
title: Search Results
description: "Search Results block for search workflows."
keywords: [search-results, search, block, search results]
locale: en
maturity: draft
product: Search Results
productLayer: block
status: draft
category: "SEARCH"
requiredStates: ["loading", "empty", "error", "restricted"]
---

The Search Results block provides a composable search workflow for managing search results operations.

## Usage

Search Results composes multiple Solidiom components into a cohesive search interface. It manages state transitions, data fetching, and user interactions specific to search results workflows.

## Dependencies

Search Results depends on the following components:

- **Input**
- **Card**
- **Alert**
- **Select**
- **Checkbox**
- **Breadcrumb**
- **Select**
- **Data Table**
- **Spinner**

## States

Search Results implements the following states:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Each state is rendered with appropriate visual indicators and user feedback.

## Data Boundary

Search Results operates within the following data boundary: it communicates with the relevant search service through well-defined APIs. The block does not persist data beyond its session scope; all state is derived from the service layer or user interaction.

## Installation

```sh
pnpm add @solidiom/recipes-css
```

Install the required recipe packages and component dependencies listed above.

## Layout

Search Results renders as a responsive container with a header, content area, and action footer. It supports both full-page and embedded layouts, adapting to available viewport space.

## Accessibility

Search Results delegates accessibility to its underlying components. Keyboard navigation follows the component-level contracts, and the block provides appropriate landmarks, headings, and ARIA attributes for its composite structure.
