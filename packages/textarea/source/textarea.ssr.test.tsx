// @vitest-environment node

import { renderToString } from "@solidjs/web"
import { describe, expect, it } from "vitest"
import * as Textarea from "./index"

describe("Textarea.Root SSR", () => {
  it("renders controlled and default text", () => {
    const controlled = renderToString(() => <Textarea.Root value="controlled" />)
    const uncontrolled = renderToString(() => <Textarea.Root defaultValue="default" />)

    expect(controlled).toContain("controlled")
    expect(uncontrolled).toContain("default")
  })
})
