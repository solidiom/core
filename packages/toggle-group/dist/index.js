// src/index.tsx
import { createContext, useContext } from "solid-js";
import { createControllableValue, createChangeDetails, applySemanticAttrs } from "@solidiom/runtime";
var ToggleGroupContext = createContext();
function useToggleGroup() {
  const ctx = useContext(ToggleGroupContext);
  if (!ctx) throw new Error("[solidiom] ToggleGroup.Item must be used within <ToggleGroup.Root>");
  return ctx;
}
function Root(props) {
  const type = () => props.type ?? "single";
  const orientation = () => props.orientation ?? "horizontal";
  const { value, requestChange } = createControllableValue({
    value: props.value,
    defaultValue: props.defaultValue ?? [],
    onChange: (next) => props.onValueChange?.(next),
    equals: (a, b) => a.length === b.length && a.every((v, i) => v === b[i])
  });
  const toggle = (itemValue) => {
    if (props.disabled) return;
    const current = value();
    let next;
    if (type() === "single") {
      next = current.includes(itemValue) ? [] : [itemValue];
    } else {
      next = current.includes(itemValue) ? current.filter((v) => v !== itemValue) : [...current, itemValue];
    }
    requestChange(next, createChangeDetails("toggle"));
  };
  return /* @__PURE__ */ React.createElement(
    ToggleGroupContext,
    {
      value: {
        value,
        toggle,
        type: type(),
        disabled: props.disabled,
        orientation: orientation()
      }
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        role: "group",
        "aria-disabled": props.disabled ? "true" : void 0,
        class: props.class,
        style: props.style,
        ...applySemanticAttrs({
          scope: "toggle-group",
          part: "root",
          orientation: orientation(),
          disabled: props.disabled
        })
      },
      props.children
    )
  );
}
function Item(props) {
  const ctx = useToggleGroup();
  const isPressed = () => ctx.value().includes(props.value);
  const isDisabled = () => props.disabled || ctx.disabled;
  const handleClick = () => {
    if (isDisabled()) return;
    ctx.toggle(props.value);
  };
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      "aria-pressed": isPressed() ? "true" : "false",
      "aria-disabled": isDisabled() ? "true" : void 0,
      onClick: handleClick,
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({
        scope: "toggle-group",
        part: "item",
        state: isPressed() ? "on" : "off",
        disabled: isDisabled()
      })
    },
    props.children
  );
}
export {
  Item,
  Root
};
//# sourceMappingURL=index.js.map