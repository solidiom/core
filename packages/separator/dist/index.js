// src/index.tsx
import { applySemanticAttrs } from "@solidiom/runtime";
function Root(props) {
  const orientation = () => props.orientation ?? "horizontal";
  const role = () => props.decorative ? "none" : "separator";
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      role: role(),
      "aria-orientation": props.decorative ? void 0 : orientation(),
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({ scope: "separator", part: "root", orientation: orientation() })
    }
  );
}
export {
  Root
};
//# sourceMappingURL=index.js.map