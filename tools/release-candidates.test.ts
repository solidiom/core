import { describe, expect, it, vi } from "vitest"
import {
  ReleaseCandidateError,
  findUnpublishedPackages,
  requireUnpublishedPackages,
} from "./release-candidates.mjs"

const packages = [
  { name: "@solidiom/button", version: "0.4.2" },
  { name: "@solidiom/runtime", version: "0.4.2" },
]

describe("release candidates", () => {
  it("returns only package versions missing from npm", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 200 }))
      .mockResolvedValueOnce(new Response(null, { status: 404 }))

    await expect(findUnpublishedPackages({ packages, fetchImpl, concurrency: 1 })).resolves.toEqual(
      [{ name: "@solidiom/runtime", version: "0.4.2" }],
    )

    expect(fetchImpl).toHaveBeenNthCalledWith(
      1,
      "https://registry.npmjs.org/%40solidiom%2Fbutton/0.4.2",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
  })

  it("fails closed when every committed package version already exists", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(null, { status: 200 }))

    await expect(requireUnpublishedPackages({ packages, fetchImpl })).rejects.toMatchObject<
      Partial<ReleaseCandidateError>
    >({ category: "publication" })
    await expect(requireUnpublishedPackages({ packages, fetchImpl })).rejects.toThrow(
      /Version PR workflow/,
    )
  })

  it("fails closed on registry errors instead of treating them as unpublished", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(null, { status: 503 }))

    await expect(findUnpublishedPackages({ packages, fetchImpl })).rejects.toMatchObject<
      Partial<ReleaseCandidateError>
    >({ category: "infrastructure" })
  })
})
