// src/index.tsx
import { applySemanticAttrs } from "@solidiom/runtime";
function Root(props) {
  const variant = () => props.variant ?? "text";
  const computedStyle = () => {
    const w = props.width;
    const h = props.height;
    if (!w && !h) return props.style ?? {};
    const base = typeof props.style === "object" ? props.style ?? {} : {};
    return {
      ...base,
      ...w != null ? { width: typeof w === "number" ? `${w}px` : w } : {},
      ...h != null ? { height: typeof h === "number" ? `${h}px` : h } : {}
    };
  };
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      "aria-hidden": "true",
      class: props.class,
      style: computedStyle(),
      "data-variant": variant(),
      ...applySemanticAttrs({ scope: "skeleton", part: "root" })
    }
  );
}
export {
  Root
};
//# sourceMappingURL=index.js.map