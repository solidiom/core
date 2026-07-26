// src/index.tsx
import { createContext, useContext } from "solid-js";
import {
  createControllableValue,
  createChangeDetails,
  applySemanticAttrs,
  createStableId
} from "@solidiom/runtime";
var SwitchContext = createContext();
function Root(props) {
  const id = createStableId("switch");
  const { value: checked, requestChange } = createControllableValue({
    value: props.checked,
    defaultValue: props.defaultChecked ?? false,
    onChange: (next) => props.onCheckedChange?.(next)
  });
  const handleClick = () => {
    if (props.disabled) return;
    requestChange(!checked(), createChangeDetails("toggle"));
  };
  return /* @__PURE__ */ React.createElement(SwitchContext, { value: { checked } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      id,
      role: "switch",
      "aria-checked": checked() ? "true" : "false",
      "aria-disabled": props.disabled ? "true" : void 0,
      onClick: handleClick,
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({
        scope: "switch",
        part: "root",
        state: checked() ? "on" : "off",
        disabled: props.disabled
      })
    },
    props.children
  ));
}
function Thumb(props) {
  const ctx = useContext(SwitchContext);
  const state = () => ctx?.checked() ? "on" : "off";
  return /* @__PURE__ */ React.createElement(
    "span",
    {
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({ scope: "switch", part: "thumb", state: state() })
    },
    props.children
  );
}
export {
  Root,
  Thumb
};
//# sourceMappingURL=index.js.map