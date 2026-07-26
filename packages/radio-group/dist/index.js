// src/index.tsx
import { createContext, useContext } from "solid-js";
import {
  createControllableValue,
  createChangeDetails,
  applySemanticAttrs,
  createStableId
} from "@solidiom/runtime";
var RadioGroupContext = createContext();
function useRadioGroup() {
  const ctx = useContext(RadioGroupContext);
  if (!ctx) throw new Error("[solidiom] RadioGroup.Item must be used within <RadioGroup.Root>");
  return ctx;
}
function Root(props) {
  const { value, requestChange } = createControllableValue({
    value: props.value,
    defaultValue: props.defaultValue ?? "",
    onChange: (next) => props.onValueChange?.(next)
  });
  const orientation = () => props.orientation ?? "vertical";
  const handleKeyDown = (e) => {
    const target = e.currentTarget;
    const items = Array.from(
      target.querySelectorAll("[data-scope='radio-group'][data-part='item']")
    ).filter((el) => !el.hasAttribute("data-disabled"));
    if (items.length === 0) return;
    const currentIndex = items.findIndex((el) => el === document.activeElement);
    let nextIndex = -1;
    const isVertical = orientation() === "vertical";
    const prevKey = isVertical ? "ArrowUp" : "ArrowLeft";
    const nextKey = isVertical ? "ArrowDown" : "ArrowRight";
    switch (e.key) {
      case nextKey:
        e.preventDefault();
        nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        break;
      case prevKey:
        e.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        break;
      case "Home":
        e.preventDefault();
        nextIndex = 0;
        break;
      case "End":
        e.preventDefault();
        nextIndex = items.length - 1;
        break;
      default:
        return;
    }
    if (nextIndex >= 0) {
      const nextItem = items[nextIndex];
      nextItem.focus();
      const itemValue = nextItem.getAttribute("data-value");
      if (itemValue) {
        requestChange(itemValue, createChangeDetails("select"));
      }
    }
  };
  return /* @__PURE__ */ React.createElement(
    RadioGroupContext,
    {
      value: {
        value,
        setValue: (v) => requestChange(v, createChangeDetails("select")),
        name: props.name,
        disabled: props.disabled,
        required: props.required,
        orientation: orientation()
      }
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        role: "radiogroup",
        "aria-required": props.required ? "true" : void 0,
        "aria-disabled": props.disabled ? "true" : void 0,
        "aria-orientation": orientation(),
        onKeyDown: handleKeyDown,
        class: props.class,
        style: props.style,
        ...applySemanticAttrs({
          scope: "radio-group",
          part: "root",
          orientation: orientation(),
          disabled: props.disabled,
          required: props.required
        })
      },
      props.children
    )
  );
}
function Item(props) {
  const ctx = useRadioGroup();
  const id = createStableId("radio");
  const isChecked = () => ctx.value() === props.value;
  const isDisabled = () => props.disabled || ctx.disabled;
  const isSelected = () => ctx.value() === props.value;
  const handleClick = () => {
    if (isDisabled()) return;
    ctx.setValue(props.value);
  };
  const tabIndex = () => {
    if (isDisabled()) return -1;
    if (isSelected()) return 0;
    if (!ctx.value()) return 0;
    return -1;
  };
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      id,
      type: "button",
      role: "radio",
      "aria-checked": isChecked() ? "true" : "false",
      "aria-disabled": isDisabled() ? "true" : void 0,
      tabindex: tabIndex(),
      onClick: handleClick,
      "data-value": props.value,
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({
        scope: "radio-group",
        part: "item",
        state: isChecked() ? "checked" : "unchecked",
        disabled: isDisabled(),
        selected: isChecked()
      })
    },
    props.children
  );
}
function Indicator(props) {
  return /* @__PURE__ */ React.createElement(
    "span",
    {
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({ scope: "radio-group", part: "indicator" })
    },
    props.children
  );
}
export {
  Indicator,
  Item,
  Root
};
//# sourceMappingURL=index.js.map