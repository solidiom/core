// src/index.tsx
import { applySemanticAttrs } from "@solidiom/runtime";
function Root(props) {
  const orientation = () => props.orientation ?? "horizontal";
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "toolbar",
      "aria-orientation": orientation(),
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({ scope: "toolbar", part: "root", orientation: orientation() })
    },
    props.children
  );
}
function Button(props) {
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      disabled: props.disabled,
      onClick: props.onClick,
      class: props.class,
      ...applySemanticAttrs({ scope: "toolbar", part: "button", disabled: props.disabled })
    },
    props.children
  );
}
function Separator(props) {
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "separator",
      "aria-orientation": "vertical",
      class: props.class,
      ...applySemanticAttrs({ scope: "toolbar", part: "separator" })
    }
  );
}
function ToggleGroup(props) {
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "group",
      class: props.class,
      ...applySemanticAttrs({ scope: "toolbar", part: "toggle-group" })
    },
    props.children
  );
}
function ToggleItem(props) {
  const handleClick = () => {
    if (props.disabled) return;
    props.onPressedChange?.(!props.pressed);
  };
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      "aria-pressed": props.pressed ? "true" : "false",
      disabled: props.disabled,
      onClick: handleClick,
      class: props.class,
      ...applySemanticAttrs({
        scope: "toolbar",
        part: "toggle-item",
        state: props.pressed ? "on" : "off",
        disabled: props.disabled
      })
    },
    props.children
  );
}
export {
  Button,
  Root,
  Separator,
  ToggleGroup,
  ToggleItem
};
//# sourceMappingURL=index.js.map