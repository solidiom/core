/**
 * tools/recipe-contract-definitions — reference recipe definitions (RECIPE-001g).
 *
 * Three definitions chosen to exercise the schema rather than for coverage. Each one
 * expresses something the shipped recipes get wrong, so the emitters in
 * RECIPE-002/003/004 have a fixture that proves the contract fixes it:
 *
 *   button — 6 × 4 variant surface. The CSS profile currently emits eleven
 *            `solidiom-btn--*` classes with no definition anywhere in the package, so
 *            every non-default variant silently renders as the default.
 *   switch — cross-part state. Both profiles use an ancestor selector
 *            (`[data-part="root"][data-state="on"] [data-part="thumb"]`) that the
 *            class-string forms cannot express. Here the thumb carries its own state.
 *   dialog — multi-slot with presence states and a consumer-owned slot. No overlay
 *            stylesheet in either profile styles `open`/`closed` today.
 *
 * These are inputs to the emitters. They are deliberately not wired into any package.
 */
import { CONTRACT_VERSION, type RecipeDefinition } from "./recipe-contract-schema"

/**
 * Button.
 *
 * Fixes docs/recipe-contract-inventory.md: unbacked variant classes in recipes-css, and
 * a stylesheet form that covers only the default variant in both profiles.
 */
export const buttonRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "button",
  description:
    "Action trigger with intent variants, a size scale, and pressed state for the toggle form.",
  slots: [
    {
      part: "root",
      element: "button",
      ownership: "recipe",
      base: {
        display: "inline-flex",
        "align-items": "center",
        "justify-content": "center",
        gap: "0.5rem",
        "white-space": "nowrap",
        "border-style": "none",
        "font-weight": "500",
        cursor: "pointer",
        "border-radius": { token: "radius" },
        transition: "opacity 0.15s, background-color 0.15s",
      },
      states: {
        // The toggle form emits on/off; the plain button emits neither.
        on: { "background-color": { token: "primary" }, color: { token: "primary-foreground" } },
        off: { "background-color": { token: "surface-muted" }, color: { token: "foreground" } },
      },
      flags: {
        disabled: { opacity: "0.5", cursor: "not-allowed", "pointer-events": "none" },
        loading: { opacity: "0.7", cursor: "progress" },
      },
      pseudos: {
        ":focus-visible": {
          outline: "2px solid",
          "outline-color": { token: "focus-ring" },
          "outline-offset": "2px",
        },
      },
    },
  ],
  variants: [
    {
      name: "variant",
      values: {
        default: {
          root: {
            "background-color": { token: "primary" },
            color: { token: "primary-foreground" },
          },
        },
        destructive: {
          root: {
            "background-color": { token: "destructive" },
            color: { token: "destructive-foreground" },
          },
        },
        outline: {
          root: {
            "background-color": "transparent",
            color: { token: "foreground" },
            "border-style": "solid",
            "border-width": "1px",
            "border-color": { token: "border" },
          },
        },
        secondary: {
          root: {
            "background-color": { token: "secondary" },
            color: { token: "secondary-foreground" },
          },
        },
        ghost: {
          root: { "background-color": "transparent", color: { token: "foreground" } },
        },
        link: {
          root: {
            "background-color": "transparent",
            color: { token: "primary" },
            "text-decoration-line": "underline",
            "text-underline-offset": "4px",
          },
        },
      },
    },
    {
      name: "size",
      values: {
        sm: { root: { height: "2.25rem", padding: "0 0.75rem", "font-size": "0.875rem" } },
        md: { root: { height: "2.5rem", padding: "0.5rem 1rem", "font-size": "0.875rem" } },
        lg: { root: { height: "2.75rem", padding: "0 2rem", "font-size": "1rem" } },
        icon: { root: { height: "2.5rem", width: "2.5rem", padding: "0" } },
      },
    },
  ],
  defaultVariants: { variant: "default", size: "md" },
  compoundVariants: [
    {
      // A ghost icon button needs a tighter hit area than a ghost text button.
      when: { variant: "ghost", size: "icon" },
      declarations: { root: { "border-radius": { token: "radius-full" } } },
    },
    {
      // Links have no box, so size padding would misalign the underline.
      when: { variant: "link", size: "md" },
      declarations: { root: { height: "auto", padding: "0" } },
    },
  ],
}

/**
 * Switch.
 *
 * The thumb declares its own `on`/`off` state rather than relying on an ancestor
 * selector, which is what makes the class-string forms emittable (guide §3.2).
 * `packages/switch/src/index.tsx` already emits `data-state` on the thumb part.
 */
export const switchRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "switch",
  description:
    "Binary toggle with a sliding thumb, styled per part so no ancestor state is needed.",
  slots: [
    {
      part: "root",
      element: "button",
      ownership: "recipe",
      base: {
        display: "inline-flex",
        "align-items": "center",
        width: "2.75rem",
        height: "1.5rem",
        padding: "2px",
        "border-radius": { token: "radius-full" },
        "border-style": "none",
        cursor: "pointer",
        "background-color": { token: "surface-input" },
        transition: "background-color 0.15s",
      },
      states: {
        on: { "background-color": { token: "primary" } },
        off: { "background-color": { token: "surface-input" } },
      },
      flags: { disabled: { opacity: "0.5", cursor: "not-allowed", "pointer-events": "none" } },
      pseudos: {
        ":focus-visible": {
          outline: "2px solid",
          "outline-color": { token: "focus-ring" },
          "outline-offset": "2px",
        },
      },
    },
    {
      part: "thumb",
      element: "span",
      ownership: "recipe",
      base: {
        display: "block",
        width: "1.25rem",
        height: "1.25rem",
        "border-radius": { token: "radius-full" },
        "background-color": { token: "surface" },
        "box-shadow": { token: "shadow-sm" },
        transition: "transform 0.15s",
      },
      states: {
        // Declared on the thumb, not inherited from the root's state.
        on: { transform: "translateX(1.25rem)" },
        off: { transform: "translateX(0)" },
      },
    },
  ],
}

/**
 * Dialog.
 *
 * Exercises presence states on two slots and a consumer-owned slot. The `close`
 * exception replaces the `COMPOSED_PART_ALLOWLIST` entry for dialog in
 * tools/audit-recipe-dual-emission.ts.
 */
export const dialogRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "dialog",
  description: "Modal surface with a scrim, presence transitions, and labelled content.",
  slots: [
    {
      part: "backdrop",
      element: "div",
      ownership: "recipe",
      base: {
        position: "fixed",
        inset: "0",
        "background-color": { token: "surface-overlay" },
        transition: "opacity 0.15s",
      },
      states: {
        open: { opacity: "1" },
        closed: { opacity: "0" },
      },
    },
    {
      part: "content",
      element: "div",
      ownership: "recipe",
      base: {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        "max-width": "32rem",
        width: "100%",
        padding: "1.5rem",
        "background-color": { token: "surface-raised" },
        color: { token: "foreground" },
        "border-radius": { token: "radius-lg" },
        "box-shadow": { token: "shadow-lg" },
        transition: "opacity 0.15s, transform 0.15s",
      },
      states: {
        open: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        closed: { opacity: "0", transform: "translate(-50%, -50%) scale(0.96)" },
      },
    },
    {
      part: "title",
      element: "h2",
      ownership: "recipe",
      base: {
        margin: "0",
        "font-size": "1.125rem",
        "font-weight": "600",
        color: { token: "foreground" },
      },
    },
    {
      part: "description",
      element: "p",
      ownership: "recipe",
      base: {
        margin: "0.5rem 0 0",
        "font-size": "0.875rem",
        color: { token: "foreground-muted" },
      },
    },
    {
      part: "close",
      element: "button",
      ownership: "consumer",
      ownershipReason:
        "Close is optional composition — the wrapper exposes Root/Content and the consumer decides whether to render a close affordance.",
      base: {
        position: "absolute",
        top: "0.75rem",
        right: "0.75rem",
        "border-style": "none",
        "background-color": "transparent",
        color: { token: "foreground-muted" },
        cursor: "pointer",
        "border-radius": { token: "radius-sm" },
      },
      pseudos: {
        ":hover": { color: { token: "foreground" } },
        ":focus-visible": {
          outline: "2px solid",
          "outline-color": { token: "focus-ring" },
        },
      },
    },
  ],
}

