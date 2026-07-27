/**
 * Anatomy registry — declares per-primitive structural requirements.
 *
 * For each primitive that has required parts, this registry encodes:
 * - requiredParts: child parts that must appear inside Root
 * - accessibleNameParts: parts that need an accessible name (via label sibling or aria-label/aria-labelledby)
 * - forbiddenProps: props consumers must not set on managed parts (the primitive handles them)
 */

export interface PrimitiveAnatomy {
  /** Child parts that must appear inside the Root subtree. */
  requiredParts: string[]
  /** Parts that require an accessible name (label sibling or aria-label/aria-labelledby). */
  accessibleNameParts: string[]
  /** Props consumers must not set on specific parts. Key = part name, value = forbidden prop names. */
  forbiddenProps: Record<string, string[]>
}

/**
 * Registry keyed by the primitive's namespace (e.g. "Dialog", "Menu").
 * Leaf primitives (Button, Label, VisuallyHidden, Separator, Progress, Meter) get no entries.
 */
export const ANATOMY_REGISTRY: Record<string, PrimitiveAnatomy> = {
  Dialog: {
    requiredParts: ["Content"],
    accessibleNameParts: ["Content"],
    forbiddenProps: {
      Content: ["role", "aria-modal"],
      Overlay: ["aria-hidden"],
    },
  },
  Menu: {
    requiredParts: ["Trigger", "Content"],
    accessibleNameParts: ["Content"],
    forbiddenProps: {
      Content: ["role"],
      Item: ["role"],
      Trigger: ["aria-haspopup", "aria-expanded"],
    },
  },
  Popover: {
    requiredParts: ["Trigger", "Content"],
    accessibleNameParts: [],
    forbiddenProps: {
      Content: ["role"],
      Trigger: ["aria-haspopup", "aria-expanded"],
    },
  },
  Tooltip: {
    requiredParts: ["Trigger", "Content"],
    accessibleNameParts: [],
    forbiddenProps: {
      Content: ["role"],
      Trigger: ["aria-describedby"],
    },
  },
  Combobox: {
    requiredParts: ["Input", "Content"],
    accessibleNameParts: ["Input"],
    forbiddenProps: {
      Input: ["role", "aria-expanded", "aria-autocomplete", "aria-activedescendant"],
      Content: ["role"],
      Item: ["role", "aria-selected"],
    },
  },
  Listbox: {
    requiredParts: ["Content"],
    accessibleNameParts: ["Content"],
    forbiddenProps: {
      Content: ["role"],
      Item: ["role", "aria-selected"],
    },
  },
  Accordion: {
    requiredParts: ["Item"],
    accessibleNameParts: [],
    forbiddenProps: {
      Item: ["role"],
      Trigger: ["aria-expanded", "aria-controls"],
      Content: ["role", "aria-labelledby"],
    },
  },
  Tabs: {
    requiredParts: ["List", "Content"],
    accessibleNameParts: ["List"],
    forbiddenProps: {
      List: ["role"],
      Trigger: ["role", "aria-selected", "aria-controls"],
      Content: ["role", "aria-labelledby"],
    },
  },
}

/** Get the anatomy definition for a primitive, or undefined for leaf primitives. */
export function getAnatomy(primitiveName: string): PrimitiveAnatomy | undefined {
  return ANATOMY_REGISTRY[primitiveName]
}
