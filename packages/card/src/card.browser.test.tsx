/**
 * Browser-mode component tests for Card primitive.
 *
 * Verifies semantic attributes and part rendering.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { render } from "@solidjs/web"
import { createConsoleGuard, type ConsoleGuard } from "@solidiom/runtime/testing/console-guard"
import * as Card from "./index"

// ─── Setup ─────────────────────────────────────────────────────────────────────

let guard: ConsoleGuard

beforeEach(() => {
  guard = createConsoleGuard()
})

afterEach(() => {
  guard.restore()
  const container = document.getElementById("test-root")
  if (container) container.innerHTML = ""
})

function getContainer(): HTMLElement {
  let container = document.getElementById("test-root")
  if (!container) {
    container = document.createElement("div")
    container.id = "test-root"
    document.body.appendChild(container)
  }
  container.innerHTML = ""
  return container
}

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe("Card.Root", () => {
  it("renders root with semantic attrs", () => {
    const container = getContainer()
    render(() => <Card.Root>Content</Card.Root>, container)

    const root = container.querySelector("[data-scope='card'][data-part='root']")
    expect(root).not.toBeNull()
  })

  it("renders all parts", () => {
    const container = getContainer()
    render(
      () => (
        <Card.Root>
          <Card.Header>
            <Card.Title>Title</Card.Title>
            <Card.Description>Desc</Card.Description>
          </Card.Header>
          <Card.Content>Body</Card.Content>
          <Card.Footer>Footer</Card.Footer>
        </Card.Root>
      ),
      container,
    )

    expect(container.querySelector("[data-scope='card'][data-part='header']")).not.toBeNull()
    expect(container.querySelector("[data-scope='card'][data-part='title']")).not.toBeNull()
    expect(container.querySelector("[data-scope='card'][data-part='description']")).not.toBeNull()
    expect(container.querySelector("[data-scope='card'][data-part='content']")).not.toBeNull()
    expect(container.querySelector("[data-scope='card'][data-part='footer']")).not.toBeNull()
  })

  it("forwards class prop on root", () => {
    const container = getContainer()
    render(() => <Card.Root class="my-card">Content</Card.Root>, container)

    const root = container.querySelector("[data-scope='card'][data-part='root']") as HTMLElement
    expect(root.className).toBe("my-card")
  })

  it("produces no console errors on render", () => {
    const container = getContainer()
    render(
      () => (
        <Card.Root>
          <Card.Header>
            <Card.Title>Title</Card.Title>
            <Card.Description>Desc</Card.Description>
          </Card.Header>
          <Card.Content>Body</Card.Content>
          <Card.Footer>Footer</Card.Footer>
        </Card.Root>
      ),
      container,
    )
    guard.assertClean()
  })
})