/** Accordion — disclosure rows with a non-presence content panel. */
export const accordionRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "accordion",
  description: "Vertical disclosure rows with a keyboard-accessible trigger and panel content.",
  slots: [
    {
      part: "item",
      element: "div",
      ownership: "consumer",
      ownershipReason: "The wrapper exposes only Root; consumers supply repeatable items.",
      base: {
        "border-bottom-style": "solid",
        "border-bottom-width": "1px",
        "border-bottom-color": { token: "border" },
      },
    },
    {
      part: "trigger",
      element: "button",
      ownership: "consumer",
      ownershipReason: "The wrapper exposes only Root; consumers supply repeatable triggers.",
      base: {
        display: "flex",
        width: "100%",
        "align-items": "center",
        "justify-content": "space-between",
        padding: "1rem 0",
        "font-size": "0.875rem",
        "font-weight": "500",
        "border-style": "none",
        "background-color": "transparent",
        cursor: "pointer",
        transition: "color 0.15s",
      },
      flags: { disabled: { opacity: "0.5", cursor: "not-allowed" } },
      pseudos: { ":hover": { "text-decoration-line": "underline" } },
    },
    {
      part: "content",
      element: "div",
      ownership: "consumer",
      ownershipReason: "The wrapper exposes only Root; consumers supply repeatable content.",
      base: {
        overflow: "hidden",
        "padding-bottom": "1rem",
        "font-size": "0.875rem",
        color: { token: "foreground-muted" },
      },
    },
  ],
}

/** Alert — semantic status messages rendered from the primitive's data-state. */
export const alertRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "alert",
  description: "Live-region status message with informational, success, warning, and error states.",
  slots: [
    {
      part: "root",
      element: "div",
      ownership: "recipe",
      base: {
        position: "relative",
        display: "flex",
        "flex-direction": "column",
        gap: "0.25rem",
        padding: "1rem",
        "border-style": "solid",
        "border-width": "1px",
        "border-color": { token: "border" },
        "border-radius": { token: "radius" },
        "font-size": "0.875rem",
        "line-height": "1.25rem",
      },
      states: {
        info: {
          "background-color": { token: "info-surface" },
          "border-color": { token: "info-border" },
          color: { token: "info" },
        },
        success: {
          "background-color": { token: "success-surface" },
          "border-color": { token: "success-border" },
          color: { token: "success" },
        },
        warning: {
          "background-color": { token: "warning-surface" },
          "border-color": { token: "warning-border" },
          color: { token: "warning" },
        },
        error: {
          "background-color": { token: "danger-surface" },
          "border-color": { token: "danger-border" },
          color: { token: "danger" },
        },
      },
    },
    {
      part: "title",
      element: "h5",
      ownership: "consumer",
      ownershipReason: "Alert title is optional consumer composition.",
      base: {
        margin: "0",
        "font-size": "0.875rem",
        "font-weight": "600",
        "line-height": "1.25rem",
        "letter-spacing": "-0.01em",
      },
    },
    {
      part: "description",
      element: "div",
      ownership: "consumer",
      ownershipReason: "Alert description is optional consumer composition.",
      base: { "font-size": "0.875rem", "line-height": "1.4", opacity: "0.9" },
    },
  ],
}

/** Badge — compact labels with generated intent variants and variant-specific hover fills. */
export const badgeRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "badge",
  description: "Compact inline label with intent and outline variants.",
  slots: [
    {
      part: "root",
      element: "span",
      ownership: "recipe",
      base: {
        display: "inline-flex",
        "align-items": "center",
        padding: "0.125rem 0.625rem",
        "border-style": "solid",
        "border-width": "1px",
        "border-color": "transparent",
        "border-radius": { token: "radius" },
        "font-size": "0.75rem",
        "line-height": "1rem",
        "font-weight": "600",
        transition: "background-color 0.15s, color 0.15s, border-color 0.15s",
      },
    },
  ],
  variants: [
    {
      name: "variant",
      values: {
        default: {
          root: {
            base: {
              "background-color": { token: "primary" },
              color: { token: "primary-foreground" },
            },
            pseudos: { ":hover": { "background-color": { token: "primary-hover" } } },
          },
        },
        secondary: {
          root: {
            base: {
              "background-color": { token: "secondary" },
              color: { token: "secondary-foreground" },
            },
            pseudos: { ":hover": { "background-color": { token: "secondary-hover" } } },
          },
        },
        destructive: {
          root: {
            base: {
              "background-color": { token: "destructive" },
              color: { token: "destructive-foreground" },
            },
            pseudos: { ":hover": { "background-color": { token: "destructive-hover" } } },
          },
        },
        outline: {
          root: {
            color: { token: "foreground" },
            "border-color": { token: "border" },
            "background-color": "transparent",
          },
        },
      },
    },
  ],
  defaultVariants: { variant: "default" },
}

/** Checkbox — tri-state control with an indicator rendered only for visible states. */
export const checkboxRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "checkbox",
  description: "Tri-state checkbox with checked, unchecked, and indeterminate visual states.",
  slots: [
    {
      part: "root",
      element: "button",
      ownership: "recipe",
      base: {
        display: "inline-flex",
        "align-items": "center",
        "justify-content": "center",
        width: "1rem",
        height: "1rem",
        "border-radius": "0.25rem",
        "border-style": "solid",
        "border-width": "1px",
        "border-color": { token: "border" },
        "background-color": "transparent",
        cursor: "pointer",
        transition: "background-color 0.15s, border-color 0.15s",
      },
      states: {
        checked: {
          "background-color": { token: "primary" },
          "border-color": { token: "primary" },
          color: { token: "primary-foreground" },
        },
        unchecked: { "background-color": "transparent", "border-color": { token: "border" } },
        indeterminate: {
          "background-color": { token: "primary" },
          "border-color": { token: "primary" },
          color: { token: "primary-foreground" },
        },
      },
      flags: { disabled: { opacity: "0.5", cursor: "not-allowed" } },
    },
    {
      part: "indicator",
      element: "span",
      ownership: "recipe",
      base: { display: "flex", "align-items": "center", "justify-content": "center" },
    },
  ],
}

/** Menu — trigger, menu panel, items, and separators; optional item variants remain consumer composition. */
export const menuRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "menu",
  description: "Keyboard-navigable menu with trigger, panel, actionable rows, and separators.",
  slots: [
    {
      part: "trigger",
      element: "button",
      ownership: "recipe",
      base: {
        display: "inline-flex",
        "align-items": "center",
        "border-style": "none",
        "background-color": "transparent",
        cursor: "pointer",
      },
    },
    {
      part: "content",
      element: "div",
      ownership: "recipe",
      base: {
        "z-index": "50",
        "min-width": "8rem",
        overflow: "hidden",
        "border-radius": { token: "radius" },
        "border-style": "solid",
        "border-width": "1px",
        "border-color": { token: "border" },
        "background-color": { token: "surface" },
        padding: "0.25rem",
        "box-shadow": { token: "shadow-md" },
      },
    },
    {
      part: "item",
      element: "div",
      ownership: "consumer",
      ownershipReason: "Menu items are consumer-provided collection content.",
      base: {
        display: "flex",
        "align-items": "center",
        padding: "0.375rem 0.5rem",
        "border-radius": "0.25rem",
        "font-size": "0.875rem",
        cursor: "pointer",
        outline: "none",
      },
      flags: {
        highlighted: { "background-color": { token: "surface-accent" } },
        disabled: { opacity: "0.5", cursor: "not-allowed" },
      },
    },
    {
      part: "separator",
      element: "div",
      ownership: "consumer",
      ownershipReason: "Menu separators are consumer-provided collection content.",
      base: { height: "1px", margin: "0.25rem -0.25rem", "background-color": { token: "border" } },
    },
  ],
}

