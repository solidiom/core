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

// src/generated-theme-preflights.ts
var SOLIDIOM_THEME_PREFLIGHTS = [
  {
    slug: "solidiom-default",
    name: "Solidiom Default",
    css: ':root,\n:root[data-theme="light"] {\n  --ui-border: #CBD5E1;\n  --ui-destructive: #E5484D;\n  --ui-fg: #111827;\n  --ui-focus-ring: #5750D6;\n  --ui-font-size-base: 0.875rem;\n  --ui-font-size-lg: 1.25rem;\n  --ui-font-size-md: 1.125rem;\n  --ui-font-size-sm: 0.875rem;\n  --ui-font-size-xl: 1.875rem;\n  --ui-font-size-xs: 0.75rem;\n  --ui-line-height-base: 1.25rem;\n  --ui-line-height-lg: 1.5rem;\n  --ui-line-height-md: 1.5rem;\n  --ui-line-height-sm: 1.25rem;\n  --ui-line-height-xl: 2.25rem;\n  --ui-line-height-xs: 1rem;\n  --ui-muted-fg: #334155;\n  --ui-primary: #5750D6;\n  --ui-primary-fg: #FFFFFF;\n  --ui-primary-hover: #4C46C5;\n  --ui-radius: 12px;\n  --ui-radius-full: 999px;\n  --ui-radius-lg: 16px;\n  --ui-radius-sm: 8px;\n  --ui-secondary: #2563EB;\n  --ui-shadow-lg: 0 8px 24px -4px rgba(15, 23, 42, 0.08), 0 2px 8px -4px rgba(15, 23, 42, 0.04);\n  --ui-shadow-md: 0 2px 6px -1px rgba(15, 23, 42, 0.06), 0 1px 4px -2px rgba(15, 23, 42, 0.04);\n  --ui-shadow-sm: 0 1px 2px 0 rgba(15, 23, 42, 0.04);\n  --ui-success-fg: #22C55E;\n  --ui-surface: #F8FAFC;\n  --ui-surface-overlay: #FFFFFF;\n  --ui-warning-fg: #F59E0B;\n}\n\n:root[data-theme="dark"] {\n  --ui-border: #334155;\n  --ui-destructive: #F87171;\n  --ui-fg: #F1F5F9;\n  --ui-focus-ring: #8B83F8;\n  --ui-font-size-base: 0.875rem;\n  --ui-font-size-lg: 1.25rem;\n  --ui-font-size-md: 1.125rem;\n  --ui-font-size-sm: 0.875rem;\n  --ui-font-size-xl: 1.875rem;\n  --ui-font-size-xs: 0.75rem;\n  --ui-line-height-base: 1.25rem;\n  --ui-line-height-lg: 1.5rem;\n  --ui-line-height-md: 1.5rem;\n  --ui-line-height-sm: 1.25rem;\n  --ui-line-height-xl: 2.25rem;\n  --ui-line-height-xs: 1rem;\n  --ui-muted-fg: #94A3B8;\n  --ui-primary: #8B83F8;\n  --ui-primary-fg: #0F172A;\n  --ui-primary-hover: #A19BFA;\n  --ui-radius: 12px;\n  --ui-radius-full: 999px;\n  --ui-radius-lg: 16px;\n  --ui-radius-sm: 8px;\n  --ui-secondary: #60A5FA;\n  --ui-shadow-lg: 0 10px 30px -4px rgba(0, 0, 0, 0.4), 0 4px 10px -4px rgba(0, 0, 0, 0.25);\n  --ui-shadow-md: 0 3px 8px -1px rgba(0, 0, 0, 0.3), 0 1px 4px -2px rgba(0, 0, 0, 0.2);\n  --ui-shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.2);\n  --ui-success-fg: #4ADE80;\n  --ui-surface: #0F172A;\n  --ui-surface-overlay: #1E293B;\n  --ui-warning-fg: #FBBF24;\n}'
  },
  {
    slug: "ocean",
    name: "Ocean",
    css: ':root,\n:root[data-theme="light"] {\n  --ui-border: #9DB4C0;\n  --ui-destructive: #DC2626;\n  --ui-fg: #0C2D48;\n  --ui-focus-ring: #0B7285;\n  --ui-font-size-base: 0.875rem;\n  --ui-font-size-lg: 1.25rem;\n  --ui-font-size-md: 1.125rem;\n  --ui-font-size-sm: 0.875rem;\n  --ui-font-size-xl: 1.875rem;\n  --ui-font-size-xs: 0.75rem;\n  --ui-line-height-base: 1.25rem;\n  --ui-line-height-lg: 1.5rem;\n  --ui-line-height-md: 1.5rem;\n  --ui-line-height-sm: 1.25rem;\n  --ui-line-height-xl: 2.25rem;\n  --ui-line-height-xs: 1rem;\n  --ui-muted-fg: #334E68;\n  --ui-primary: #0B7285;\n  --ui-primary-fg: #FFFFFF;\n  --ui-primary-hover: #0A5F71;\n  --ui-radius: 12px;\n  --ui-radius-full: 999px;\n  --ui-radius-lg: 16px;\n  --ui-radius-sm: 8px;\n  --ui-secondary: #0284C7;\n  --ui-shadow-lg: 0 8px 24px -4px rgba(12, 45, 72, 0.08), 0 2px 8px -4px rgba(12, 45, 72, 0.04);\n  --ui-shadow-md: 0 2px 6px -1px rgba(12, 45, 72, 0.06), 0 1px 4px -2px rgba(12, 45, 72, 0.04);\n  --ui-shadow-sm: 0 1px 2px 0 rgba(12, 45, 72, 0.04);\n  --ui-success-fg: #059669;\n  --ui-surface: #F0F9FF;\n  --ui-surface-overlay: #FFFFFF;\n  --ui-warning-fg: #D97706;\n}\n\n:root[data-theme="dark"] {\n  --ui-border: #234666;\n  --ui-destructive: #F87171;\n  --ui-fg: #E0F2FE;\n  --ui-focus-ring: #22D3EE;\n  --ui-font-size-base: 0.875rem;\n  --ui-font-size-lg: 1.25rem;\n  --ui-font-size-md: 1.125rem;\n  --ui-font-size-sm: 0.875rem;\n  --ui-font-size-xl: 1.875rem;\n  --ui-font-size-xs: 0.75rem;\n  --ui-line-height-base: 1.25rem;\n  --ui-line-height-lg: 1.5rem;\n  --ui-line-height-md: 1.5rem;\n  --ui-line-height-sm: 1.25rem;\n  --ui-line-height-xl: 2.25rem;\n  --ui-line-height-xs: 1rem;\n  --ui-muted-fg: #9DB4C0;\n  --ui-primary: #22D3EE;\n  --ui-primary-fg: #0A1929;\n  --ui-primary-hover: #67E8F9;\n  --ui-radius: 12px;\n  --ui-radius-full: 999px;\n  --ui-radius-lg: 16px;\n  --ui-radius-sm: 8px;\n  --ui-secondary: #38BDF8;\n  --ui-shadow-lg: 0 10px 30px -4px rgba(0, 0, 0, 0.4), 0 4px 10px -4px rgba(0, 0, 0, 0.25);\n  --ui-shadow-md: 0 3px 8px -1px rgba(0, 0, 0, 0.3), 0 1px 4px -2px rgba(0, 0, 0, 0.2);\n  --ui-shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.2);\n  --ui-success-fg: #34D399;\n  --ui-surface: #0A1929;\n  --ui-surface-overlay: #132F4C;\n  --ui-warning-fg: #FBBF24;\n}'
  },
  {
    slug: "forest",
    name: "Forest",
    css: ':root,\n:root[data-theme="light"] {\n  --ui-border: #B5C4A6;\n  --ui-destructive: #B91C1C;\n  --ui-fg: #1A2E05;\n  --ui-focus-ring: #3E6B24;\n  --ui-font-size-base: 0.875rem;\n  --ui-font-size-lg: 1.25rem;\n  --ui-font-size-md: 1.125rem;\n  --ui-font-size-sm: 0.875rem;\n  --ui-font-size-xl: 1.875rem;\n  --ui-font-size-xs: 0.75rem;\n  --ui-line-height-base: 1.25rem;\n  --ui-line-height-lg: 1.5rem;\n  --ui-line-height-md: 1.5rem;\n  --ui-line-height-sm: 1.25rem;\n  --ui-line-height-xl: 2.25rem;\n  --ui-line-height-xs: 1rem;\n  --ui-muted-fg: #4A5D3A;\n  --ui-primary: #3E6B24;\n  --ui-primary-fg: #FFFFFF;\n  --ui-primary-hover: #33581C;\n  --ui-radius: 12px;\n  --ui-radius-full: 999px;\n  --ui-radius-lg: 16px;\n  --ui-radius-sm: 8px;\n  --ui-secondary: #5B8C3E;\n  --ui-shadow-lg: 0 8px 24px -4px rgba(26, 46, 5, 0.08), 0 2px 8px -4px rgba(26, 46, 5, 0.04);\n  --ui-shadow-md: 0 2px 6px -1px rgba(26, 46, 5, 0.06), 0 1px 4px -2px rgba(26, 46, 5, 0.04);\n  --ui-shadow-sm: 0 1px 2px 0 rgba(26, 46, 5, 0.04);\n  --ui-success-fg: #2D7A2D;\n  --ui-surface: #FAFAF5;\n  --ui-surface-overlay: #FFFFFF;\n  --ui-warning-fg: #B45309;\n}\n\n:root[data-theme="dark"] {\n  --ui-border: #2D4A22;\n  --ui-destructive: #F87171;\n  --ui-fg: #E8F0E0;\n  --ui-focus-ring: #86EFAC;\n  --ui-font-size-base: 0.875rem;\n  --ui-font-size-lg: 1.25rem;\n  --ui-font-size-md: 1.125rem;\n  --ui-font-size-sm: 0.875rem;\n  --ui-font-size-xl: 1.875rem;\n  --ui-font-size-xs: 0.75rem;\n  --ui-line-height-base: 1.25rem;\n  --ui-line-height-lg: 1.5rem;\n  --ui-line-height-md: 1.5rem;\n  --ui-line-height-sm: 1.25rem;\n  --ui-line-height-xl: 2.25rem;\n  --ui-line-height-xs: 1rem;\n  --ui-muted-fg: #9DB490;\n  --ui-primary: #86EFAC;\n  --ui-primary-fg: #0F1A0A;\n  --ui-primary-hover: #BBF7D0;\n  --ui-radius: 12px;\n  --ui-radius-full: 999px;\n  --ui-radius-lg: 16px;\n  --ui-radius-sm: 8px;\n  --ui-secondary: #4ADE80;\n  --ui-shadow-lg: 0 10px 30px -4px rgba(0, 0, 0, 0.4), 0 4px 10px -4px rgba(0, 0, 0, 0.25);\n  --ui-shadow-md: 0 3px 8px -1px rgba(0, 0, 0, 0.3), 0 1px 4px -2px rgba(0, 0, 0, 0.2);\n  --ui-shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.2);\n  --ui-success-fg: #4ADE80;\n  --ui-surface: #0F1A0A;\n  --ui-surface-overlay: #1A2E14;\n  --ui-warning-fg: #FBBF24;\n}'
  },
  {
    slug: "slate",
    name: "Slate",
    css: ':root,\n:root[data-theme="light"] {\n  --ui-border: #94A3B8;\n  --ui-destructive: #DC2626;\n  --ui-fg: #0F172A;\n  --ui-focus-ring: #475569;\n  --ui-font-size-base: 0.875rem;\n  --ui-font-size-lg: 1.25rem;\n  --ui-font-size-md: 1.125rem;\n  --ui-font-size-sm: 0.875rem;\n  --ui-font-size-xl: 1.875rem;\n  --ui-font-size-xs: 0.75rem;\n  --ui-line-height-base: 1.25rem;\n  --ui-line-height-lg: 1.5rem;\n  --ui-line-height-md: 1.5rem;\n  --ui-line-height-sm: 1.25rem;\n  --ui-line-height-xl: 2.25rem;\n  --ui-line-height-xs: 1rem;\n  --ui-muted-fg: #334155;\n  --ui-primary: #475569;\n  --ui-primary-fg: #FFFFFF;\n  --ui-primary-hover: #374151;\n  --ui-radius: 12px;\n  --ui-radius-full: 999px;\n  --ui-radius-lg: 16px;\n  --ui-radius-sm: 8px;\n  --ui-secondary: #64748B;\n  --ui-shadow-lg: 0 8px 24px -4px rgba(15, 23, 42, 0.08), 0 2px 8px -4px rgba(15, 23, 42, 0.04);\n  --ui-shadow-md: 0 2px 6px -1px rgba(15, 23, 42, 0.06), 0 1px 4px -2px rgba(15, 23, 42, 0.04);\n  --ui-shadow-sm: 0 1px 2px 0 rgba(15, 23, 42, 0.04);\n  --ui-success-fg: #16A34A;\n  --ui-surface: #F8FAFC;\n  --ui-surface-overlay: #FFFFFF;\n  --ui-warning-fg: #CA8A04;\n}\n\n:root[data-theme="dark"] {\n  --ui-border: #334155;\n  --ui-destructive: #F87171;\n  --ui-fg: #F1F5F9;\n  --ui-focus-ring: #94A3B8;\n  --ui-font-size-base: 0.875rem;\n  --ui-font-size-lg: 1.25rem;\n  --ui-font-size-md: 1.125rem;\n  --ui-font-size-sm: 0.875rem;\n  --ui-font-size-xl: 1.875rem;\n  --ui-font-size-xs: 0.75rem;\n  --ui-line-height-base: 1.25rem;\n  --ui-line-height-lg: 1.5rem;\n  --ui-line-height-md: 1.5rem;\n  --ui-line-height-sm: 1.25rem;\n  --ui-line-height-xl: 2.25rem;\n  --ui-line-height-xs: 1rem;\n  --ui-muted-fg: #94A3B8;\n  --ui-primary: #94A3B8;\n  --ui-primary-fg: #0F172A;\n  --ui-primary-hover: #CBD5E1;\n  --ui-radius: 12px;\n  --ui-radius-full: 999px;\n  --ui-radius-lg: 16px;\n  --ui-radius-sm: 8px;\n  --ui-secondary: #64748B;\n  --ui-shadow-lg: 0 10px 30px -4px rgba(0, 0, 0, 0.4), 0 4px 10px -4px rgba(0, 0, 0, 0.25);\n  --ui-shadow-md: 0 3px 8px -1px rgba(0, 0, 0, 0.3), 0 1px 4px -2px rgba(0, 0, 0, 0.2);\n  --ui-shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.2);\n  --ui-success-fg: #4ADE80;\n  --ui-surface: #0F172A;\n  --ui-surface-overlay: #1E293B;\n  --ui-warning-fg: #FBBF24;\n}'
  },
  {
    slug: "aurora",
    name: "Aurora",
    css: ':root,\n:root[data-theme="light"] {\n  --ui-border: #C4B5FD;\n  --ui-destructive: #DC2626;\n  --ui-fg: #1E1B4B;\n  --ui-focus-ring: #7C3AED;\n  --ui-font-size-base: 0.875rem;\n  --ui-font-size-lg: 1.25rem;\n  --ui-font-size-md: 1.125rem;\n  --ui-font-size-sm: 0.875rem;\n  --ui-font-size-xl: 1.875rem;\n  --ui-font-size-xs: 0.75rem;\n  --ui-line-height-base: 1.25rem;\n  --ui-line-height-lg: 1.5rem;\n  --ui-line-height-md: 1.5rem;\n  --ui-line-height-sm: 1.25rem;\n  --ui-line-height-xl: 2.25rem;\n  --ui-line-height-xs: 1rem;\n  --ui-muted-fg: #4C1D95;\n  --ui-primary: #7C3AED;\n  --ui-primary-fg: #FFFFFF;\n  --ui-primary-hover: #6D28D9;\n  --ui-radius: 12px;\n  --ui-radius-full: 999px;\n  --ui-radius-lg: 16px;\n  --ui-radius-sm: 8px;\n  --ui-secondary: #8B5CF6;\n  --ui-shadow-lg: 0 8px 24px -4px rgba(30, 27, 75, 0.08), 0 2px 8px -4px rgba(30, 27, 75, 0.04);\n  --ui-shadow-md: 0 2px 6px -1px rgba(30, 27, 75, 0.06), 0 1px 4px -2px rgba(30, 27, 75, 0.04);\n  --ui-shadow-sm: 0 1px 2px 0 rgba(30, 27, 75, 0.04);\n  --ui-success-fg: #059669;\n  --ui-surface: #FAFAFE;\n  --ui-surface-overlay: #FFFFFF;\n  --ui-warning-fg: #D97706;\n}\n\n:root[data-theme="dark"] {\n  --ui-border: #4C1D95;\n  --ui-destructive: #F87171;\n  --ui-fg: #EDE9FE;\n  --ui-focus-ring: #C084FC;\n  --ui-font-size-base: 0.875rem;\n  --ui-font-size-lg: 1.25rem;\n  --ui-font-size-md: 1.125rem;\n  --ui-font-size-sm: 0.875rem;\n  --ui-font-size-xl: 1.875rem;\n  --ui-font-size-xs: 0.75rem;\n  --ui-line-height-base: 1.25rem;\n  --ui-line-height-lg: 1.5rem;\n  --ui-line-height-md: 1.5rem;\n  --ui-line-height-sm: 1.25rem;\n  --ui-line-height-xl: 2.25rem;\n  --ui-line-height-xs: 1rem;\n  --ui-muted-fg: #A78BFA;\n  --ui-primary: #C084FC;\n  --ui-primary-fg: #1A1033;\n  --ui-primary-hover: #D8B4FE;\n  --ui-radius: 12px;\n  --ui-radius-full: 999px;\n  --ui-radius-lg: 16px;\n  --ui-radius-sm: 8px;\n  --ui-secondary: #A855F7;\n  --ui-shadow-lg: 0 10px 30px -4px rgba(0, 0, 0, 0.4), 0 4px 10px -4px rgba(0, 0, 0, 0.25);\n  --ui-shadow-md: 0 3px 8px -1px rgba(0, 0, 0, 0.3), 0 1px 4px -2px rgba(0, 0, 0, 0.2);\n  --ui-shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.2);\n  --ui-success-fg: #34D399;\n  --ui-surface: #1A1033;\n  --ui-surface-overlay: #2D1B69;\n  --ui-warning-fg: #FBBF24;\n}'
  }
];
function themePreflight(slug) {
  return SOLIDIOM_THEME_PREFLIGHTS.find((theme) => theme.slug === slug);
}

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
  const preflight = options.theme ? themePreflight(options.theme) : void 0;
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
    rules: getSolidiomVariantRules(),
    preflights: preflight ? [{ getCSS: () => preflight.css }] : []
  };
}
export {
  SOLIDIOM_THEME_PREFLIGHTS,
  getSolidiomVariantRules,
  getSolidiomVariants,
  presetSolidiom,
  themePreflight
};
//# sourceMappingURL=index.js.map