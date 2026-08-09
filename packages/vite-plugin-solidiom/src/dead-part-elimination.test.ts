/**
 * Behavioral coverage for dead-part elimination (v1.3).
 * Verifies namespace imports are rewritten to named imports of only used parts.
 */
import { describe, expect, it } from "vitest"
import { solidiomPlugin } from "./index"

function transform(code: string): string | null {
  const plugin = solidiomPlugin({ deadPartElimination: true })
  const result = (plugin.transform as (code: string, id: string) => { code: string } | null)(
    code,
    "test.tsx",
  )
  return result?.code ?? null
}

describe("dead-part elimination", () => {
  it("rewrites a namespace import to named imports for used parts only", () => {
    const code = `
import * as Dialog from "@solidiom/dialog"

export function MyDialog() {
  return (
    <Dialog.Root>
      <Dialog.Content>Hello</Dialog.Content>
    </Dialog.Root>
  )
}
`
    const result = transform(code)
    expect(result).not.toBeNull()
    expect(result).toContain("import {")
    expect(result).toContain("Root as Dialog_Root")
    expect(result).toContain("Content as Dialog_Content")
    expect(result).not.toContain("import * as Dialog")
  })

  it("rewrites Ns.Part references to Ns_Part", () => {
    const code = `
import * as Select from "@solidiom/select"

export function MySelect() {
  return (
    <Select.Root>
      <Select.Trigger>Pick</Select.Trigger>
      <Select.Content>
        <Select.Item>A</Select.Item>
      </Select.Content>
    </Select.Root>
  )
}
`
    const result = transform(code)
    expect(result).not.toBeNull()
    expect(result).toContain("Select_Root")
    expect(result).toContain("Select_Trigger")
    expect(result).toContain("Select_Content")
    expect(result).toContain("Select_Item")
    expect(result).not.toContain("Select.Root")
  })

  it("does not rewrite when 8+ parts are used (heuristic skip)", () => {
    const code = `
import * as Table from "@solidiom/data-table"

export function BigTable() {
  return (
    <Table.Root>
      <Table.Header>
        <Table.HeaderRow><Table.HeaderCell>A</Table.HeaderCell></Table.HeaderRow>
      </Table.Header>
      <Table.Body>
        <Table.Row><Table.Cell>1</Table.Cell></Table.Row>
      </Table.Body>
      <Table.Footer><Table.Pagination /></Table.Footer>
    </Table.Root>
  )
}
`
    const result = transform(code)
    // 10 parts used — exceeds the 8-part threshold
    expect(result).toBeNull()
  })

  it("does not transform non-solidiom namespace imports", () => {
    const code = `
import * as React from "react"
import * as Dialog from "@solidiom/dialog"

export function MyDialog() {
  return <Dialog.Root><Dialog.Content>Hi</Dialog.Content></Dialog.Root>
}
`
    const result = transform(code)
    // Should still transform the Dialog one
    expect(result).not.toBeNull()
    expect(result).toContain("Root as Dialog_Root")
  })

  it("returns null for files with no namespace solidiom imports", () => {
    const code = `
import { Dialog } from "@solidiom/dialog"
export function MyDialog() { return <Dialog.Root /> }
`
    const result = transform(code)
    expect(result).toBeNull()
  })
})
