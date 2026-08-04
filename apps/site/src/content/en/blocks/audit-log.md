---
contentSchemaVersion: 1
title: Audit Log
description: "Audit Log block for admin workflows."
keywords: [audit-log, admin, block, audit log]
locale: en
maturity: draft
product: Audit Log
productLayer: block
status: draft
category: "ADMIN"
requiredStates: ["loading", "empty", "error", "restricted"]
---

The Audit Log block provides a composable admin workflow for managing audit log operations.

## Usage

Audit Log composes multiple Solidiom components into a cohesive admin interface. It manages state transitions, data fetching, and user interactions specific to audit log workflows.

## Dependencies

Audit Log depends on the following components:

- **Input**
- **Card**
- **Select**
- **Checkbox**
- **Data Table**
- **Progress**
- **Select**
- **Spinner**

## States

Audit Log implements the following states:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Each state is rendered with appropriate visual indicators and user feedback.

## Data Boundary

Audit Log operates within the following data boundary: it communicates with the relevant admin service through well-defined APIs. The block does not persist data beyond its session scope; all state is derived from the service layer or user interaction.

## Installation

```sh
pnpm add @solidiom/recipes-css
```

Install the required recipe packages and component dependencies listed above.

## Layout

Audit Log renders as a responsive container with a header, content area, and action footer. It supports both full-page and embedded layouts, adapting to available viewport space.

## Accessibility

Audit Log delegates accessibility to its underlying components. Keyboard navigation follows the component-level contracts, and the block provides appropriate landmarks, headings, and ARIA attributes for its composite structure.
