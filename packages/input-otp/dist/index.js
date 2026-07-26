// src/index.tsx
import { createSignal, createContext, useContext } from "solid-js";
import { applySemanticAttrs, createStableId } from "@solidiom/runtime";
var InputOTPContext = createContext();
function useInputOTPContext() {
  const ctx = useContext(InputOTPContext);
  if (!ctx) {
    throw new Error("[solidiom] InputOTP.Group/Slot must be used within InputOTP.Root");
  }
  return ctx;
}
function Root(props) {
  let inputRef;
  const inputId = createStableId("otp-input");
  const [internalValue, setInternalValue] = createSignal(props.defaultValue ?? "");
  const [isFocused, setIsFocused] = createSignal(false);
  const value = () => {
    if (props.value !== void 0) {
      return props.value() ?? "";
    }
    return internalValue();
  };
  const activeIndex = () => {
    const len = value().length;
    return Math.min(len, props.maxLength - 1);
  };
  const patternRegex = props.pattern ? new RegExp(props.pattern) : void 0;
  const setValue = (next) => {
    const truncated = next.slice(0, props.maxLength);
    if (patternRegex) {
      const valid = truncated.split("").every((ch) => patternRegex.test(ch));
      if (!valid) return;
    }
    if (props.value === void 0) {
      setInternalValue(truncated);
    }
    props.onValueChange?.(truncated);
    if (truncated.length === props.maxLength) {
      props.onComplete?.(truncated);
    }
  };
  const handleInput = (e) => {
    const target = e.target;
    setValue(target.value);
  };
  const handleKeyDown = (e) => {
    if (props.disabled) {
      e.preventDefault();
      return;
    }
    if (e.key === "Backspace" || e.key === "Delete" || e.key === "ArrowLeft" || e.key === "ArrowRight") {
      return;
    }
  };
  const handlePaste = (e) => {
    e.preventDefault();
    if (props.disabled) return;
    const pasted = e.clipboardData?.getData("text/plain") ?? "";
    setValue(pasted);
  };
  const focus = () => {
    inputRef?.focus();
  };
  return /* @__PURE__ */ React.createElement(
    InputOTPContext,
    {
      value: {
        value,
        maxLength: props.maxLength,
        activeIndex,
        isFocused,
        pattern: patternRegex,
        disabled: props.disabled,
        focus
      }
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        class: props.class,
        style: props.style,
        onClick: focus,
        ...applySemanticAttrs({
          scope: "input-otp",
          part: "root",
          disabled: props.disabled
        })
      },
      /* @__PURE__ */ React.createElement(
        "input",
        {
          ref: inputRef,
          id: inputId,
          type: "text",
          inputmode: "numeric",
          autocomplete: "one-time-code",
          maxlength: props.maxLength,
          value: value(),
          disabled: props.disabled,
          onInput: handleInput,
          onKeyDown: handleKeyDown,
          onPaste: handlePaste,
          onFocus: () => setIsFocused(true),
          onBlur: () => setIsFocused(false),
          "aria-label": "One-time password",
          style: {
            position: "absolute",
            width: "1px",
            height: "1px",
            padding: "0",
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            "white-space": "nowrap",
            "border-width": "0"
          }
        }
      ),
      props.children
    )
  );
}
function Group(props) {
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      class: props.class,
      style: props.style,
      role: "group",
      ...applySemanticAttrs({
        scope: "input-otp",
        part: "group"
      })
    },
    props.children
  );
}
function Slot(props) {
  const ctx = useInputOTPContext();
  const char = () => ctx.value()[props.index] ?? "";
  const isActive = () => ctx.isFocused() && ctx.activeIndex() === props.index;
  const isFilled = () => char() !== "";
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({
        scope: "input-otp",
        part: "slot",
        state: isActive() ? "active" : "inactive"
      }),
      ...isFilled() ? { "data-filled": "" } : {}
    },
    char()
  );
}
export {
  Group,
  Root,
  Slot
};
//# sourceMappingURL=index.js.map