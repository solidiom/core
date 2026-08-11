---
contentSchemaVersion: 1
title: Reset Password
description: "Reset Password block for auth workflows."
keywords: [reset-password, auth, block, reset password]
locale: en
maturity: draft
product: Reset Password
productLayer: block
status: published
category: "AUTH"
requiredStates: ["loading", "empty", "error", "restricted"]
---

The Reset Password block provides a composable auth workflow for managing reset password operations.

## Usage

Reset Password composes multiple Solidiom components into a cohesive auth interface. It manages state transitions, data fetching, and user interactions specific to reset password workflows.

## Dependencies

Reset Password depends on the following components:

- **Button**
- **Input**
- **Field**
- **Card**
- **Alert**
- **Toast**
- **Spinner**

## States

Reset Password implements the following states:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Each state is rendered with appropriate visual indicators and user feedback.

## Data Boundary

Reset Password operates within the following data boundary: it communicates with the relevant auth service through well-defined APIs. The block does not persist data beyond its session scope; all state is derived from the service layer or user interaction.

## Installation

```sh
pnpm add @solidiom/recipes-css
```

Install the required recipe packages and component dependencies listed above.

## Layout

Reset Password renders as a responsive container with a header, content area, and action footer. It supports both full-page and embedded layouts, adapting to available viewport space.

## Accessibility

Reset Password delegates accessibility to its underlying components. Keyboard navigation follows the component-level contracts, and the block provides appropriate landmarks, headings, and ARIA attributes for its composite structure.
