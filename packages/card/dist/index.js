// src/index.tsx
import { applySemanticAttrs } from "@solidiom/runtime";
function Root(props) {
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({ scope: "card", part: "root" })
    },
    props.children
  );
}
function Header(props) {
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({ scope: "card", part: "header" })
    },
    props.children
  );
}
function Title(props) {
  return /* @__PURE__ */ React.createElement("h3", { class: props.class, ...applySemanticAttrs({ scope: "card", part: "title" }) }, props.children);
}
function Description(props) {
  return /* @__PURE__ */ React.createElement("p", { class: props.class, ...applySemanticAttrs({ scope: "card", part: "description" }) }, props.children);
}
function Content(props) {
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({ scope: "card", part: "content" })
    },
    props.children
  );
}
function Footer(props) {
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({ scope: "card", part: "footer" })
    },
    props.children
  );
}
export {
  Content,
  Description,
  Footer,
  Header,
  Root,
  Title
};
//# sourceMappingURL=index.js.map