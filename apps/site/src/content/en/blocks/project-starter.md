---
contentSchemaVersion: 1
title: Project Starter
description: "Project Starter block for onboard workflows."
keywords: [project-starter, onboard, block, project starter]
locale: en
maturity: draft
product: Project Starter
productLayer: block
status: published
category: "ONBOARD"
requiredStates: ["loading", "empty", "error", "restricted"]
---

The Project Starter block provides a composable onboard workflow for managing project starter operations.

## Usage

Project Starter composes multiple Solidiom components into a cohesive onboard interface. It manages state transitions, data fetching, and user interactions specific to project starter workflows.

## Dependencies

Project Starter depends on the following components:

- **Button**
- **Input**
- **Field**
- **Card**
- **Select**
- **Alert**
- **Spinner**

## States

Project Starter implements the following states:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Each state is rendered with appropriate visual indicators and user feedback.

## Data Boundary

Project Starter operates within the following data boundary: it communicates with the relevant onboard service through well-defined APIs. The block does not persist data beyond its session scope; all state is derived from the service layer or user interaction.

## Installation

```sh
pnpm add @solidiom/recipes-css
```

Install the required recipe packages and component dependencies listed above.

## Layout

Project Starter renders as a responsive container with a header, content area, and action footer. It supports both full-page and embedded layouts, adapting to available viewport space.

## Accessibility

Project Starter delegates accessibility to its underlying components. Keyboard navigation follows the component-level contracts, and the block provides appropriate landmarks, headings, and ARIA attributes for its composite structure.
