---
contentSchemaVersion: 1
title: Command Palette
description: "Command Palette block for shell workflows."
keywords: [command-palette-shell, shell, block, command palette]
locale: en
maturity: draft
product: Command Palette
productLayer: block
status: draft
category: "SHELL"
requiredStates: ["loading", "empty", "error", "restricted"]
---

The Command Palette block provides a composable shell workflow for managing command palette shell operations.

## Usage

Command Palette composes multiple Solidiom components into a cohesive shell interface. It manages state transitions, data fetching, and user interactions specific to command palette shell workflows.

## Dependencies

Command Palette depends on the following components:

- **Input**
- **Card**
- **Alert**
- **Avatar**
- **Command Palette**
- **Data Table**
- **Kbd**
- **Spinner**

## States

Command Palette implements the following states:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Each state is rendered with appropriate visual indicators and user feedback.

## Data Boundary

Command Palette operates within the following data boundary: it communicates with the relevant shell service through well-defined APIs. The block does not persist data beyond its session scope; all state is derived from the service layer or user interaction.

## Installation

```sh
pnpm add @solidiom/recipes-css
```

Install the required recipe packages and component dependencies listed above.

## Layout

Command Palette renders as a responsive container with a header, content area, and action footer. It supports both full-page and embedded layouts, adapting to available viewport space.

## Accessibility

Command Palette delegates accessibility to its underlying components. Keyboard navigation follows the component-level contracts, and the block provides appropriate landmarks, headings, and ARIA attributes for its composite structure.
