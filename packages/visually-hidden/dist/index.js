// src/index.tsx
import { applySemanticAttrs } from "@solidiom/runtime";
var visuallyHiddenStyles = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  "white-space": "nowrap",
  "border-width": "0"
};
function Root(props) {
  return /* @__PURE__ */ React.createElement(
    "span",
    {
      class: props.class,
      style: visuallyHiddenStyles,
      ...applySemanticAttrs({ scope: "visually-hidden", part: "root" })
    },
    props.children
  );
}
export {
  Root
};
//# sourceMappingURL=index.js.map