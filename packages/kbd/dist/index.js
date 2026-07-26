// src/index.tsx
import { applySemanticAttrs } from "@solidiom/runtime";
function Root(props) {
  return /* @__PURE__ */ React.createElement(
    "kbd",
    {
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({ scope: "kbd", part: "root" })
    },
    props.children
  );
}
export {
  Root
};
//# sourceMappingURL=index.js.map