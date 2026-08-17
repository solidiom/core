import { describe, it, expect, vi } from "vitest"
import { Root, Token, TokenRemove, Input } from "./index"
import type {
  TokenizerRootProps,
  TokenizerTokenProps,
  TokenizerTokenRemoveProps,
  TokenizerInputProps,
} from "./index"

describe("tokenizer", () => {
  describe("exports", () => {
    it("exports Root component", () => {
      expect(Root).toBeDefined()
      expect(typeof Root).toBe("function")
    })

    it("exports Token component", () => {
      expect(Token).toBeDefined()
      expect(typeof Token).toBe("function")
    })

    it("exports TokenRemove component", () => {
      expect(TokenRemove).toBeDefined()
      expect(typeof TokenRemove).toBe("function")
    })

    it("exports Input component", () => {
      expect(Input).toBeDefined()
      expect(typeof Input).toBe("function")
    })
  })

  describe("TokenizerRootProps interface", () => {
    it("supports controlled value", () => {
      const props: TokenizerRootProps = { value: ["one", "two"] }
      expect(props.value).toEqual(["one", "two"])
    })

    it("supports defaultValue for uncontrolled mode", () => {
      const props: TokenizerRootProps = { defaultValue: ["a", "b"] }
      expect(props.defaultValue).toEqual(["a", "b"])
    })

    it("supports onValueChange callback", () => {
      const fn = vi.fn()
      const props: TokenizerRootProps = { onValueChange: fn }
      props.onValueChange?.(["test"])
      expect(fn).toHaveBeenCalledWith(["test"])
    })

    it("supports onTokenAdd callback", () => {
      const fn = vi.fn()
      const props: TokenizerRootProps = { onTokenAdd: fn }
      props.onTokenAdd?.("new-token")
      expect(fn).toHaveBeenCalledWith("new-token")
    })

    it("supports onTokenRemove callback with token and index", () => {
      const fn = vi.fn()
      const props: TokenizerRootProps = { onTokenRemove: fn }
      props.onTokenRemove?.("removed", 2)
      expect(fn).toHaveBeenCalledWith("removed", 2)
    })

    it("supports max prop as number", () => {
      const props: TokenizerRootProps = { max: 5 }
      expect(props.max).toBe(5)
    })

    it("supports allowDuplicates boolean", () => {
      const props: TokenizerRootProps = { allowDuplicates: true }
      expect(props.allowDuplicates).toBe(true)
    })

    it("supports string delimiter", () => {
      const props: TokenizerRootProps = { delimiter: ";" }
      expect(props.delimiter).toBe(";")
    })

    it("supports array delimiter", () => {
      const props: TokenizerRootProps = { delimiter: [",", ";", "Enter"] }
      expect(props.delimiter).toEqual([",", ";", "Enter"])
    })

    it("supports disabled prop", () => {
      const props: TokenizerRootProps = { disabled: true }
      expect(props.disabled).toBe(true)
    })

    it("supports readOnly prop", () => {
      const props: TokenizerRootProps = { readOnly: true }
      expect(props.readOnly).toBe(true)
    })

    it("supports required prop", () => {
      const props: TokenizerRootProps = { required: true }
      expect(props.required).toBe(true)
    })

    it("supports invalid prop", () => {
      const props: TokenizerRootProps = { invalid: true }
      expect(props.invalid).toBe(true)
    })

    it("supports name for form participation", () => {
      const props: TokenizerRootProps = { name: "tags" }
      expect(props.name).toBe("tags")
    })

    it("supports id prop", () => {
      const props: TokenizerRootProps = { id: "my-tokenizer" }
      expect(props.id).toBe("my-tokenizer")
    })

    it("supports placeholder prop", () => {
      const props: TokenizerRootProps = { placeholder: "Add tags..." }
      expect(props.placeholder).toBe("Add tags...")
    })
  })

  describe("TokenizerTokenProps interface", () => {
    it("requires value and index", () => {
      const props: TokenizerTokenProps = { value: "hello", index: 0 }
      expect(props.value).toBe("hello")
      expect(props.index).toBe(0)
    })

    it("supports disabled prop", () => {
      const props: TokenizerTokenProps = { value: "test", index: 1, disabled: true }
      expect(props.disabled).toBe(true)
    })
  })

  describe("TokenizerTokenRemoveProps interface", () => {
    it("has optional class and style", () => {
      const props: TokenizerTokenRemoveProps = { class: "remove-btn" }
      expect(props.class).toBe("remove-btn")
    })
  })

  describe("TokenizerInputProps interface", () => {
    it("supports class prop", () => {
      const props: TokenizerInputProps = { class: "input-field" }
      expect(props.class).toBe("input-field")
    })

    it("supports ref callback", () => {
      const refFn = vi.fn()
      const props: TokenizerInputProps = { ref: refFn }
      expect(props.ref).toBe(refFn)
    })
  })
})
