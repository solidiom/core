import { describe, expect, it } from "vitest"
import { normalizeTypeDocProject } from "./generate-api-docs"

/**
 * Minimal serialized-TypeDoc-project fixtures. These mirror the shape
 * TypeDoc's JSON serializer actually produces for a callback prop like
 * `onOpenChange?: (open: boolean, details: X) => void` (verified against a
 * live `app.serializer.projectToObject` run), not a hand-guessed shape.
 */

function functionTypeProject() {
  return {
    id: 0,
    name: "Documentation",
    kind: 1,
    children: [
      {
        id: 1,
        name: "Root",
        kindString: "Function",
        kind: 64,
        signatures: [
          {
            id: 2,
            name: "Root",
            parameters: [
              {
                id: 3,
                name: "props",
                type: {
                  type: "reference",
                  name: "RootProps",
                  target: 10,
                },
              },
            ],
            type: { type: "intrinsic", name: "Element" },
          },
        ],
      },
      {
        id: 10,
        name: "RootProps",
        kindString: "Interface",
        kind: 256,
        children: [
          {
            id: 11,
            name: "onOpenChange",
            kindString: "Property",
            kind: 1024,
            flags: { isOptional: true },
            type: {
              type: "reflection",
              declaration: {
                id: 12,
                name: "__type",
                kind: 65536,
                signatures: [
                  {
                    id: 13,
                    name: "__type",
                    parameters: [
                      { id: 14, name: "open", type: { type: "intrinsic", name: "boolean" } },
                      {
                        id: 15,
                        name: "details",
                        type: { type: "reference", name: "ChangeDetails" },
                      },
                    ],
                    type: { type: "intrinsic", name: "void" },
                  },
                ],
              },
            },
          },
          {
            id: 16,
            name: "noArgCallback",
            kindString: "Property",
            kind: 1024,
            flags: { isOptional: true },
            type: {
              type: "reflection",
              declaration: {
                id: 17,
                name: "__type",
                kind: 65536,
                signatures: [
                  {
                    id: 18,
                    name: "__type",
                    parameters: [],
                    type: { type: "intrinsic", name: "void" },
                  },
                ],
              },
            },
          },
          {
            id: 19,
            name: "inlineObject",
            kindString: "Property",
            kind: 1024,
            flags: { isOptional: true },
            type: {
              type: "reflection",
              declaration: {
                id: 20,
                name: "__type",
                kind: 65536,
                children: [
                  {
                    id: 21,
                    name: "label",
                    kindString: "Property",
                    kind: 1024,
                    type: { type: "intrinsic", name: "string" },
                  },
                ],
              },
            },
          },
        ],
      },
    ],
  }
}

describe("generate-api-docs: renderType for reflection types", () => {
  const document = normalizeTypeDocProject(functionTypeProject(), "@solidiom/fixture", [
    "packages/fixture/src/index.ts",
  ])
  const props = document.exports.find((entry) => entry.name === "Root")?.props ?? []
  const propType = (name: string) => props.find((prop) => prop.name === name)?.type

  it("renders a callback prop as a function signature, not a placeholder", () => {
    expect(propType("onOpenChange")).toBe("(open: boolean, details: ChangeDetails) => void")
  })

  it("renders a zero-parameter callback prop", () => {
    expect(propType("noArgCallback")).toBe("() => void")
  })

  it("still renders a genuine inline object-literal type as the generic placeholder", () => {
    expect(propType("inlineObject")).toBe("{ … }")
  })
})
