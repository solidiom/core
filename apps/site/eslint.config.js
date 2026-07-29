/**
 * ESLint configuration for @solidiom/site (SITE-012).
 *
 * Every production source module, including Astro frontmatter, is subject to
 * static-route import restrictions. The companion `boundaries` target follows
 * transitive local imports from each static route, which prevents Astro files
 * or shared modules from bypassing this direct-import policy.
 */
import tsParser from "@typescript-eslint/parser"
import * as astroParser from "astro-eslint-parser"
import astroPlugin from "eslint-plugin-astro"

const staticRouteBoundaryRules = {
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
          group: ["**/theme-builder/**", "**/theme-builder", "**/themes/builder/**"],
          message:
            "Static routes cannot import theme-builder modules. Theme builder is a route-local lazy boundary (SITE-012).",
        },
        {
          group: ["**/editor/**", "**/editor"],
          message:
            "Static routes cannot import editor modules. Editor belongs in a route-local lazy boundary (SITE-012).",
        },
        {
          group: ["**/compiler/**", "**/compiler"],
          message:
            "Static routes cannot import compiler modules. Compiler transforms belong in a tool route boundary (SITE-012).",
        },
        {
          group: ["@babel/**", "babel-*"],
          message:
            "Static routes cannot import Babel. Compiler transforms belong in a tool route boundary (SITE-012).",
        },
        {
          group: ["monaco-editor", "monaco-editor/**"],
          message:
            "Static routes cannot import Monaco Editor. Editor belongs in a route-local lazy boundary (SITE-012).",
        },
        {
          group: ["@codemirror/**", "codemirror"],
          message:
            "Static routes cannot import CodeMirror. Editor belongs in a route-local lazy boundary (SITE-012).",
        },
      ],
    },
  ],
}

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: ["dist/**", "node_modules/**", ".astro/**"],
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
    rules: staticRouteBoundaryRules,
  },
  {
    files: ["src/**/*.astro"],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: [".astro"],
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      astro: astroPlugin,
    },
    rules: staticRouteBoundaryRules,
  },
  // Tool route directories own their lazy tool dependencies. The transitive
  // graph validator has matching exemptions for these exact route boundaries.
  {
    files: [
      "src/pages/playground/**/*.{astro,ts,tsx}",
      "src/pages/themes/builder/**/*.{astro,ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": "off",
    },
  },
]
