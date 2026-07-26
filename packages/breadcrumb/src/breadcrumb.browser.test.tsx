/**
 * Browser-mode component tests for Breadcrumb primitive.
 *
 * Verifies semantic attributes, ARIA states, and DOM structure.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { render } from "@solidjs/web"
import { createConsoleGuard, type ConsoleGuard } from "@solidiom/runtime/testing/console-guard"
import * as Breadcrumb from "./index"

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

describe("Breadcrumb", () => {
  it("renders nav with aria-label=Breadcrumb", () => {
    const container = getContainer()
    render(
      () => (
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      ),
      container,
    )

    const nav = container.querySelector("nav")
    expect(nav).not.toBeNull()
    expect(nav!.getAttribute("aria-label")).toBe("Breadcrumb")
  })

  it("applies semantic data attributes on all parts", () => {
    const container = getContainer()
    render(
      () => (
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.Ellipsis />
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      ),
      container,
    )

    const nav = container.querySelector("[data-scope='breadcrumb'][data-part='root']")
    const list = container.querySelector("[data-scope='breadcrumb'][data-part='list']")
    const item = container.querySelector("[data-scope='breadcrumb'][data-part='item']")
    const link = container.querySelector("[data-scope='breadcrumb'][data-part='link']")
    const separator = container.querySelector("[data-scope='breadcrumb'][data-part='separator']")
    const ellipsis = container.querySelector("[data-scope='breadcrumb'][data-part='ellipsis']")

    expect(nav).not.toBeNull()
    expect(list).not.toBeNull()
    expect(item).not.toBeNull()
    expect(link).not.toBeNull()
    expect(separator).not.toBeNull()
    expect(ellipsis).not.toBeNull()
  })

  it("sets aria-current=page on current link", () => {
    const container = getContainer()
    render(
      () => (
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/" current>
                Home
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      ),
      container,
    )

    const link = container.querySelector("a")!
    expect(link.getAttribute("aria-current")).toBe("page")
  })

  it("renders separator between items", () => {
    const container = getContainer()
    render(
      () => (
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/about">About</Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      ),
      container,
    )

    const separator = container.querySelector("[data-part='separator']")!
    expect(separator).not.toBeNull()
    expect(separator.getAttribute("aria-hidden")).toBe("true")
    expect(separator.textContent).toBe("/")
  })

  it("forwards class prop", () => {
    const container = getContainer()
    render(
      () => (
        <Breadcrumb.Root class="my-nav">
          <Breadcrumb.List class="my-list">
            <Breadcrumb.Item class="my-item">
              <Breadcrumb.Link href="/" class="my-link">
                Home
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      ),
      container,
    )

    expect(container.querySelector("nav")!.className).toBe("my-nav")
    expect(container.querySelector("ol")!.className).toBe("my-list")
    expect(container.querySelector("li")!.className).toBe("my-item")
    expect(container.querySelector("a")!.className).toBe("my-link")
  })

  it("produces no console errors on render", () => {
    const container = getContainer()
    render(
      () => (
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      ),
      container,
    )
    guard.assertClean()
  })
})
