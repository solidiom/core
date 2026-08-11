---
contentSchemaVersion: 1
title: Sign In
description: "Sign In block for auth workflows."
keywords: [sign-in, auth, block, sign in]
locale: en
maturity: draft
product: Sign In
productLayer: block
status: published
category: "AUTH"
requiredStates: ["loading", "empty", "error", "restricted"]
---

The Sign In block provides a composable auth workflow for managing sign in operations.

## Usage

Sign In composes multiple Solidiom components into a cohesive auth interface. It manages state transitions, data fetching, and user interactions specific to sign in workflows.

## Dependencies

Sign In depends on the following components:

- **Button**
- **Input**
- **Field**
- **Card**
- **Alert**
- **Label**
- **Spinner**

## States

Sign In implements the following states:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Each state is rendered with appropriate visual indicators and user feedback.

## Data Boundary

Sign In operates within the following data boundary: it communicates with the relevant auth service through well-defined APIs. The block does not persist data beyond its session scope; all state is derived from the service layer or user interaction.

## Installation

```sh
pnpm add @solidiom/recipes-css
```

Install the required recipe packages and component dependencies listed above.

## Layout

Sign In renders as a responsive container with a header, content area, and action footer. It supports both full-page and embedded layouts, adapting to available viewport space.

## Accessibility

Sign In delegates accessibility to its underlying components. Keyboard navigation follows the component-level contracts, and the block provides appropriate landmarks, headings, and ARIA attributes for its composite structure.