/** Popover — positioned dialog panel with recipe-owned surfaces and adapter-owned geometry. */
export const popoverRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "popover",
  description:
    "Dismissable floating dialog panel with a trigger, close control, and positioned content.",
  slots: [
    {
      part: "trigger",
      element: "button",
      ownership: "recipe",
      base: {
        display: "inline-flex",
        "align-items": "center",
        "border-style": "none",
        "background-color": "transparent",
        cursor: "pointer",
      },
    },
    {
      part: "content",
      element: "div",
      ownership: "adapter",
      ownershipReason:
        "The primitive renders the panel, while an optional PositioningPort supplies its inline placement geometry.",
      adapterPort: "PositioningPort",
      adapterOwnedProperties: ["position", "top", "right", "bottom", "left", "transform"],
      base: {
        "z-index": "50",
        width: "18rem",
        "border-radius": { token: "radius" },
        "border-style": "solid",
        "border-width": "1px",
        "border-color": { token: "border" },
        "background-color": { token: "surface" },
        padding: "1rem",
        "box-shadow": { token: "shadow-md" },
        transition: "opacity 0.15s",
      },
      states: { open: { opacity: "1" }, closed: { opacity: "0" } },
    },
    {
      part: "close",
      element: "button",
      ownership: "consumer",
      ownershipReason: "Close is optional consumer composition.",
      base: {
        position: "absolute",
        top: "0.5rem",
        right: "0.5rem",
        display: "inline-flex",
        "align-items": "center",
        "justify-content": "center",
        width: "1.5rem",
        height: "1.5rem",
        "border-radius": "0.25rem",
        "border-style": "none",
        "background-color": "transparent",
        cursor: "pointer",
      },
      pseudos: { ":hover": { "background-color": { token: "surface-accent" } } },
    },
  ],
}

/** Select — listbox control with stateful trigger, panel, and selectable items. */
export const selectRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "select",
  description:
    "Listbox selection control with an accessible trigger, options, and highlighted or selected rows.",
  slots: [
    {
      part: "trigger",
      element: "button",
      ownership: "recipe",
      base: {
        display: "inline-flex",
        "align-items": "center",
        "justify-content": "space-between",
        width: "100%",
        height: "2.5rem",
        padding: "0.5rem 0.75rem",
        "border-radius": { token: "radius" },
        "border-style": "solid",
        "border-width": "1px",
        "border-color": { token: "border" },
        "background-color": "transparent",
        "font-size": "0.875rem",
        cursor: "pointer",
      },
      flags: { disabled: { opacity: "0.5", cursor: "not-allowed" } },
    },
    {
      part: "content",
      element: "div",
      ownership: "recipe",
      base: {
        "z-index": "50",
        "min-width": "8rem",
        overflow: "hidden",
        "border-radius": { token: "radius" },
        "border-style": "solid",
        "border-width": "1px",
        "border-color": { token: "border" },
        "background-color": { token: "surface" },
        padding: "0.25rem",
        "box-shadow": { token: "shadow-md" },
      },
    },
    {
      part: "item",
      element: "div",
      ownership: "consumer",
      ownershipReason: "Select items are consumer-provided collection content.",
      base: {
        display: "flex",
        "align-items": "center",
        padding: "0.375rem 0.5rem 0.375rem 2rem",
        "border-radius": "0.25rem",
        "font-size": "0.875rem",
        cursor: "pointer",
        outline: "none",
      },
      states: { checked: { "font-weight": "500" }, unchecked: { "font-weight": "400" } },
      flags: {
        highlighted: { "background-color": { token: "surface-accent" } },
        disabled: { opacity: "0.5", cursor: "not-allowed" },
      },
    },
  ],
}

/** Tabs — tablist, stateful triggers, and the active panel. */
export const tabsRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "tabs",
  description: "Tabbed interface with an underline tablist and active or inactive trigger states.",
  slots: [
    {
      part: "list",
      element: "div",
      ownership: "consumer",
      ownershipReason: "Tabs are consumer-provided repeatable content.",
      base: {
        display: "inline-flex",
        "align-items": "center",
        gap: "0",
        "border-bottom-style": "solid",
        "border-bottom-width": "1px",
        "border-bottom-color": { token: "border" },
      },
    },
    {
      part: "trigger",
      element: "button",
      ownership: "consumer",
      ownershipReason: "Tabs are consumer-provided repeatable content.",
      base: {
        display: "inline-flex",
        "align-items": "center",
        "justify-content": "center",
        padding: "0.5rem 1rem",
        "font-size": "0.875rem",
        "font-weight": "500",
        "border-style": "none",
        "background-color": "transparent",
        color: { token: "foreground-muted" },
        "border-bottom-style": "solid",
        "border-bottom-width": "2px",
        "border-bottom-color": "transparent",
        cursor: "pointer",
        transition: "color 0.15s, border-color 0.15s",
      },
      states: {
        active: { color: { token: "foreground" }, "border-bottom-color": { token: "primary" } },
        inactive: { color: { token: "foreground-muted" }, "border-bottom-color": "transparent" },
      },
      flags: { disabled: { opacity: "0.5", cursor: "not-allowed" } },
    },
    {
      part: "content",
      element: "div",
      ownership: "consumer",
      ownershipReason: "Tabs are consumer-provided repeatable content.",
      base: { padding: "1rem 0" },
    },
  ],
}

/** Toast — notification region, message content, and a dismiss affordance. */
export const toastRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "toast",
  description: "Polite notification queue with message title, description, and dismiss action.",
  slots: [
    {
      part: "region",
      element: "div",
      ownership: "consumer",
      ownershipReason: "The toast region is owned by the provider, not this wrapper.",
      base: {
        position: "fixed",
        bottom: "1rem",
        right: "1rem",
        "z-index": "100",
        display: "flex",
        "flex-direction": "column",
        gap: "0.5rem",
        "max-width": "24rem",
      },
    },
    {
      part: "root",
      element: "div",
      ownership: "recipe",
      base: {
        display: "flex",
        "align-items": "flex-start",
        gap: "0.75rem",
        "border-radius": { token: "radius" },
        "border-style": "solid",
        "border-width": "1px",
        "border-color": { token: "border" },
        "background-color": { token: "surface" },
        padding: "1rem",
        "box-shadow": { token: "shadow-md" },
      },
    },
    {
      part: "title",
      element: "div",
      ownership: "consumer",
      ownershipReason: "Toast title is optional consumer composition.",
      base: { "font-size": "0.875rem", "font-weight": "500" },
    },
    {
      part: "description",
      element: "div",
      ownership: "consumer",
      ownershipReason: "Toast description is optional consumer composition.",
      base: { "font-size": "0.8125rem", color: { token: "foreground-muted" } },
    },
    {
      part: "close",
      element: "button",
      ownership: "consumer",
      ownershipReason: "Close is optional consumer composition.",
      base: {
        "margin-left": "auto",
        display: "inline-flex",
        "align-items": "center",
        "justify-content": "center",
        width: "1.25rem",
        height: "1.25rem",
        "border-radius": "0.25rem",
        "border-style": "none",
        "background-color": "transparent",
        cursor: "pointer",
        "font-size": "0.875rem",
      },
      pseudos: { ":hover": { "background-color": { token: "surface-accent" } } },
    },
  ],
}

