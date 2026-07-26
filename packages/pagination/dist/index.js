// src/index.tsx
import { applySemanticAttrs } from "@solidiom/runtime";
function Root(props) {
  return /* @__PURE__ */ React.createElement(
    "nav",
    {
      "aria-label": "Pagination",
      class: props.class,
      ...applySemanticAttrs({ scope: "pagination", part: "root" })
    },
    props.children
  );
}
function Content(props) {
  return /* @__PURE__ */ React.createElement("ul", { class: props.class, ...applySemanticAttrs({ scope: "pagination", part: "content" }) }, props.children);
}
function Item(props) {
  return /* @__PURE__ */ React.createElement("li", { class: props.class }, props.children);
}
function PreviousButton(props) {
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      "aria-label": "Go to previous page",
      class: props.class,
      disabled: props.disabled,
      onClick: props.onClick,
      ...applySemanticAttrs({ scope: "pagination", part: "previous" })
    },
    props.children
  );
}
function NextButton(props) {
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      "aria-label": "Go to next page",
      class: props.class,
      disabled: props.disabled,
      onClick: props.onClick,
      ...applySemanticAttrs({ scope: "pagination", part: "next" })
    },
    props.children
  );
}
function Ellipsis(props) {
  return /* @__PURE__ */ React.createElement(
    "span",
    {
      "aria-hidden": "true",
      class: props.class,
      ...applySemanticAttrs({ scope: "pagination", part: "ellipsis" })
    },
    props.children ?? "..."
  );
}
export {
  Content,
  Ellipsis,
  Item,
  NextButton,
  PreviousButton,
  Root
};
//# sourceMappingURL=index.js.map