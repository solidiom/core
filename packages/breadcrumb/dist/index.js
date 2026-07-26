// src/index.tsx
import { applySemanticAttrs } from "@solidiom/runtime";
function Root(props) {
  return /* @__PURE__ */ React.createElement(
    "nav",
    {
      "aria-label": "Breadcrumb",
      class: props.class,
      ...applySemanticAttrs({ scope: "breadcrumb", part: "root" })
    },
    props.children
  );
}
function List(props) {
  return /* @__PURE__ */ React.createElement("ol", { class: props.class, ...applySemanticAttrs({ scope: "breadcrumb", part: "list" }) }, props.children);
}
function Item(props) {
  return /* @__PURE__ */ React.createElement("li", { class: props.class, ...applySemanticAttrs({ scope: "breadcrumb", part: "item" }) }, props.children);
}
function Link(props) {
  return /* @__PURE__ */ React.createElement(
    "a",
    {
      href: props.href,
      "aria-current": props.current ? "page" : void 0,
      class: props.class,
      ...applySemanticAttrs({ scope: "breadcrumb", part: "link" })
    },
    props.children
  );
}
function Separator(props) {
  return /* @__PURE__ */ React.createElement(
    "span",
    {
      role: "presentation",
      "aria-hidden": "true",
      class: props.class,
      ...applySemanticAttrs({ scope: "breadcrumb", part: "separator" })
    },
    props.children ?? "/"
  );
}
function Ellipsis(props) {
  return /* @__PURE__ */ React.createElement(
    "span",
    {
      role: "presentation",
      class: props.class,
      ...applySemanticAttrs({ scope: "breadcrumb", part: "ellipsis" })
    },
    props.children ?? "..."
  );
}
export {
  Ellipsis,
  Item,
  Link,
  List,
  Root,
  Separator
};
//# sourceMappingURL=index.js.map