/** Tooltip — positioned, presence-aware explanatory content. */
export const tooltipRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "tooltip",
  description: "Delayed explanatory overlay with adapter-owned placement and presence states.",
  slots: [
    {
      part: "content",
      element: "div",
      ownership: "adapter",
      ownershipReason:
        "The primitive renders tooltip content, while an optional PositioningPort owns its inline placement geometry.",
      adapterPort: "PositioningPort",
      adapterOwnedProperties: ["position", "top", "right", "bottom", "left", "transform"],
      base: {
        "z-index": "50",
        overflow: "hidden",
        "border-radius": { token: "radius" },
        "background-color": { token: "foreground" },
        color: { token: "surface" },
        padding: "0.375rem 0.75rem",
        "font-size": "0.75rem",
        "line-height": "1rem",
        "box-shadow": { token: "shadow-sm" },
        transition: "opacity 0.15s",
      },
      states: { open: { opacity: "1" }, closed: { opacity: "0" } },
    },
  ],
}

/**
 * Typeset — granular typography scale (RECIPE-007).
 *
 * Each part is an element identity (heading-1..4, paragraph, lead, large, small,
 * muted, blockquote, inline-code). No variants, no states.
 */
export const typesetRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "typeset",
  description: "Granular typography scale: heading, paragraph, and utility text identities.",
  slots: [
    {
      part: "lead",
      element: "p",
      ownership: "consumer",
      ownershipReason: "Consumer applies for emphasis text.",
      base: { "font-size": { token: "font-size-lg" }, color: { token: "foreground-muted" } },
    },
    {
      part: "large",
      element: "span",
      ownership: "consumer",
      ownershipReason: "Consumer applies for larger text.",
      base: { "font-size": { token: "font-size-md" }, "font-weight": "600" },
    },
    {
      part: "muted",
      element: "span",
      ownership: "consumer",
      ownershipReason: "Consumer applies for de-emphasized text.",
      base: { "font-size": { token: "font-size-sm" }, color: { token: "foreground-muted" } },
    },
    {
      part: "blockquote",
      element: "blockquote",
      ownership: "consumer",
      ownershipReason: "Consumer applies to their own blockquote.",
      base: { "border-left-width": "2px", "padding-left": "1.5rem", "font-style": "italic" },
    },
    {
      part: "inline-code",
      element: "code",
      ownership: "consumer",
      ownershipReason: "Consumer applies to inline code.",
      base: {
        "font-family": "monospace",
        "font-size": { token: "font-size-sm" },
        "font-weight": "600",
      },
    },
  ],
  axes: [],
  tokens: [
    {
      id: "font-size-xs",
      mappings: {
        css: "--ui-font-size-xs",
        tailwind: "fontSize-xs",
        unocss: "--ui-font-size-xs",
        site: "--sol-font-size-xs",
      },
    },
    {
      id: "font-size-sm",
      mappings: {
        css: "--ui-font-size-sm",
        tailwind: "fontSize-sm",
        unocss: "--ui-font-size-sm",
        site: "--sol-font-size-sm",
      },
    },
    {
      id: "font-size-base",
      mappings: {
        css: "--ui-font-size-base",
        tailwind: "fontSize-base",
        unocss: "--ui-font-size-base",
        site: "--sol-font-size-base",
      },
    },
    {
      id: "font-size-md",
      mappings: {
        css: "--ui-font-size-md",
        tailwind: "fontSize-md",
        unocss: "--ui-font-size-md",
        site: "--sol-font-size-md",
      },
    },
    {
      id: "font-size-lg",
      mappings: {
        css: "--ui-font-size-lg",
        tailwind: "fontSize-lg",
        unocss: "--ui-font-size-lg",
        site: "--sol-font-size-lg",
      },
    },
    {
      id: "font-size-xl",
      mappings: {
        css: "--ui-font-size-xl",
        tailwind: "fontSize-xl",
        unocss: "--ui-font-size-xl",
        site: "--sol-font-size-xl",
      },
    },

    {
      id: "foreground-muted",
      mappings: {
        css: "--ui-muted-fg",
        tailwind: "muted-fg",
        unocss: "--ui-muted-fg",
        site: "--sol-muted-fg",
      },
    },
  ],
}

/**
 * Prose — rich-text wrapper that styles descendant elements (RECIPE-007).
 *
 * A single "root" slot with a size axis. The CSS uses descendant element selectors
 * (which the recipe contract audit permits per docs/plans/typeset-plan.md).
 */
export const proseRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "prose",
  description: "Rich-text wrapper: styles descendant headings, paragraphs, lists, and code blocks.",
  slots: [
    {
      part: "root",
      element: "div",
      ownership: "primitive",
      ownershipReason: "The prose wrapper owns the root container.",
      base: {
        "font-size": { token: "font-size-base" },
        color: { token: "foreground" },
      },
    },
  ],
  axes: [
    {
      name: "size",
      values: ["sm", "base", "lg"],
      defaultValue: "base",
    },
  ],
  tokens: [
    {
      id: "font-size-sm",
      mappings: {
        css: "--ui-font-size-sm",
        tailwind: "fontSize-sm",
        unocss: "--ui-font-size-sm",
        site: "--sol-font-size-sm",
      },
    },
    {
      id: "font-size-base",
      mappings: {
        css: "--ui-font-size-base",
        tailwind: "fontSize-base",
        unocss: "--ui-font-size-base",
        site: "--sol-font-size-base",
      },
    },
    {
      id: "font-size-lg",
      mappings: {
        css: "--ui-font-size-lg",
        tailwind: "fontSize-lg",
        unocss: "--ui-font-size-lg",
        site: "--sol-font-size-lg",
      },
    },
    {
      id: "foreground",
      mappings: { css: "--ui-fg", tailwind: "fg", unocss: "--ui-fg", site: "--sol-fg" },
    },
  ],
}

/**
 * Avatar — image element with alternate text support for displaying user avatars with fallback.
 */
export const avatarRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "avatar",
  description:
    "Image element with alternate text support for displaying user avatars with fallback.",
  slots: [
    {
      part: "root",
      element: "span",
      ownership: "recipe",
      base: {
        display: "inline-flex",
        "align-items": "center",
        "justify-content": "center",
        "flex-shrink": "0",
        "border-radius": "9999px",
        overflow: "hidden",
        width: "2.5rem",
        height: "2.5rem",
      },
    },
    {
      part: "image",
      element: "img",
      ownership: "recipe",
      base: {
        "object-fit": "cover",
        width: "100%",
        height: "100%",
      },
    },
    {
      part: "fallback",
      element: "span",
      ownership: "recipe",
      base: {
        width: "100%",
        height: "100%",
        display: "flex",
        "align-items": "center",
        "justify-content": "center",
        "background-color": { token: "surface-muted" },
        "font-size": "0.875rem",
        "font-weight": "500",
        color: { token: "foreground-muted" },
      },
    },
  ],
}

/**
 * Spinner — loading indicator with role="status" for assistive technologies.
 */
export const spinnerRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "spinner",
  description: "Loading indicator with role=status and configurable accessible label.",
  slots: [
    {
      part: "root",
      element: "span",
      ownership: "recipe",
      base: {
        display: "inline-flex",
        "align-items": "center",
        "justify-content": "center",
        "font-size": "0.875rem",
        color: { token: "foreground-muted" },
      },
    },
  ],
}

/**
 * Input — text input and textarea with validation states.
 *
 * Two slots (root for single-line, textarea for multi-line) with shared
 * validation state flags. No variants — styling is driven by the Field
 * component that wraps input.
 */
