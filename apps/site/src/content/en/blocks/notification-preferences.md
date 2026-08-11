---
contentSchemaVersion: 1
title: Notification Preferences
description: "Notification Preferences block for settings workflows."
keywords: [notification-preferences, settings, block, notification preferences]
locale: en
maturity: draft
product: Notification Preferences
productLayer: block
status: published
category: "SETTINGS"
requiredStates: ["loading", "empty", "error", "restricted"]
---

The Notification Preferences block provides a composable settings workflow for managing notification preferences operations.

## Usage

Notification Preferences composes multiple Solidiom components into a cohesive settings interface. It manages state transitions, data fetching, and user interactions specific to notification preferences workflows.

## Dependencies

Notification Preferences depends on the following components:

- **Button**
- **Field**
- **Card**
- **Tabs**
- **Checkbox**
- **Radio Group**
- **Switch**
- **Select**
- **Spinner**

## States

Notification Preferences implements the following states:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Each state is rendered with appropriate visual indicators and user feedback.

## Data Boundary

Notification Preferences operates within the following data boundary: it communicates with the relevant settings service through well-defined APIs. The block does not persist data beyond its session scope; all state is derived from the service layer or user interaction.

## Installation

```sh
pnpm add @solidiom/recipes-css
```

Install the required recipe packages and component dependencies listed above.

## Layout

Notification Preferences renders as a responsive container with a header, content area, and action footer. It supports both full-page and embedded layouts, adapting to available viewport space.

## Accessibility

Notification Preferences delegates accessibility to its underlying components. Keyboard navigation follows the component-level contracts, and the block provides appropriate landmarks, headings, and ARIA attributes for its composite structure.
