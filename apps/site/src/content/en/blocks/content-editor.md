---
contentSchemaVersion: 1
title: Content Editor
description: "Content Editor block for content workflows."
keywords: [content-editor, content, block, content editor]
locale: en
maturity: draft
product: Content Editor
productLayer: block
status: draft
category: "CONTENT"
requiredStates: ["loading", "empty", "error", "restricted"]
---

The Content Editor block provides a composable content workflow for managing content editor operations.

## Usage

Content Editor composes multiple Solidiom components into a cohesive content interface. It manages state transitions, data fetching, and user interactions specific to content editor workflows.

## Dependencies

Content Editor depends on the following components:

- **Button**
- **Input**
- **Field**
- **Card**
- **Alert**
- **Select**
- **Tabs**
- **Toolbar**
- **Toast**
- **Data Table**
- **Spinner**

## States

Content Editor implements the following states:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Each state is rendered with appropriate visual indicators and user feedback.

## Data Boundary

Content Editor operates within the following data boundary: it communicates with the relevant content service through well-defined APIs. The block does not persist data beyond its session scope; all state is derived from the service layer or user interaction.

## Installation

```sh
pnpm add @solidiom/recipes-css
```

Install the required recipe packages and component dependencies listed above.

## Layout

Content Editor renders as a responsive container with a header, content area, and action footer. It supports both full-page and embedded layouts, adapting to available viewport space.

## Accessibility

Content Editor delegates accessibility to its underlying components. Keyboard navigation follows the component-level contracts, and the block provides appropriate landmarks, headings, and ARIA attributes for its composite structure.