export const inputRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "input",
  description:
    "Single-line text input and multi-line textarea with validation state styling hooks.",
  slots: [
    {
      part: "root",
      element: "input",
      ownership: "recipe",
      base: {
        display: "block",
        width: "100%",
        "min-height": "2.25rem",
        padding: "0.375rem 0.75rem",
        "font-size": "0.875rem",
        "line-height": "1.25rem",
        "font-family": { token: "font-sans", fallback: "system-ui, -apple-system, sans-serif" },
        color: { token: "foreground" },
        "background-color": { token: "surface" },
        "border-style": "solid",
        "border-width": "1px",
        "border-color": { token: "border" },
        "border-radius": { token: "radius" },
        "outline": "none",
        transition: "border-color 0.15s, box-shadow 0.15s",
      },
      states: {},
      flags: {
        invalid: {
          "border-color": { token: "destructive" },
        },
        readonly: {
          "background-color": { token: "surface-muted" },
          "cursor": "not-allowed",
        },
        placeholder: {
          opacity: "0.5",
        },
        disabled: {
          "background-color": { token: "surface-muted" },
          "cursor": "not-allowed",
          opacity: "0.5",
        },
        required: {},
      },
      pseudos: {
        ":focus-visible": {
          "border-color": { token: "primary" },
          outline: "2px solid",
          "outline-color": { token: "focus-ring" },
          "outline-offset": "2px",
        },
      },
    },
    {
      part: "textarea",
      element: "textarea",
      ownership: "recipe",
      base: {
        display: "block",
        width: "100%",
        "min-height": "3rem",
        padding: "0.375rem 0.75rem",
        "font-size": "0.875rem",
        "line-height": "1.25rem",
        "font-family": { token: "font-sans", fallback: "system-ui, -apple-system, sans-serif" },
        color: { token: "foreground" },
        "background-color": { token: "surface" },
        "border-style": "solid",
        "border-width": "1px",
        "border-color": { token: "border" },
        "border-radius": { token: "radius" },
        "outline": "none",
        "resize": "vertical",
        transition: "border-color 0.15s, box-shadow 0.15s",
      },
      states: {},
      flags: {
        invalid: {
          "border-color": { token: "destructive" },
        },
        readonly: {
          "background-color": { token: "surface-muted" },
          "cursor": "not-allowed",
        },
        placeholder: {
          opacity: "0.5",
        },
        disabled: {
          "background-color": { token: "surface-muted" },
          "cursor": "not-allowed",
          opacity: "0.5",
        },
        required: {},
      },
      pseudos: {
        ":focus-visible": {
          "border-color": { token: "primary" },
          outline: "2px solid",
          "outline-color": { token: "focus-ring" },
          "outline-offset": "2px",
        },
      },
    },
  ],
}

/**
 * Card — container component with header, title, description, content, and footer areas.
 *
 * Six slots: root, header, title, description, content, footer. No states, no variants,
 * no flags. Purely structural — a composition container.
 */
export const cardRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "card",
  description:
    "Container component with header, title, description, content, and footer areas.",
  slots: [
    {
      part: "root",
      element: "div",
      ownership: "recipe",
      base: {
        "border-style": "solid",
        "border-width": "1px",
        "border-color": { token: "border" },
        "border-radius": { token: "radius" },
        "background-color": { token: "surface-raised" },
        padding: "1rem",
      },
    },
    {
      part: "header",
      element: "div",
      ownership: "consumer",
      ownershipReason: "The wrapper exposes only Root; consumers compose Header sub-parts within the card.",
      base: {
        display: "flex",
        "flex-direction": "column",
        gap: "0.25rem",
      },
    },
    {
      part: "title",
      element: "h3",
      ownership: "consumer",
      ownershipReason: "Card title is optional consumer composition.",
      base: {
        margin: "0",
        "font-size": { token: "font-size-lg" },
        "font-weight": "600",
        color: { token: "foreground" },
      },
    },
    {
      part: "description",
      element: "p",
      ownership: "consumer",
      ownershipReason: "Card description is optional consumer composition.",
      base: {
        margin: "0",
        "font-size": { token: "font-size-sm" },
        color: { token: "foreground-muted" },
        "line-height": { token: "line-height-sm", fallback: "1.25rem" },
      },
    },
    {
      part: "content",
      element: "div",
      ownership: "consumer",
      ownershipReason: "The wrapper exposes only Root; consumers compose Content sub-parts within the card.",
      base: {
        display: "block",
      },
    },
    {
      part: "footer",
      element: "div",
      ownership: "consumer",
      ownershipReason: "The wrapper exposes only Root; consumers compose Footer sub-parts within the card.",
      base: {
        display: "flex",
        "align-items": "center",
        gap: "0.5rem",
      },
    },
  ],
}

/**
 * Field — form field wrapper with label, control, description, and error message.
 *
 * Five slots: root, label, control, description, error. No states; uses flags
 * for disabled, required, invalid, readonly. The control slot is consumer-owned
 * and wraps the actual form control element provided by the consumer.
 */
export const fieldRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "field",
  description:
    "Form field wrapper with label, control, description, and error message.",
  slots: [
    {
      part: "root",
      element: "div",
      ownership: "recipe",
      base: {
        display: "flex",
        "flex-direction": "column",
        gap: "0.25rem",
      },
      flags: {
        disabled: {
          opacity: "0.5",
        },
        required: {},
        invalid: {},
        readonly: {},
      },
    },
    {
      part: "label",
      element: "label",
      ownership: "consumer",
      ownershipReason: "The wrapper exposes only Root; consumers render Label/Control/Description/Error sub-parts via the primitive",
      base: {
        "font-size": { token: "font-size-sm" },
        "line-height": { token: "line-height-sm", fallback: "1.25rem" },
        "font-weight": "600",
        color: { token: "foreground" },
      },
      flags: {
        disabled: {
          opacity: "0.5",
        },
      },
    },
    {
      part: "control",
      element: "div",
      ownership: "consumer",
      ownershipReason: "wraps the actual form control element provided by the consumer",
      base: {
        display: "block",
      },
    },
    {
      part: "description",
      element: "div",
      ownership: "consumer",
      ownershipReason: "The wrapper exposes only Root; consumers render Description sub-parts via the primitive",
      base: {
        "font-size": { token: "font-size-sm" },
        color: { token: "foreground-muted" },
      },
    },
    {
      part: "error",
      element: "div",
      ownership: "consumer",
      ownershipReason: "The wrapper exposes only Root; consumers render Error sub-parts via the primitive",
      base: {
        "font-size": { token: "font-size-sm" },
        color: { token: "destructive" },
      },
    },
  ],
}

/**
 * Data Table — sortable data table with header, body, rows, and cells.
 */
export const dataTableRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "data-table",
  description: "Sortable data table with header, body, rows, and cells.",
  slots: [
    {
      part: "root",
      element: "table",
      ownership: "recipe",
      base: {
        width: "100%",
        "border-collapse": "collapse",
      },
    },
    {
      part: "header",
      element: "thead",
      ownership: "consumer",
      ownershipReason:
        "The wrapper exposes only Root; consumers supply the table header.",
      base: {
        "border-bottom": "1px solid",
        "border-color": { token: "border" },
      },
    },
    {
      part: "header-cell",
      element: "th",
      ownership: "consumer",
      ownershipReason:
        "The wrapper exposes only Root; consumers supply header cells.",
      base: {
        padding: "0.75rem",
        "text-align": "left",
        "font-weight": "500",
      },
    },
    {
      part: "body",
      element: "tbody",
      ownership: "consumer",
      ownershipReason:
        "The wrapper exposes only Root; consumers supply the table body.",
      base: {
        display: "block",
      },
    },
    {
      part: "row",
      element: "tr",
      ownership: "consumer",
      ownershipReason:
        "The wrapper exposes only Root; consumers supply repeatable rows.",
      base: {
        "border-bottom": "1px solid",
        "border-color": { token: "border" },
      },
    },
    {
      part: "cell",
      element: "td",
      ownership: "consumer",
      ownershipReason:
        "The wrapper exposes only Root; consumers supply cells within rows.",
      base: {
        padding: "0.75rem",
      },
    },
  ],
}

/**
 * Meter — scalar measurement display using the native HTML meter element.
 */
export const meterRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "meter",
  description:
    "Scalar measurement display with status states derived from value thresholds.",
  slots: [
    {
      part: "root",
      element: "meter",
      ownership: "recipe",
      base: {
        display: "block",
        width: "100%",
        height: "1rem",
        "border-radius": { token: "radius" },
        "background-color": { token: "surface-muted" },
        overflow: "hidden",
      },
      states: {
        safe: { "background-color": { token: "success-surface" } },
        caution: { "background-color": { token: "warning-surface" } },
        danger: { "background-color": { token: "danger-surface" } },
      },
    },
  ],
}

