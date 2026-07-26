import { describe, it, expect } from "vitest"
import { runSimpleBench, createThroughputHarness } from "./throughput-harness"

describe("throughput-harness", () => {
  it("runSimpleBench returns a valid result", () => {
    let count = 0
    const result = runSimpleBench(
      {
        name: "increment",
        fn: () => {
          count++
        },
      },
      createThroughputHarness({ minTime: 50 }),
    )
    expect(result.name).toBe("increment")
    expect(result.opsPerSecond).toBeGreaterThan(0)
    expect(result.avgNs).toBeGreaterThan(0)
    expect(result.samples).toBeGreaterThan(0)
    expect(result.timestamp).toBeTruthy()
    expect(count).toBeGreaterThan(10)
  })

  it("produces deterministic structure", () => {
    const result = runSimpleBench(
      { name: "noop", fn: () => {} },
      createThroughputHarness({ minTime: 20 }),
    )
    expect(result).toHaveProperty("name")
    expect(result).toHaveProperty("opsPerSecond")
    expect(result).toHaveProperty("avgNs")
    expect(result).toHaveProperty("samples")
    expect(result).toHaveProperty("timestamp")
  })
})
