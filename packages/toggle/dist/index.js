// src/index.tsx
import { createControllableValue, createChangeDetails, applySemanticAttrs } from "@solidiom/runtime";
function Root(props) {
  const { value, requestChange } = createControllableValue({
    value: props.pressed,
    defaultValue: props.defaultPressed ?? false,
    onChange: (next) => props.onPressedChange?.(next)
  });
  const handleClick = () => {
    if (props.disabled) return;
    requestChange(!value(), createChangeDetails("press"));
  };
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      "aria-pressed": value() ? "true" : "false",
      "aria-disabled": props.disabled ? "true" : void 0,
      onClick: handleClick,
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({
        scope: "toggle",
        part: "root",
        state: value() ? "on" : "off",
        disabled: props.disabled
      })
    },
    props.children
  );
}
export {
  Root
};
//# sourceMappingURL=index.js.map