/**
 * Progress — linear progress indicator with determinate and indeterminate modes.
 */
export const progressRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "progress",
  description:
    "Linear progress indicator with determinate (value 0–100) and indeterminate modes.",
  slots: [
    {
      part: "root",
      element: "div",
      ownership: "recipe",
      base: {
        position: "relative",
        display: "flex",
        width: "100%",
        height: "0.5rem",
        overflow: "hidden",
        "border-radius": { token: "radius-full" },
        "background-color": { token: "surface-muted" },
      },
      states: {
        loading: { opacity: "0.7" },
        complete: { "background-color": { token: "success-surface" } },
      },
    },
    {
      part: "indicator",
      element: "div",
      ownership: "consumer",
      ownershipReason:
        "The wrapper exposes only Root; consumers supply the progress indicator.",
      base: {
        height: "100%",
        "background-color": { token: "primary" },
        transition: "width 0.15s",
      },
    },
  ],
}

/**
 * Pagination — page navigation with previous, next, ellipsis, and content slots.
 */
export const paginationRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "pagination",
  description:
    "Page navigation with previous, next, ellipsis, and content slots.",
  slots: [
    {
      part: "root",
      element: "nav",
      ownership: "recipe",
      base: {
        display: "flex",
        "align-items": "center",
        gap: "0.25rem",
      },
    },
    {
      part: "content",
      element: "ul",
      ownership: "consumer",
      ownershipReason:
        "The wrapper exposes only Root; consumers supply the page list.",
      base: {
        display: "flex",
        "list-style": "none",
        padding: "0",
        margin: "0",
        gap: "0.25rem",
      },
    },
    {
      part: "item",
      element: "li",
      ownership: "consumer",
      ownershipReason:
        "The wrapper exposes only Root; consumers supply page items.",
      base: {
        display: "block",
      },
    },
    {
      part: "previous",
      element: "button",
      ownership: "consumer",
      ownershipReason:
        "The wrapper exposes only Root; consumers supply the previous button.",
      base: {
        display: "inline-flex",
        "align-items": "center",
        "justify-content": "center",
        padding: "0.375rem 0.75rem",
        "border-radius": { token: "radius" },
        "font-size": "0.875rem",
      },
    },
    {
      part: "next",
      element: "button",
      ownership: "consumer",
      ownershipReason:
        "The wrapper exposes only Root; consumers supply the next button.",
      base: {
        display: "inline-flex",
        "align-items": "center",
        "justify-content": "center",
        padding: "0.375rem 0.75rem",
        "border-radius": { token: "radius" },
        "font-size": "0.875rem",
      },
    },
    {
      part: "ellipsis",
      element: "span",
      ownership: "consumer",
      ownershipReason:
        "The wrapper exposes only Root; consumers supply the ellipsis indicator.",
      base: {
        display: "inline-flex",
        "align-items": "center",
        "justify-content": "center",
        padding: "0.375rem 0.75rem",
        "font-size": "0.875rem",
      },
    },
  ],
}

/**
 * Breadcrumb — hierarchical navigation with list, item, link, separator, and ellipsis parts.
 */
export const breadcrumbRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "breadcrumb",
  description:
    "Hierarchical navigation breadcrumb with list, item, link, separator, and ellipsis parts.",
  slots: [
    {
      part: "root",
      element: "nav",
      ownership: "recipe",
      base: {
        display: "flex",
        "align-items": "center",
        gap: "0.5rem",
        "font-size": "0.875rem",
      },
    },
    {
      part: "list",
      element: "ol",
      ownership: "consumer",
      ownershipReason:
        "The wrapper exposes only Root; consumers supply the breadcrumb list.",
      base: {
        display: "flex",
        "align-items": "center",
        gap: "0.5rem",
        padding: "0",
        margin: "0",
        "list-style": "none",
      },
    },
    {
      part: "item",
      element: "li",
      ownership: "consumer",
      ownershipReason: "Breadcrumb items are consumer-provided navigation entries.",
      base: {
        display: "flex",
        "align-items": "center",
        gap: "0.5rem",
      },
    },
    {
      part: "link",
      element: "a",
      ownership: "consumer",
      ownershipReason: "Breadcrumb links are consumer-provided with their own href.",
      base: {
        color: { token: "foreground-muted" },
        "text-decoration": "none",
      },
      pseudos: {
        ":hover": { color: { token: "foreground" } },
        ":focus-visible": {
          outline: "2px solid",
          "outline-color": { token: "focus-ring" },
          "outline-offset": "2px",
        },
      },
    },
    {
      part: "separator",
      element: "span",
      ownership: "consumer",
      ownershipReason: "Breadcrumb separators are consumer-provided between items.",
      base: {
        display: "inline-flex",
        color: { token: "foreground-muted" },
      },
    },
    {
      part: "ellipsis",
      element: "span",
      ownership: "consumer",
      ownershipReason: "Breadcrumb ellipsis is consumer-provided to indicate skipped items.",
      base: {
        display: "inline-flex",
        "align-items": "center",
        color: { token: "foreground-muted" },
      },
    },
  ],
}

/** Radio Group — single-select radio button group with items and indicator. */
export const radioGroupRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "radio-group",
  description:
    "Single-select radio button group with roving tabindex keyboard navigation and visual indicator.",
  slots: [
    {
      part: "root",
      element: "div",
      ownership: "recipe",
      base: {
        display: "flex",
        "flex-direction": "column",
        gap: "0.5rem",
      },
    },
    {
      part: "item",
      element: "button",
      ownership: "consumer",
      ownershipReason: "Radio items are consumer-provided options.",
      base: {
        display: "flex",
        "align-items": "center",
        gap: "0.5rem",
        padding: "0.5rem",
        "border-style": "none",
        "background-color": "transparent",
        cursor: "pointer",
        "font-size": "0.875rem",
        "border-radius": { token: "radius" },
        "outline": "none",
      },
      states: {
        checked: { "background-color": { token: "surface-accent" } },
        unchecked: { "background-color": "transparent" },
      },
      flags: {
        disabled: { opacity: "0.5", cursor: "not-allowed" },
      },
      pseudos: {
        ":focus-visible": {
          outline: "2px solid",
          "outline-color": { token: "focus-ring" },
          "outline-offset": "2px",
        },
      },
    },
    {
      part: "indicator",
      element: "span",
      ownership: "consumer",
      ownershipReason: "Radio indicator is consumer-provided visual feedback.",
      base: {
        display: "inline-flex",
        "align-items": "center",
        "justify-content": "center",
        width: "1rem",
        height: "1rem",
        "border-radius": "9999px",
        "border-style": "solid",
        "border-width": "2px",
        "border-color": { token: "border" },
      },
      states: {
        checked: { "border-color": { token: "primary" } },
        unchecked: { "border-color": { token: "border" } },
      },
    },
  ],
}

