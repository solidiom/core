/**
 * Browser-mode component tests for Avatar primitive.
 *
 * Verifies semantic data attributes, fallback rendering,
 * class forwarding, and console cleanliness.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { render } from "@solidjs/web"
import { createConsoleGuard, type ConsoleGuard } from "@solidiom/runtime/testing/console-guard"
import * as Avatar from "./index"

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

describe("Avatar.Root", () => {
  it("renders root with semantic data attributes", () => {
    const container = getContainer()
    render(
      () => (
        <Avatar.Root>
          <Avatar.Fallback>AB</Avatar.Fallback>
        </Avatar.Root>
      ),
      container,
    )

    const root = container.querySelector("[data-scope='avatar']")
    expect(root).not.toBeNull()
    expect(root!.getAttribute("data-scope")).toBe("avatar")
    expect(root!.getAttribute("data-part")).toBe("root")
  })

  it("forwards class prop on root", () => {
    const container = getContainer()
    render(
      () => (
        <Avatar.Root class="my-avatar">
          <Avatar.Fallback>AB</Avatar.Fallback>
        </Avatar.Root>
      ),
      container,
    )

    const root = container.querySelector("[data-scope='avatar']") as HTMLElement
    expect(root.className).toBe("my-avatar")
  })
})

describe("Avatar.Fallback", () => {
  it("renders fallback when no image provided", () => {
    const container = getContainer()
    render(
      () => (
        <Avatar.Root>
          <Avatar.Fallback>AB</Avatar.Fallback>
        </Avatar.Root>
      ),
      container,
    )

    const fallback = container.querySelector("[data-part='fallback']")
    expect(fallback).not.toBeNull()
    expect(fallback!.getAttribute("data-scope")).toBe("avatar")
  })

  it("renders fallback content (initials)", () => {
    const container = getContainer()
    render(
      () => (
        <Avatar.Root>
          <Avatar.Fallback>VP</Avatar.Fallback>
        </Avatar.Root>
      ),
      container,
    )

    const fallback = container.querySelector("[data-part='fallback']")
    expect(fallback).not.toBeNull()
    expect(fallback!.textContent).toBe("VP")
  })
})

describe("Avatar — console cleanliness", () => {
  it("produces no console errors", () => {
    const container = getContainer()
    render(
      () => (
        <Avatar.Root>
          <Avatar.Fallback>AB</Avatar.Fallback>
        </Avatar.Root>
      ),
      container,
    )
    guard.assertClean()
  })
})
