---
contentSchemaVersion: 1
title: Breadcrumb
description: Hierarchical navigation breadcrumb with accessible list structure.
keywords: [breadcrumb, navigation, hierarchy, links, breadcrumb-list]
locale: en
maturity: draft
product: Breadcrumb
productLayer: primitive
status: draft
package: "@solidiom/breadcrumb"
primitive: breadcrumb
section: overview
---

Breadcrumb renders a hierarchical navigation indicator that communicates the current page's location within a navigational hierarchy. It uses semantic list structure with proper ARIA markup for screen reader compatibility.

## Usage

Breadcrumb provides composable parts: `Root`, `List`, `Item`, `Link`, `Separator`, and `Ellipsis`. Compose them to build breadcrumb trails of any depth.

```tsx
import * as Breadcrumb from "@solidiom/breadcrumb"

;<Breadcrumb.Root>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/docs">Docs</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/docs/breadcrumb" current>
        Breadcrumb
      </Breadcrumb.Link>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</Breadcrumb.Root>
```

## Installation

Install the package with `pnpm add @solidiom/breadcrumb`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts and Props

### Root

Wraps the entire breadcrumb navigation. Renders as a `<nav>` element with `aria-label="Breadcrumb"`.

| Prop       | Type          | Default | Description         |
| ---------- | ------------- | ------- | ------------------- |
| `children` | `JSX.Element` | —       | Breadcrumb content. |

### List

Wraps breadcrumb items. Renders as an `<ol>` element.

| Prop       | Type          | Default | Description               |
| ---------- | ------------- | ------- | ------------------------- |
| `children` | `JSX.Element` | —       | List of breadcrumb items. |

### Item

Wraps a single breadcrumb entry. Renders as an `<li>` element.

| Prop       | Type          | Default | Description                      |
| ---------- | ------------- | ------- | -------------------------------- |
| `children` | `JSX.Element` | —       | Item content (typically a Link). |

### Link

Navigation link within a breadcrumb item. Renders as an `<a>` element.

| Prop       | Type          | Default | Description                                                               |
| ---------- | ------------- | ------- | ------------------------------------------------------------------------- |
| `children` | `JSX.Element` | —       | Link text or content.                                                     |
| `href`     | `string`      | —       | Navigation target URL.                                                    |
| `current`  | `boolean`     | `false` | When true, marks the link as the current page with `aria-current="page"`. |

### Separator

Visual separator between breadcrumb items. Renders as a `<span>` with `role="presentation"` and `aria-hidden="true"`.

| Prop       | Type          | Default | Description               |
| ---------- | ------------- | ------- | ------------------------- |
| `children` | `JSX.Element` | `"/"`   | Custom separator content. |

### Ellipsis

Indicates skipped breadcrumb items in a truncated trail. Renders as a `<span>` with `role="presentation"`.

| Prop       | Type          | Default | Description              |
| ---------- | ------------- | ------- | ------------------------ |
| `children` | `JSX.Element` | `"..."` | Custom ellipsis content. |

## Styling

Breadcrumb carries `data-scope="breadcrumb"` and `data-part` attributes on each part (`root`, `list`, `item`, `link`, `separator`, `ellipsis`). Style with appropriate spacing, typography, or colors for your design system. Target elements using the data attributes for robust styling.

## SSR and hydration

Breadcrumb is a passive display element with no interactive state beyond standard link navigation. It renders as static HTML and requires no client-side hydration.
