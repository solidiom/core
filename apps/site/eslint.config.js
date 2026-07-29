/**
 * ESLint configuration for @solidiom/site (SITE-012).
 *
 * Enforces import-boundary rules: static routes cannot import modules
 * from playground, theme-builder, editor, or compiler namespaces. These
 * tool routes are lazy-loaded via their own route-level entry points and
 * must never leak into the static content bundle.
 *
 * The boundaries are enforced via no-restricted-imports with custom
 * patterns. This ensures:
 *   - Static pages (pages/, layouts/, components/) cannot pull in heavy
 *     tool dependencies that would bloat the static bundle.
 *   - Tool routes can import from shared lib/ but not vice versa for
 *     tool-specific modules.
 */
import tsParser from "@typescript-eslint/parser"

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    // Global ignores — Astro files need a dedicated parser not yet configured.
    ignores: ["**/*.astro", "dist/**", "node_modules/**", ".astro/**"],
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/playground/**", "**/playground"],
              message:
                "Static routes cannot import playground modules. Playground is a route-local lazy boundary (SITE-012).",
            },
            {
              group: ["**/theme-builder/**", "**/theme-builder"],
              message:
                "Static routes cannot import theme-builder modules. Theme builder is a route-local lazy boundary (SITE-012).",
            },
            {
              group: ["**/editor/**", "**/editor"],
              message:
                "Static routes cannot import editor modules. Editor is a route-local lazy boundary (SITE-012).",
            },
            {
              group: ["**/compiler/**", "**/compiler"],
              message:
                "Static routes cannot import compiler modules. Compiler is a route-local lazy boundary (SITE-012).",
            },
            {
              group: ["@babel/**", "babel-*"],
              message:
                "Static routes cannot import Babel. Compiler transforms belong in the playground/editor route boundary (SITE-012).",
            },
            {
              group: ["monaco-editor", "monaco-editor/**"],
              message:
                "Static routes cannot import Monaco Editor. Editor belongs in the playground route boundary (SITE-012).",
            },
            {
              group: ["@codemirror/**", "codemirror"],
              message:
                "Static routes cannot import CodeMirror. Editor belongs in the playground route boundary (SITE-012).",
            },
          ],
        },
      ],
    },
  },
  // Tool route directories are exempt — they can import their own modules.
  {
    files: [
      "src/pages/playground/**/*.{ts,tsx}",
      "src/pages/theme-builder/**/*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": "off",
    },
  },
]