/** Combobox — autocomplete input with filterable listbox. */
export const comboboxRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "combobox",
  description:
    "Autocomplete input with filterable listbox, keyboard navigation, and active descendant pattern.",
  slots: [
    {
      part: "trigger",
      element: "button",
      ownership: "recipe",
      base: {
        display: "inline-flex",
        "align-items": "center",
        "justify-content": "space-between",
        width: "100%",
        height: "2.5rem",
        padding: "0.5rem 0.75rem",
        "border-radius": { token: "radius" },
        "border-style": "solid",
        "border-width": "1px",
        "border-color": { token: "border" },
        "background-color": "transparent",
        "font-size": "0.875rem",
        cursor: "pointer",
        "outline": "none",
      },
      flags: {
        disabled: { opacity: "0.5", cursor: "not-allowed" },
      },
      pseudos: {
        ":focus-visible": {
          "border-color": { token: "primary" },
          outline: "2px solid",
          "outline-color": { token: "focus-ring" },
          "outline-offset": "2px",
        },
      },
    },
    {
      part: "input",
      element: "input",
      ownership: "recipe",
      base: {
        width: "100%",
        "min-height": "2.5rem",
        padding: "0.5rem 0.75rem",
        "border-radius": { token: "radius" },
        "border-style": "solid",
        "border-width": "1px",
        "border-color": { token: "border" },
        "background-color": "transparent",
        "font-size": "0.875rem",
        "outline": "none",
      },
      pseudos: {
        ":focus-visible": {
          "border-color": { token: "primary" },
          outline: "2px solid",
          "outline-color": { token: "focus-ring" },
          "outline-offset": "2px",
        },
      },
    },
    {
      part: "content",
      element: "div",
      ownership: "recipe",
      base: {
        "z-index": "50",
        "min-width": "8rem",
        overflow: "hidden",
        "border-radius": { token: "radius" },
        "border-style": "solid",
        "border-width": "1px",
        "border-color": { token: "border" },
        "background-color": { token: "surface" },
        padding: "0.25rem",
        "box-shadow": { token: "shadow-md" },
      },
    },
    {
      part: "item",
      element: "div",
      ownership: "consumer",
      ownershipReason: "Combobox items are consumer-provided listbox content.",
      base: {
        display: "flex",
        "align-items": "center",
        padding: "0.375rem 0.5rem",
        "border-radius": "0.25rem",
        "font-size": "0.875rem",
        cursor: "pointer",
        outline: "none",
      },
      flags: {
        highlighted: { "background-color": { token: "surface-accent" } },
        disabled: { opacity: "0.5", cursor: "not-allowed" },
      },
    },
  ],
}

/** Sheet — side-panel dialog with directional slide-in. */
export const sheetRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "sheet",
  description:
    "Side-panel dialog that slides in from a specified edge with a backdrop overlay.",
  slots: [
    {
      part: "backdrop",
      element: "div",
      ownership: "recipe",
      base: {
        position: "fixed",
        inset: "0",
        "background-color": { token: "surface-overlay" },
        transition: "opacity 0.15s",
      },
      states: {
        open: { opacity: "1" },
        closed: { opacity: "0" },
      },
    },
    {
      part: "content",
      element: "div",
      ownership: "recipe",
      base: {
        position: "fixed",
        "z-index": "50",
        "background-color": { token: "surface-raised" },
        color: { token: "foreground" },
        "box-shadow": { token: "shadow-lg" },
        transition: "transform 0.15s, opacity 0.15s",
      },
      states: {
        open: { opacity: "1" },
        closed: { opacity: "0" },
      },
    },
    {
      part: "title",
      element: "h2",
      ownership: "consumer",
      ownershipReason: "Sheet title is optional consumer composition.",
      base: {
        margin: "0",
        "font-size": "1.125rem",
        "font-weight": "600",
        color: { token: "foreground" },
      },
    },
    {
      part: "description",
      element: "p",
      ownership: "consumer",
      ownershipReason: "Sheet description is optional consumer composition.",
      base: {
        margin: "0.5rem 0 0",
        "font-size": "0.875rem",
        color: { token: "foreground-muted" },
      },
    },
    {
      part: "close",
      element: "button",
      ownership: "consumer",
      ownershipReason: "Close is optional consumer composition.",
      base: {
        position: "absolute",
        top: "0.75rem",
        right: "0.75rem",
        "border-style": "none",
        "background-color": "transparent",
        color: { token: "foreground-muted" },
        cursor: "pointer",
        "border-radius": { token: "radius-sm" },
      },
      pseudos: {
        ":hover": { color: { token: "foreground" } },
        ":focus-visible": {
          outline: "2px solid",
          "outline-color": { token: "focus-ring" },
        },
      },
    },
  ],
}

/** Navigation Menu — top-level navigation with dropdown sub-menus. */
export const navigationMenuRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "navigation-menu",
  description:
    "Top-level navigation bar with accessible dropdown sub-menus and pointer intent detection.",
  slots: [
    {
      part: "list",
      element: "ul",
      ownership: "consumer",
      ownershipReason: "Nav menu items are consumer-provided list items.",
      base: {
        display: "flex",
        "align-items": "center",
        gap: "0.25rem",
        padding: "0",
        margin: "0",
        "list-style": "none",
      },
    },
    {
      part: "item",
      element: "li",
      ownership: "consumer",
      ownershipReason: "Nav menu items are consumer-provided.",
      base: {
        display: "block",
        position: "relative",
      },
    },
    {
      part: "trigger",
      element: "button",
      ownership: "consumer",
      ownershipReason: "Nav triggers are consumer-provided with label content.",
      base: {
        display: "inline-flex",
        "align-items": "center",
        padding: "0.5rem 1rem",
        "border-style": "none",
        "background-color": "transparent",
        "font-size": "0.875rem",
        "font-weight": "500",
        cursor: "pointer",
        "border-radius": { token: "radius" },
        "outline": "none",
      },
      states: {
        active: { "background-color": { token: "surface-accent" } },
      },
      pseudos: {
        ":focus-visible": {
          outline: "2px solid",
          "outline-color": { token: "focus-ring" },
          "outline-offset": "2px",
        },
      },
    },
    {
      part: "content",
      element: "div",
      ownership: "adapter",
      ownershipReason:
        "The primitive renders the panel, while an optional PositioningPort supplies its inline placement geometry.",
      adapterPort: "PositioningPort",
      adapterOwnedProperties: ["position", "top", "right", "bottom", "left", "transform"],
      base: {
        "z-index": "50",
        "min-width": "12rem",
        overflow: "hidden",
        "border-radius": { token: "radius" },
        "border-style": "solid",
        "border-width": "1px",
        "border-color": { token: "border" },
        "background-color": { token: "surface" },
        padding: "0.5rem",
        "box-shadow": { token: "shadow-md" },
        transition: "opacity 0.15s, transform 0.15s",
      },
      states: {
        open: { opacity: "1", transform: "translateY(0)" },
        closed: { opacity: "0", transform: "translateY(-0.25rem)" },
      },
    },
    {
      part: "link",
      element: "a",
      ownership: "consumer",
      ownershipReason: "Nav links are consumer-provided with their own href.",
      base: {
        display: "block",
        padding: "0.5rem 0.75rem",
        "border-radius": "0.25rem",
        "font-size": "0.875rem",
        "text-decoration": "none",
        color: { token: "foreground" },
      },
      pseudos: {
        ":hover": { "background-color": { token: "surface-accent" } },
      },
    },
  ],
}

/** Command Palette — modal command palette with filtering and group support. */
export const commandPaletteRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "command-palette",
  description:
    "Modal command palette with input filtering, group support, and empty state.",
  slots: [
    {
      part: "dialog",
      element: "div",
      ownership: "recipe",
      base: {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        "z-index": "50",
        "max-width": "24rem",
        width: "100%",
        "border-radius": { token: "radius" },
        "border-style": "solid",
        "border-width": "1px",
        "border-color": { token: "border" },
        "background-color": { token: "surface-raised" },
        "box-shadow": { token: "shadow-lg" },
        transition: "opacity 0.15s, transform 0.15s",
      },
      states: {
        open: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        closed: { opacity: "0", transform: "translate(-50%, -50%) scale(0.96)" },
      },
    },
    {
      part: "input",
      element: "input",
      ownership: "recipe",
      base: {
        width: "100%",
        "min-height": "2.5rem",
        padding: "0.75rem",
        "border-style": "none",
        "background-color": "transparent",
        "font-size": "0.875rem",
        "outline": "none",
      },
      pseudos: {
        ":focus-visible": { "outline": "none" },
      },
    },
    {
      part: "list",
      element: "div",
      ownership: "consumer",
      ownershipReason: "Command list is consumer-provided content area.",
      base: {
        "max-height": "20rem",
        overflow: "auto",
        padding: "0.25rem",
      },
    },
    {
      part: "group",
      element: "div",
      ownership: "consumer",
      ownershipReason: "Command groups are consumer-provided content organization.",
      base: {
        display: "block",
      },
    },
    {
      part: "item",
      element: "div",
      ownership: "consumer",
      ownershipReason: "Command items are consumer-provided actions.",
      base: {
        display: "flex",
        "align-items": "center",
        gap: "0.5rem",
        padding: "0.5rem 0.75rem",
        "border-radius": "0.25rem",
        "font-size": "0.875rem",
        cursor: "pointer",
        outline: "none",
      },
      flags: {
        highlighted: { "background-color": { token: "surface-accent" } },
      },
    },
    {
      part: "empty",
      element: "div",
      ownership: "consumer",
      ownershipReason: "Empty state is consumer-provided feedback.",
      base: {
        padding: "1rem",
        "font-size": "0.875rem",
        color: { token: "foreground-muted" },
        "text-align": "center",
      },
    },
  ],
}

