// src/index.tsx
import { applySemanticAttrs } from "@solidiom/runtime";
function Root(props) {
  return /* @__PURE__ */ React.createElement(
    "span",
    {
      role: "status",
      "aria-label": props.label ?? "Loading",
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({ scope: "spinner", part: "root" })
    },
    props.children
  );
}
export {
  Root
};
//# sourceMappingURL=index.js.map