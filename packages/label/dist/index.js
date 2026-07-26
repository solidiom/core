// src/index.tsx
import { applySemanticAttrs } from "@solidiom/runtime";
function Root(props) {
  return /* @__PURE__ */ React.createElement(
    "label",
    {
      id: props.id,
      for: props.htmlFor,
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({
        scope: "label",
        part: "root",
        disabled: props.disabled,
        required: props.required,
        invalid: props.invalid
      })
    },
    props.children
  );
}
export {
  Root
};
//# sourceMappingURL=index.js.map