/** Kbd — keyboard shortcut display element. */
export const kbdRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "kbd",
  description: "Semantic keyboard shortcut display element.",
  slots: [
    {
      part: "root",
      element: "kbd",
      ownership: "recipe",
      base: {
        display: "inline-flex",
        "align-items": "center",
        padding: "0.125rem 0.375rem",
        "font-size": "0.75rem",
        "line-height": "1rem",
        "font-family": "monospace",
        "font-weight": "500",
        "border-style": "solid",
        "border-width": "1px",
        "border-color": { token: "border" },
        "border-radius": "0.25rem",
        "background-color": { token: "surface-muted" },
        color: { token: "foreground" },
        "box-shadow": { token: "shadow-sm" },
      },
    },
  ],
}

/** Resizable Panels — drag-to-resize panel layout with keyboard support. */
export const resizablePanelsRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "resizable-panels",
  description:
    "Drag-to-resize panel layout with keyboard support, collapse behavior, and ARIA separator semantics.",
  slots: [
    {
      part: "group",
      element: "div",
      ownership: "recipe",
      base: {
        display: "flex",
        width: "100%",
        height: "100%",
      },
    },
    {
      part: "panel",
      element: "div",
      ownership: "consumer",
      ownershipReason: "Panels are consumer-provided content areas.",
      base: {
        overflow: "auto",
      },
    },
    {
      part: "handle",
      element: "button",
      ownership: "consumer",
      ownershipReason: "Handles are consumer-provided resize affordances.",
      base: {
        display: "flex",
        "align-items": "center",
        "justify-content": "center",
        "background-color": { token: "border" },
        cursor: "pointer",
        "outline": "none",
      },
      pseudos: {
        ":focus-visible": {
          "background-color": { token: "primary" },
        },
      },
    },
  ],
}

/** Scroll Area — custom-styled scrollbar with native scrolling performance. */
export const scrollAreaRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "scroll-area",
  description:
    "Custom-styled scrollbar replacement with native scrolling performance and configurable visibility.",
  slots: [
    {
      part: "root",
      element: "div",
      ownership: "recipe",
      base: {
        position: "relative",
        overflow: "hidden",
      },
    },
    {
      part: "viewport",
      element: "div",
      ownership: "consumer",
      ownershipReason: "Viewport is consumer-provided scrollable content area.",
      base: {
        height: "100%",
        width: "100%",
        overflow: "auto",
      },
    },
    {
      part: "scrollbar",
      element: "div",
      ownership: "consumer",
      ownershipReason: "Scrollbar is consumer-provided visual indicator.",
      base: {
        position: "absolute",
        "background-color": { token: "surface-accent" },
        "border-radius": "9999px",
        transition: "opacity 0.15s",
      },
    },
    {
      part: "thumb",
      element: "div",
      ownership: "consumer",
      ownershipReason: "Thumb is consumer-provided draggable portion of scrollbar.",
      base: {
        position: "relative",
        "flex-grow": "1",
        "background-color": { token: "border" },
        "border-radius": "9999px",
      },
    },
  ],
}

/** Toolbar — grouped actions/controls in a horizontal or vertical bar. */
export const toolbarRecipe: RecipeDefinition = {
  contractVersion: CONTRACT_VERSION,
  scope: "toolbar",
  description:
    "Grouped actions and controls in a horizontal or vertical bar with button, toggle, and separator parts.",
  slots: [
    {
      part: "root",
      element: "div",
      ownership: "recipe",
      base: {
        display: "inline-flex",
        "align-items": "center",
        gap: "0.25rem",
        padding: "0.25rem",
        "border-radius": { token: "radius" },
        "background-color": { token: "surface-muted" },
      },
    },
    {
      part: "button",
      element: "button",
      ownership: "consumer",
      ownershipReason: "Toolbar buttons are consumer-provided actions.",
      base: {
        display: "inline-flex",
        "align-items": "center",
        "justify-content": "center",
        padding: "0.375rem 0.75rem",
        "border-style": "none",
        "background-color": "transparent",
        "font-size": "0.875rem",
        "font-weight": "500",
        "border-radius": "0.25rem",
        cursor: "pointer",
        "outline": "none",
      },
      flags: {
        disabled: { opacity: "0.5", cursor: "not-allowed" },
      },
      pseudos: {
        ":hover": { "background-color": { token: "surface-accent" } },
        ":focus-visible": {
          outline: "2px solid",
          "outline-color": { token: "focus-ring" },
        },
      },
    },
    {
      part: "separator",
      element: "div",
      ownership: "consumer",
      ownershipReason: "Toolbar separators are consumer-provided dividers.",
      base: {
        width: "1px",
        "background-color": { token: "border" },
      },
    },
    {
      part: "toggle-group",
      element: "div",
      ownership: "consumer",
      ownershipReason: "Toggle group is consumer-provided toggle set.",
      base: {
        display: "inline-flex",
        "align-items": "center",
      },
    },
    {
      part: "toggle-item",
      element: "button",
      ownership: "consumer",
      ownershipReason: "Toggle items are consumer-provided toggle buttons.",
      base: {
        display: "inline-flex",
        "align-items": "center",
        "justify-content": "center",
        padding: "0.375rem 0.5rem",
        "border-style": "none",
        "background-color": "transparent",
        "font-size": "0.875rem",
        "border-radius": "0.25rem",
        cursor: "pointer",
        "outline": "none",
      },
      states: {
        on: { "background-color": { token: "surface-accent" } },
        off: { "background-color": "transparent" },
      },
      pseudos: {
        ":focus-visible": {
          outline: "2px solid",
          "outline-color": { token: "focus-ring" },
        },
      },
    },
  ],
}

/** Every recipe definition, keyed by scope. */
export const REFERENCE_DEFINITIONS: Readonly<Record<string, RecipeDefinition>> = {
  accordion: accordionRecipe,
  alert: alertRecipe,
  avatar: avatarRecipe,
  badge: badgeRecipe,
  breadcrumb: breadcrumbRecipe,
  button: buttonRecipe,
  card: cardRecipe,
  "command-palette": commandPaletteRecipe,
  "data-table": dataTableRecipe,
  checkbox: checkboxRecipe,
  combobox: comboboxRecipe,
  dialog: dialogRecipe,
  field: fieldRecipe,
  input: inputRecipe,
  kbd: kbdRecipe,
  menu: menuRecipe,
  meter: meterRecipe,
  "navigation-menu": navigationMenuRecipe,
  pagination: paginationRecipe,
  popover: popoverRecipe,
  progress: progressRecipe,
  "radio-group": radioGroupRecipe,
  "resizable-panels": resizablePanelsRecipe,
  "scroll-area": scrollAreaRecipe,
  select: selectRecipe,
  sheet: sheetRecipe,
  spinner: spinnerRecipe,
  switch: switchRecipe,
  tabs: tabsRecipe,
  toast: toastRecipe,
  toolbar: toolbarRecipe,
  tooltip: tooltipRecipe,
  typeset: typesetRecipe,
  prose: proseRecipe,
}
