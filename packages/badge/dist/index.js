// src/index.tsx
import { applySemanticAttrs } from "@solidiom/runtime";
function Root(props) {
  return /* @__PURE__ */ React.createElement("span", { class: props.class, ...applySemanticAttrs({ scope: "badge", part: "root" }) }, props.children);
}
export {
  Root
};
//# sourceMappingURL=index.js.map