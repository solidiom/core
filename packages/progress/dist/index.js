// src/index.tsx
import { applySemanticAttrs } from "@solidiom/runtime";
function Root(props) {
  const max = () => props.max ?? 100;
  const percentage = () => props.value != null ? Math.round(props.value / max() * 100) : null;
  const state = () => {
    if (props.value == null) return "loading";
    return props.value >= max() ? "complete" : "loading";
  };
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "progressbar",
      "aria-valuenow": props.value ?? void 0,
      "aria-valuemin": 0,
      "aria-valuemax": max(),
      "aria-label": props["aria-label"],
      "aria-labelledby": props["aria-labelledby"],
      class: props.class,
      style: props.style,
      "data-value": props.value ?? void 0,
      "data-max": max(),
      "data-percent": percentage() ?? void 0,
      ...applySemanticAttrs({
        scope: "progress",
        part: "root",
        state: state()
      })
    },
    props.children
  );
}
function Indicator(props) {
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({ scope: "progress", part: "indicator" })
    },
    props.children
  );
}
export {
  Indicator,
  Root
};
//# sourceMappingURL=index.js.map