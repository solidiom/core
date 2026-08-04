---
contentSchemaVersion: 1
title: Profile Setup
description: "Profile Setup block for onboard workflows."
keywords: [profile-setup, onboard, block, profile setup]
locale: en
maturity: draft
product: Profile Setup
productLayer: block
status: draft
category: "ONBOARD"
requiredStates: ["loading", "empty", "error", "restricted"]
---

The Profile Setup block provides a composable onboard workflow for managing profile setup operations.

## Usage

Profile Setup composes multiple Solidiom components into a cohesive onboard interface. It manages state transitions, data fetching, and user interactions specific to profile setup workflows.

## Dependencies

Profile Setup depends on the following components:

- **Button**
- **Input**
- **Field**
- **Card**
- **Alert**
- **Toast**
- **Avatar**
- **Spinner**

## States

Profile Setup implements the following states:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Each state is rendered with appropriate visual indicators and user feedback.

## Data Boundary

Profile Setup operates within the following data boundary: it communicates with the relevant onboard service through well-defined APIs. The block does not persist data beyond its session scope; all state is derived from the service layer or user interaction.

## Installation

```sh
pnpm add @solidiom/recipes-css
```

Install the required recipe packages and component dependencies listed above.

## Layout

Profile Setup renders as a responsive container with a header, content area, and action footer. It supports both full-page and embedded layouts, adapting to available viewport space.

## Accessibility

Profile Setup delegates accessibility to its underlying components. Keyboard navigation follows the component-level contracts, and the block provides appropriate landmarks, headings, and ARIA attributes for its composite structure.
