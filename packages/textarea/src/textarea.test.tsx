// @vitest-environment jsdom

import { cleanup, fireEvent, render } from "@solidjs/testing-library"
import * as Field from "@solidiom/field"
import { createSignal } from "solid-js"
import type { JSX } from "@solidjs/web"
import { afterEach, describe, expect, it, vi } from "vitest"
import * as Textarea from "./index"

afterEach(cleanup)

const settle = async () => {
  await new Promise<void>((resolve) => queueMicrotask(resolve))
}

describe("Textarea.Root", () => {
  it("renders exactly one native textarea with authoritative semantic attrs", () => {
    const ref = vi.fn()
    const { container } = render(() => (
      <Textarea.Root
        ref={ref}
        class="custom"
        data-scope="consumer-scope"
        data-part="consumer-part"
        aria-label="Message"
      />
    ))

    expect(container.querySelectorAll("textarea")).toHaveLength(1)
    const textarea = container.querySelector("textarea")!
    expect(textarea.dataset.scope).toBe("textarea")
    expect(textarea.dataset.part).toBe("root")
    expect(textarea.className).toBe("custom")
    expect(textarea.getAttribute("aria-label")).toBe("Message")
    expect(ref).toHaveBeenCalledWith(textarea)
  })

  it("supports uncontrolled values without reacting to defaultValue changes", async () => {
    const [defaultValue, setDefaultValue] = createSignal("initial")
    const onValueChange = vi.fn()
    const { getByRole } = render(() => (
      <Textarea.Root defaultValue={defaultValue()} onValueChange={onValueChange} />
    ))
    const textarea = getByRole("textbox") as HTMLTextAreaElement

    expect(textarea.value).toBe("initial")
    setDefaultValue("later")
    await settle()
    expect(textarea.value).toBe("initial")
    fireEvent.input(textarea, { target: { value: "updated" } })
    expect(textarea.value).toBe("updated")
    expect(onValueChange).toHaveBeenCalledWith("updated")
  })

  it("reconciles controlled external, rejected, and normalized values after settlement", async () => {
    const [value, setValue] = createSignal("initial")
    const onValueChange = vi.fn((next: string) => {
      if (next !== "reject") setValue(next.trim().toUpperCase())
    })
    const { getByRole } = render(() => (
      <Textarea.Root value={value()} onValueChange={onValueChange} />
    ))
    const textarea = getByRole("textbox") as HTMLTextAreaElement

    fireEvent.input(textarea, { target: { value: "reject" } })
    await settle()
    expect(textarea.value).toBe("initial")

    fireEvent.input(textarea, { target: { value: " normalized " } })
    await settle()
    expect(textarea.value).toBe("NORMALIZED")

    setValue("external")
    await settle()
    expect(textarea.value).toBe("external")
  })

  it("does not promote incoming ARIA state to native behavior", () => {
    const { getByRole } = render(() => (
      <Textarea.Root
        aria-disabled="true"
        aria-required="true"
        aria-readonly="true"
        aria-invalid="true"
        aria-label="Message"
      />
    ))
    const textarea = getByRole("textbox") as HTMLTextAreaElement

    expect(textarea.disabled).toBe(false)
    expect(textarea.required).toBe(false)
    expect(textarea.readOnly).toBe(false)
    expect(textarea.getAttribute("aria-disabled")).toBe("true")
    expect(textarea.getAttribute("aria-required")).toBe("true")
    expect(textarea.getAttribute("aria-readonly")).toBe("true")
    expect(textarea.getAttribute("aria-invalid")).toBe("true")
    expect(textarea.hasAttribute("data-disabled")).toBe(true)
    expect(textarea.hasAttribute("data-required")).toBe(true)
    expect(textarea.hasAttribute("data-readonly")).toBe(true)
    expect(textarea.hasAttribute("data-invalid")).toBe(true)
  })

  it("lets explicit false control native state, ARIA, and semantic state", () => {
    const { getByRole } = render(() => (
      <Textarea.Root
        disabled={false}
        required={false}
        readOnly={false}
        invalid={false}
        aria-disabled="true"
        aria-required="true"
        aria-readonly="true"
        aria-invalid="true"
      />
    ))
    const textarea = getByRole("textbox") as HTMLTextAreaElement

    expect(textarea.disabled).toBe(false)
    expect(textarea.required).toBe(false)
    expect(textarea.readOnly).toBe(false)
    expect(textarea.getAttribute("aria-disabled")).toBe("false")
    expect(textarea.getAttribute("aria-required")).toBe("false")
    expect(textarea.getAttribute("aria-readonly")).toBe("false")
    expect(textarea.getAttribute("aria-invalid")).toBe("false")
    expect(textarea.hasAttribute("data-disabled")).toBe(false)
    expect(textarea.hasAttribute("data-required")).toBe(false)
    expect(textarea.hasAttribute("data-readonly")).toBe(false)
    expect(textarea.hasAttribute("data-invalid")).toBe(false)
  })

  it("keeps Field.Control relationships reactive", async () => {
    const [invalid, setInvalid] = createSignal(false)
    const [required, setRequired] = createSignal(false)
    const { getByRole } = render(() => (
      <Field.Root id="bio" invalid={invalid()} required={required()}>
        <Field.Label>Biography</Field.Label>
        <Field.Control>{(controlProps) => <Textarea.Root {...controlProps()} />}</Field.Control>
        <Field.Description>Helpful text</Field.Description>
        <Field.Error>Biography is invalid</Field.Error>
      </Field.Root>
    ))
    const textarea = getByRole("textbox") as HTMLTextAreaElement

    expect(textarea.id).toBe("bio")
    expect(textarea.getAttribute("aria-labelledby")).toBe("bio-label")
    expect(textarea.getAttribute("aria-describedby")).toBe("bio-description")

    setRequired(true)
    setInvalid(true)
    await settle()
    expect(textarea.getAttribute("aria-required")).toBe("true")
    expect(textarea.getAttribute("aria-invalid")).toBe("true")
    expect(textarea.getAttribute("aria-describedby")).toBe("bio-error")
    expect(textarea.hasAttribute("data-invalid")).toBe(true)

    setInvalid(false)
    await settle()
    expect(textarea.getAttribute("aria-describedby")).toBe("bio-description")
    expect(textarea.getAttribute("aria-invalid")).toBeNull()
  })

  it("keeps autoResize safe when jsdom has no layout measurements", () => {
    const { getByRole } = render(() => <Textarea.Root autoResize maxRows={3} />)
    const textarea = getByRole("textbox") as HTMLTextAreaElement

    Object.defineProperty(textarea, "scrollHeight", { configurable: true, value: 0 })
    expect(() => fireEvent.input(textarea, { target: { value: "text" } })).not.toThrow()
  })

  it("restores the latest consumer height and overflow after autoResize is disabled", async () => {
    const [autoResize, setAutoResize] = createSignal(true)
    const [style, setStyle] = createSignal<JSX.CSSProperties>({ height: "20px" })
    const { getByRole } = render(() => <Textarea.Root autoResize={autoResize()} style={style()} />)
    const textarea = getByRole("textbox") as HTMLTextAreaElement

    Object.defineProperty(textarea, "scrollHeight", { configurable: true, value: 100 })
    fireEvent.input(textarea, { target: { value: "content" } })
    await settle()
    setStyle({ height: "32px", "overflow-y": "scroll" })
    await settle()
    setAutoResize(false)
    await settle()

    expect(textarea.style.height).toBe("32px")
    expect(textarea.style.overflowY).toBe("scroll")
  })

  it("does not emit console warnings while rendering", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined)
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined)
    try {
      render(() => <Textarea.Root aria-label="Message" />)
      expect(error).not.toHaveBeenCalled()
      expect(warn).not.toHaveBeenCalled()
    } finally {
      error.mockRestore()
      warn.mockRestore()
    }
  })
})
