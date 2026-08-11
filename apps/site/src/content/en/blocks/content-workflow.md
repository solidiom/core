---
contentSchemaVersion: 1
title: Content Workflow
description: "Content Workflow block for content workflows."
keywords: [content-workflow, content, block, content workflow]
locale: en
maturity: draft
product: Content Workflow
productLayer: block
status: published
category: "CONTENT"
requiredStates: ["loading", "empty", "error", "restricted"]
---

The Content Workflow block provides a composable content workflow for managing content workflow operations.

## Usage

Content Workflow composes multiple Solidiom components into a cohesive content interface. It manages state transitions, data fetching, and user interactions specific to content workflow workflows.

## Dependencies

Content Workflow depends on the following components:

- **Button**
- **Input**
- **Field**
- **Card**
- **Alert**
- **Dialog**
- **Select**
- **Tabs**
- **Badge**
- **Toast**
- **Avatar**
- **Data Table**
- **Breadcrumb**
- **Spinner**

## States

Content Workflow implements the following states:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Each state is rendered with appropriate visual indicators and user feedback.

## Data Boundary

Content Workflow operates within the following data boundary: it communicates with the relevant content service through well-defined APIs. The block does not persist data beyond its session scope; all state is derived from the service layer or user interaction.

## Installation

```sh
pnpm add @solidiom/recipes-css
```

Install the required recipe packages and component dependencies listed above.

## Layout

Content Workflow renders as a responsive container with a header, content area, and action footer. It supports both full-page and embedded layouts, adapting to available viewport space.

## Accessibility

Content Workflow delegates accessibility to its underlying components. Keyboard navigation follows the component-level contracts, and the block provides appropriate landmarks, headings, and ARIA attributes for its composite structure.
