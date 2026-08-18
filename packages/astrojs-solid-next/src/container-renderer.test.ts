import { describe, it, expect } from "vitest"
import { getContainerRenderer } from "./container-renderer"

describe("container-renderer", () => {
  it("returns a renderer with name @solidiom/astrojs-solid-next", () => {
    const renderer = getContainerRenderer()
    expect(renderer.name).toBe("@solidiom/astrojs-solid-next")
  })

  it("sets clientEntrypoint to the client.js subpath export", () => {
    const renderer = getContainerRenderer()
    expect(renderer.clientEntrypoint).toBe("@solidiom/astrojs-solid-next/client.js")
  })

  it("sets serverEntrypoint to the server.js subpath export", () => {
    const renderer = getContainerRenderer()
    expect(renderer.serverEntrypoint).toBe("@solidiom/astrojs-solid-next/server.js")
  })

  it("returns a stable structure on repeated calls", () => {
    const a = getContainerRenderer()
    const b = getContainerRenderer()
    expect(a).toEqual(b)
  })
})
