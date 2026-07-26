# Semantic Attributes Vocabulary

Solidiom primitives emit semantic `data-*` attributes as stable selectors for styling, inspection, and testing. This document defines the full vocabulary.

## Attribute schema

Every semantic attribute follows:

```
data-scope="<primitive>"    — which primitive owns this element
data-part="<part-name>"     — which part of the primitive
data-state="<state-value>"  — current behavioral state
data-<flag>                 — boolean flags (presence = true)
```

## Scopes

One per primitive. Lowercase kebab-case.

| Scope         | Primitive   |
| ------------- | ----------- |
| `dialog`      | Dialog      |
| `select`      | Select      |
| `calendar`    | Calendar    |
| `carousel`    | Carousel    |
| `popover`     | Popover     |
| `tooltip`     | Tooltip     |
| `menu`        | Menu        |
| `combobox`    | Combobox    |
| `listbox`     | Listbox     |
| `accordion`   | Accordion   |
| `tabs`        | Tabs        |
| `checkbox`    | Checkbox    |
| `radio-group` | Radio Group |
| `switch`      | Switch      |
| `slider`      | Slider      |
| `toast`       | Toast       |
| `collapsible` | Collapsible |

## Parts

Parts are primitive-specific. Common parts across overlay primitives:

| Part          | Usage                                    |
| ------------- | ---------------------------------------- |
| `trigger`     | Element that opens/activates the overlay |
| `content`     | The overlay content container            |
| `portal`      | Portal wrapper (if portalled)            |
| `backdrop`    | Background overlay (modal)               |
| `title`       | Accessible title                         |
| `description` | Accessible description                   |
| `close`       | Close/dismiss button                     |
| `item`        | Collection item                          |
| `indicator`   | Visual state indicator                   |
| `label`       | Label element                            |
| `group`       | Grouping container                       |

## States

| Attribute    | Values                                          | Meaning          |
| ------------ | ----------------------------------------------- | ---------------- |
| `data-state` | `"open"` / `"closed"`                           | Disclosure state |
| `data-state` | `"checked"` / `"unchecked"` / `"indeterminate"` | Selection state  |
| `data-state` | `"active"` / `"inactive"`                       | Activation state |
| `data-state` | `"on"` / `"off"`                                | Toggle state     |

## Boolean flags

Present = true. Absent = false.

| Attribute          | Meaning                             |
| ------------------ | ----------------------------------- |
| `data-disabled`    | Interaction is disabled             |
| `data-readonly`    | Value cannot be changed             |
| `data-required`    | Field is required                   |
| `data-invalid`     | Field has validation errors         |
| `data-placeholder` | Showing placeholder content         |
| `data-highlighted` | Visually highlighted (roving focus) |
| `data-selected`    | Item is selected                    |
| `data-orientation` | `"horizontal"` or `"vertical"`      |

## Rules

1. Only primitives emit semantic attributes. Adapters must never set them.
2. Recipes target semantic attributes. They never set them.
3. Attributes are structurally typed — the set is closed per primitive.
4. `data-scope` + `data-part` uniquely identify an element's role.
5. State values are enumerated — no arbitrary strings.
6. Boolean flags use attribute presence, not `"true"`/`"false"` strings.

## applySemanticAttrs() contract

The `applySemanticAttrs()` helper enforces these rules at the call site:

```ts
applySemanticAttrs({
  scope: "dialog",
  part: "content",
  state: "open",
  disabled: true,
  // ...boolean flags
})
// → { "data-scope": "dialog", "data-part": "content", "data-state": "open", "data-disabled": "" }
```

It returns a plain object suitable for spreading on a JSX element.
