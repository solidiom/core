import { describe, expect, it } from "vitest"
import { API_SCHEMA_URL, API_SCHEMA_VERSION } from "./api-schema"
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

function schemaCoverageProject() {
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
        comment: {
          summary: [{ text: "Renders the primitive root." }],
          blockTags: [
            { tag: "@remarks", content: [{ text: "Use this as the state owner." }] },
            { tag: "@deprecated", content: [{ text: "Use NewRoot instead." }] },
          ],
        },
        sources: [{ fileName: "packages/fixture/src/root.tsx", line: 10 }],
        extendedTypes: [{ type: "reference", name: "BaseRoot" }],
        implementedTypes: [{ type: "reference", name: "RootContract" }],
        inheritedFrom: { type: "reference", name: "BasePrimitive.Root" },
        signatures: [
          {
            id: 2,
            name: "Root",
            parameters: [
              {
                id: 3,
                name: "props",
                type: { type: "reference", name: "RootProps", target: 10 },
              },
            ],
            type: { type: "intrinsic", name: "Element" },
            typeParameter: [
              {
                id: 4,
                name: "T",
                type: { type: "intrinsic", name: "string" },
                default: { type: "intrinsic", name: "string" },
              },
            ],
            comment: { summary: [{ text: "Creates a root element." }] },
            sources: [{ fileName: "packages/fixture/src/root.tsx", line: 11 }],
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
            name: "children",
            kindString: "Property",
            kind: 1024,
            flags: { isOptional: true, isReadonly: true },
            type: { type: "reference", name: "Element" },
            comment: { summary: [{ text: "Nested content." }] },
            sources: [{ fileName: "packages/fixture/src/root.tsx", line: 4 }],
          },
          {
            id: 12,
            name: "label",
            kindString: "Property",
            kind: 1024,
            flags: { isOptional: true },
            type: { type: "intrinsic", name: "string" },
            defaultValue: '"Root"',
            comment: { summary: [{ text: "Accessible label." }] },
            sources: [{ fileName: "packages/fixture/src/root.tsx", line: 5 }],
          },
        ],
      },
      {
        id: 20,
        name: "OverlayState",
        kindString: "Variable",
        kind: 32,
        type: {
          type: "reference",
          name: "Context",
          typeArguments: [{ type: "reference", name: "OverlayValue" }],
        },
        comment: { summary: [{ text: "Context shared by overlay parts." }] },
        sources: [{ fileName: "packages/fixture/src/context.ts", line: 3 }],
      },
      {
        id: 30,
        name: "createOverlay",
        kindString: "Function",
        kind: 64,
        comment: { summary: [{ text: "Creates an overlay controller." }] },
        sources: [{ fileName: "packages/fixture/src/create.ts", line: 8 }],
        signatures: [
          {
            id: 31,
            name: "createOverlay",
            parameters: [
              {
                id: 32,
                name: "initialOpen",
                flags: { isOptional: true },
                type: { type: "intrinsic", name: "boolean" },
                defaultValue: "false",
                comment: { summary: [{ text: "Initial visibility." }] },
              },
            ],
            type: { type: "reference", name: "OverlayController" },
            comment: { summary: [{ text: "Returns the controller." }] },
            sources: [{ fileName: "packages/fixture/src/create.ts", line: 9 }],
          },
        ],
      },
    ],
  }
}

describe("generate-api-docs: v1 schema normalization", () => {
  const document = normalizeTypeDocProject(schemaCoverageProject(), "@solidiom/fixture", [
    "packages/fixture/src/index.ts",
  ])
  const entry = (name: string) => document.exports.find((candidate) => candidate.name === name)

  it("emits the versioned document envelope", () => {
    expect(document).toMatchObject({
      $schema: API_SCHEMA_URL,
      schemaVersion: API_SCHEMA_VERSION,
      packageName: "@solidiom/fixture",
      entryPoints: ["packages/fixture/src/index.ts"],
    })
  })

  it("normalizes component props, children, inheritance, comments, and source links", () => {
    expect(entry("Root")).toMatchObject({
      kind: "component",
      comment: {
        summary: "Renders the primitive root.",
        tags: [
          { name: "remarks", text: "Use this as the state owner." },
          { name: "deprecated", text: "Use NewRoot instead." },
        ],
      },
      source: {
        path: "packages/fixture/src/root.tsx",
        line: 10,
        url: "https://github.com/solidiom/solidiom/blob/main/packages/fixture/src/root.tsx#L10",
      },
      props: [
        {
          name: "label",
          type: "string",
          optional: true,
          readonly: false,
          default: '"Root"',
          comment: { summary: "Accessible label." },
        },
      ],
      children: {
        name: "children",
        type: "Element",
        optional: true,
        readonly: true,
      },
      inheritance: {
        extends: ["BaseRoot"],
        implements: ["RootContract"],
        inheritedFrom: "BasePrimitive.Root",
      },
      signatures: [
        {
          returns: "Element",
          typeParameters: [{ name: "T", constraint: "string", default: "string" }],
          comment: { summary: "Creates a root element." },
        },
      ],
    })
  })

  it("classifies Context values and ordinary functions independently", () => {
    expect(entry("OverlayState")).toMatchObject({
      kind: "context",
      type: "Context<OverlayValue>",
      comment: { summary: "Context shared by overlay parts." },
      source: { path: "packages/fixture/src/context.ts", line: 3 },
    })
    expect(entry("createOverlay")).toMatchObject({
      kind: "function",
      signatures: [
        {
          parameters: [
            {
              name: "initialOpen",
              type: "boolean",
              optional: true,
              default: "false",
              comment: { summary: "Initial visibility." },
            },
          ],
          returns: "OverlayController",
          comment: { summary: "Returns the controller." },
          source: { path: "packages/fixture/src/create.ts", line: 9 },
        },
      ],
    })
  })
})
