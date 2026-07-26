/**
 * Browser-mode component tests for Skeleton primitive.
 *
 * Verifies semantic attributes, aria-hidden, and prop forwarding.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { render } from "@solidjs/web"
import { createConsoleGuard, type ConsoleGuard } from "@solidiom/runtime/testing/console-guard"
import * as Skeleton from "./index"

let guard: ConsoleGuard

beforeEach(() => {
  guard = createConsoleGuard()
})
afterEach(() => {
  guard.restore()
  const c = document.getElementById("test-root")
  if (c) c.innerHTML = ""
})

function getContainer(): HTMLElement {
  let c = document.getElementById("test-root")
  if (!c) {
    c = document.createElement("div")
    c.id = "test-root"
    document.body.appendChild(c)
  }
  c.innerHTML = ""
  return c
}

describe("Skeleton.Root", () => {
  it("renders a div with aria-hidden=true", () => {
    const container = getContainer()
    render(() => <Skeleton.Root />, container)

    const el = container.querySelector("div[aria-hidden='true']")
    expect(el).not.toBeNull()
  })

  it("applies semantic data attributes", () => {
    const container = getContainer()
    render(() => <Skeleton.Root />, container)

    const el = container.querySelector("[data-scope='skeleton'][data-part='root']")
    expect(el).not.toBeNull()
  })

  it("forwards class prop", () => {
    const container = getContainer()
    render(() => <Skeleton.Root class="my-skeleton" />, container)

    const el = container.querySelector("[data-scope='skeleton']") as HTMLElement
    expect(el.className).toContain("my-skeleton")
  })

  it("accepts width and height", () => {
    const container = getContainer()
    render(() => <Skeleton.Root width={200} height="1.5rem" />, container)

    const el = container.querySelector("[data-scope='skeleton']") as HTMLElement
    expect(el.style.width).toBe("200px")
    expect(el.style.height).toBe("1.5rem")
  })

  it("produces no console errors", () => {
    const container = getContainer()
    render(() => <Skeleton.Root />, container)
    guard.assertClean()
  })
})
