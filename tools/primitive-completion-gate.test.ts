import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import { mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { auditPrimitiveCompletion } from "./primitive-completion-gate"

const tempRoots: string[] = []

function write(root: string, path: string, content: string): void {
  const fullPath = join(root, path)
  mkdirSync(join(fullPath, ".."), { recursive: true })
  writeFileSync(fullPath, content)
}

function createFixture(recipeMode: "recipe" | "headless-only" = "headless-only"): string {
  const root = mkdtempSync(join(tmpdir(), "solidiom-primitive-gate-"))
  tempRoots.push(root)

  write(
    root,
    "registry/index.json",
    JSON.stringify({
      version: 1,
      primitives: [
        {
          name: "example",
          version: "0.0.1-next.0",
          package: "@solidiom/example",
          label: "Example",
          description: "Example primitive.",
          category: "input",
        },
      ],
      adapters: [],
    }),
  )
  write(
    root,
    "registry/example.json",
    JSON.stringify({
      name: "example",
      version: "0.0.1-next.0",
      package: "@solidiom/example",
      capabilities: [],
      dependencies: ["@solidiom/runtime"],
      source: { entry: "src/index.tsx", files: ["src/index.tsx"] },
      runtime: ["dom/semantic-attrs"],
    }),
  )
  write(
    root,
    "tools/primitive-completion-policy.json",
    JSON.stringify({
      recipe: recipeMode === "recipe" ? ["example"] : [],
      headlessOnly: recipeMode === "headless-only" ? ["example"] : [],
    }),
  )
  write(
    root,
    "packages/example/package.json",
    JSON.stringify({
      name: "@solidiom/example",
      version: "0.0.1-next.0",
      private: false,
      files: ["dist", "source", "src", "!src/**/*.test.*"],
      exports: {
        ".": { solid: "./source/index.tsx", import: "./dist/index.js", types: "./dist/index.d.ts" },
      },
      scripts: { build: "tsup", test: "vitest run", typecheck: "tsc --noEmit" },
      nx: {
        tags: ["layer:primitive"],
        metadata: { label: "Example", description: "Example primitive.", category: "input" },
      },
    }),
  )
  write(
    root,
    "packages/example/src/index.tsx",
    '/** Example primitive. */\nimport { type JSX } from "@solidjs/web"\nimport { applySemanticAttrs } from "@solidiom/runtime"\nexport interface ExampleProps { class?: string; children?: JSX.Element }\nexport function Root(props: ExampleProps) { return <div class={props.class} {...applySemanticAttrs({ scope: "example", part: "root" })}>{props.children}</div> }\n',
  )
  write(
    root,
    "packages/example/src/example.browser.test.tsx",
    'import { expect, it } from "vitest"\nit("renders", () => expect(true).toBe(true))\n',
  )
  write(root, "packages/example/source/index.tsx", 'export * from "../src/index"\n')
  write(root, "packages/primitives/src/index.ts", 'export * as Example from "@solidiom/example"\n')
  write(
    root,
    "packages/primitives/package.json",
    JSON.stringify({ dependencies: { "@solidiom/example": "workspace:*" } }),
  )
  write(
    root,
    "apps/docs/src/demos/index.ts",
    'export const demos = { example: { component: () => null, code: "" } }\n',
  )
  write(
    root,
    "apps/docs/src/demos/example-demo.tsx",
    'import * as Example from "@solidiom/example"\nexport function ExampleDemo() { return <Example.Root /> }\nexport const exampleDemoCode = "example"\n',
  )
  write(
    root,
    "apps/docs/package.json",
    JSON.stringify({ dependencies: { "@solidiom/example": "workspace:*" } }),
  )

  for (const profile of ["css", "tailwind"]) {
    write(
      root,
      `packages/recipes-${profile}/src/meta.ts`,
      `export const supportedPrimitives = ${recipeMode === "recipe" ? '[\"example\"]' : "[]"} as const\n`,
    )
    write(
      root,
      `packages/recipes-${profile}/package.json`,
      JSON.stringify({
        dependencies: recipeMode === "recipe" ? { "@solidiom/example": "workspace:*" } : {},
        exports:
          recipeMode === "recipe" ? { "./styles/example.css": "./dist/styles/example.css" } : {},
      }),
    )
    if (recipeMode === "recipe") {
      write(
        root,
        `packages/recipes-${profile}/src/recipes/example.tsx`,
        "export function StyledExample() { return null }\n",
      )
      write(
        root,
        `packages/recipes-${profile}/src/styles/example.css`,
        '[data-scope="example"] {}\n',
      )
      write(
        root,
        `packages/recipes-${profile}/src/index.ts`,
        'export { StyledExample } from "./recipes/example"\n',
      )
    } else {
      write(root, `packages/recipes-${profile}/src/index.ts`, "export {}\n")
    }
  }
  write(
    root,
    "packages/recipes-unocss/src/index.ts",
    `export const supportedPrimitives = ${recipeMode === "recipe" ? '[\"example\"]' : "[]"}\n`,
  )

  return root
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) rmSync(root, { recursive: true, force: true })
})

describe("auditPrimitiveCompletion", () => {
  it("passes a fully wired headless-only primitive", () => {
    const report = auditPrimitiveCompletion(createFixture())
    expect(report.failures).toEqual([])
    expect(report.checked).toBe(1)
  })

  it("reports missing test, umbrella, docs, and manifest wiring", () => {
    const root = createFixture()
    rmSync(join(root, "packages/example/src/example.browser.test.tsx"))
    write(root, "packages/primitives/src/index.ts", "export {}\n")
    write(root, "apps/docs/src/demos/index.ts", "export const demos = {}\n")
    rmSync(join(root, "registry/example.json"))

    const messages = auditPrimitiveCompletion(root).failures.map((failure) => failure.message)
    expect(messages).toContain("must include at least one unit or browser test")
    expect(messages).toContain("must be exported by @solidiom/primitives")
    expect(messages).toContain("must have a docs demo entry")
    expect(messages).toContain("must have registry/example.json")
  })

  it("requires every public primitive to have an explicit recipe policy", () => {
    const root = createFixture()
    write(
      root,
      "tools/primitive-completion-policy.json",
      JSON.stringify({ recipe: [], headlessOnly: [] }),
    )

    expect(auditPrimitiveCompletion(root).failures.map((failure) => failure.message)).toContain(
      "must be classified as recipe or headless-only",
    )
  })

  it("checks all three recipe profiles for recipe primitives", () => {
    const root = createFixture("recipe")
    rmSync(join(root, "packages/recipes-css/src/styles/example.css"))

    expect(auditPrimitiveCompletion(root).failures.map((failure) => failure.message)).toContain(
      "must have a CSS recipe stylesheet",
    )
  })
})
