import { fireEvent, render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import * as Textarea from "./index"

describe("Textarea.Root autoResize in a browser", () => {
  it("applies measured height and maxRows overflow", async () => {
    const { getByRole } = render(() => (
      <Textarea.Root
        autoResize
        maxRows={3}
        rows={1}
        style={{ width: "220px", "line-height": "20px" }}
      />
    ))
    const textarea = getByRole("textbox") as HTMLTextAreaElement

    textarea.value = "one\ntwo\nthree\nfour\nfive"
    fireEvent.input(textarea)
    await new Promise<void>((resolve) => setTimeout(resolve, 0))

    expect(parseFloat(textarea.style.height)).toBeGreaterThan(0)
    expect(textarea.style.overflowY).toBe("auto")
  })
})
