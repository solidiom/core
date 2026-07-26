/** Recipe profile identifier. */
export const recipeProfile = "tailwind" as const

/** All primitives with recipe support in this profile. */
export const supportedPrimitives = [
  "dialog",
  "select",
  "button",
  "checkbox",
  "switch",
  "tabs",
  "accordion",
  "popover",
  "tooltip",
  "menu",
  "toast",
  "badge",
  "alert",
] as const
