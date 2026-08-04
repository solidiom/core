---
contentSchemaVersion: 1
title: Chat Interface
description: "Chat Interface block for ai workflows."
keywords: [chat-interface, ai, block, chat interface]
locale: en
maturity: draft
product: Chat Interface
productLayer: block
status: draft
category: "AI"
requiredStates: ["loading", "empty", "error", "restricted"]
---

The Chat Interface block provides a composable ai workflow for managing chat interface operations.

## Usage

Chat Interface composes multiple Solidiom components into a cohesive ai interface. It manages state transitions, data fetching, and user interactions specific to chat interface workflows.

## Dependencies

Chat Interface depends on the following components:

- **Button**
- **Input**
- **Field**
- **Card**
- **Alert**
- **Avatar**
- **Toast**
- **Data Table**
- **Toolbar**
- **Spinner**

## States

Chat Interface implements the following states:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Each state is rendered with appropriate visual indicators and user feedback.

## Data Boundary

Chat Interface operates within the following data boundary: it communicates with the relevant ai service through well-defined APIs. The block does not persist data beyond its session scope; all state is derived from the service layer or user interaction.

## Installation

```sh
pnpm add @solidiom/recipes-css
```

Install the required recipe packages and component dependencies listed above.

## Layout

Chat Interface renders as a responsive container with a header, content area, and action footer. It supports both full-page and embedded layouts, adapting to available viewport space.

## Accessibility

Chat Interface delegates accessibility to its underlying components. Keyboard navigation follows the component-level contracts, and the block provides appropriate landmarks, headings, and ARIA attributes for its composite structure.
