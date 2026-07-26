// src/index.tsx
import { createContext, useContext } from "solid-js";
import { applySemanticAttrs, createStableId } from "@solidiom/runtime";
var AlertContext = createContext();
function Root(props) {
  const titleId = createStableId("alert-title");
  const descriptionId = createStableId("alert-desc");
  const role = () => props.assertiveness === "polite" ? "status" : "alert";
  const alertType = () => props.type ?? "info";
  return /* @__PURE__ */ React.createElement(AlertContext, { value: { titleId, descriptionId } }, /* @__PURE__ */ React.createElement(
    "div",
    {
      role: role(),
      "aria-labelledby": titleId,
      "aria-describedby": descriptionId,
      class: props.class,
      ...applySemanticAttrs({ scope: "alert", part: "root", state: alertType() })
    },
    props.children
  ));
}
function Title(props) {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("Alert.Title must be used within Alert.Root");
  return /* @__PURE__ */ React.createElement(
    "h5",
    {
      id: ctx.titleId,
      class: props.class,
      ...applySemanticAttrs({ scope: "alert", part: "title" })
    },
    props.children
  );
}
function Description(props) {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("Alert.Description must be used within Alert.Root");
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      id: ctx.descriptionId,
      class: props.class,
      ...applySemanticAttrs({ scope: "alert", part: "description" })
    },
    props.children
  );
}
export {
  Description,
  Root,
  Title
};
//# sourceMappingURL=index.js.map