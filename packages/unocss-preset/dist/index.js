// src/index.ts
import {
  SEMANTIC_FLAGS,
  SEMANTIC_ORIENTATIONS,
  SEMANTIC_SIDES,
  allStateValues
} from "@solidiom/runtime";

// src/generated-variant-rules.ts
var SOLIDIOM_VARIANT_RULES = [
  [
    "solidiom-badge--default",
    {
      "background-color": "var(--ui-primary, hsl(222 47% 11%))",
      color: "var(--ui-primary-fg, hsl(0 0% 100%))"
    }
  ],
  [
    "solidiom-badge--secondary",
    {
      "background-color": "var(--ui-secondary, hsl(210 40% 96%))",
      color: "var(--ui-secondary-fg, hsl(222 47% 11%))"
    }
  ],
  [
    "solidiom-badge--destructive",
    {
      "background-color": "var(--ui-destructive, hsl(0 84% 60%))",
      color: "var(--ui-destructive-fg, hsl(0 0% 100%))"
    }
  ],
  [
    "solidiom-badge--outline",
    {
      color: "var(--ui-fg, hsl(222 47% 11%))",
      "border-color": "var(--ui-border, hsl(214 32% 91%))",
      "background-color": "transparent"
    }
  ],
  [
    "solidiom-btn--default",
    {
      "background-color": "var(--ui-primary, hsl(222 47% 11%))",
      color: "var(--ui-primary-fg, hsl(0 0% 100%))"
    }
  ],
  [
    "solidiom-btn--destructive",
    {
      "background-color": "var(--ui-destructive, hsl(0 84% 60%))",
      color: "var(--ui-destructive-fg, hsl(0 0% 100%))"
    }
  ],
  [
    "solidiom-btn--outline",
    {
      "background-color": "transparent",
      color: "var(--ui-fg, hsl(222 47% 11%))",
      "border-style": "solid",
      "border-width": "1px",
      "border-color": "var(--ui-border, hsl(214 32% 91%))"
    }
  ],
  [
    "solidiom-btn--secondary",
    {
      "background-color": "var(--ui-secondary, hsl(210 40% 96%))",
      color: "var(--ui-secondary-fg, hsl(222 47% 11%))"
    }
  ],
  [
    "solidiom-btn--ghost",
    {
      "background-color": "transparent",
      color: "var(--ui-fg, hsl(222 47% 11%))"
    }
  ],
  [
    "solidiom-btn--link",
    {
      "background-color": "transparent",
      color: "var(--ui-primary, hsl(222 47% 11%))",
      "text-decoration-line": "underline",
      "text-underline-offset": "4px"
    }
  ],
  [
    "solidiom-btn--sm",
    {
      height: "2.25rem",
      padding: "0 0.75rem",
      "font-size": "0.875rem"
    }
  ],
  [
    "solidiom-btn--md",
    {
      height: "2.5rem",
      padding: "0.5rem 1rem",
      "font-size": "0.875rem"
    }
  ],
  [
    "solidiom-btn--lg",
    {
      height: "2.75rem",
      padding: "0 2rem",
      "font-size": "1rem"
    }
  ],
  [
    "solidiom-btn--icon",
    {
      height: "2.5rem",
      width: "2.5rem",
      padding: "0"
    }
  ],
  [
    "solidiom-btn--ghost-icon",
    {
      "border-radius": "var(--ui-radius-full, 9999px)"
    }
  ],
  [
    "solidiom-btn--link-md",
    {
      height: "auto",
      padding: "0"
    }
  ]
];

// src/index.ts
var FLAG_NAMES = new Set(SEMANTIC_FLAGS);
function pascalCase(value) {
  return value.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("");
}
function getSolidiomVariants(options = {}) {
  const p = options.prefix ?? "ui";
  const flagVariants = SEMANTIC_FLAGS.map((flag) => ({
    name: `${p}${pascalCase(flag)}`,
    selector: `[data-${flag}]`
  }));
  const stateVariants = allStateValues().map((state) => ({
    name: FLAG_NAMES.has(state) ? `${p}State${pascalCase(state)}` : `${p}${pascalCase(state)}`,
    selector: `[data-state='${state}']`
  }));
  const orientationVariants = SEMANTIC_ORIENTATIONS.map((orientation) => ({
    name: `${p}${pascalCase(orientation)}`,
    selector: `[data-orientation='${orientation}']`
  }));
  const sideVariants = SEMANTIC_SIDES.map((side) => ({
    name: `${p}Side${pascalCase(side)}`,
    selector: `[data-side='${side}']`
  }));
  return [...flagVariants, ...stateVariants, ...orientationVariants, ...sideVariants];
}
function getSolidiomVariantRules() {
  return SOLIDIOM_VARIANT_RULES;
}
function presetSolidiom(options = {}) {
  const variants = getSolidiomVariants(options);
  return {
    name: "@solidiom/unocss-preset",
    variants: variants.map((v) => ({
      name: v.name,
      match: (input) => {
        if (!input.startsWith(`${v.name}:`)) return void 0;
        return {
          matcher: input.slice(v.name.length + 1),
          selector: (s) => `${s}${v.selector}`
        };
      }
    })),
    rules: getSolidiomVariantRules()
  };
}
export {
  getSolidiomVariantRules,
  getSolidiomVariants,
  presetSolidiom
};
//# sourceMappingURL=index.js.map