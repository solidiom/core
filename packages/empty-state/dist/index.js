// src/index.tsx
import { applySemanticAttrs } from "@solidiom/runtime";
function Root(props) {
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "status",
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({ scope: "empty-state", part: "root" })
    },
    props.children
  );
}
function Icon(props) {
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      "aria-hidden": "true",
      class: props.class,
      ...applySemanticAttrs({ scope: "empty-state", part: "icon" })
    },
    props.children
  );
}
function Title(props) {
  return /* @__PURE__ */ React.createElement("h3", { class: props.class, ...applySemanticAttrs({ scope: "empty-state", part: "title" }) }, props.children);
}
function Description(props) {
  return /* @__PURE__ */ React.createElement("p", { class: props.class, ...applySemanticAttrs({ scope: "empty-state", part: "description" }) }, props.children);
}
function Action(props) {
  return /* @__PURE__ */ React.createElement("div", { class: props.class, ...applySemanticAttrs({ scope: "empty-state", part: "action" }) }, props.children);
}
export {
  Action,
  Description,
  Icon,
  Root,
  Title
};
//# sourceMappingURL=index.js.map