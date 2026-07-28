// src/index.tsx
import { createContext, useContext } from "solid-js";
import { createFormControl, applySemanticAttrs } from "@solidiom/runtime";
import { Show } from "solid-js";
var FieldContext = createContext();
function useField() {
  const ctx = useContext(FieldContext);
  if (!ctx)
    throw new globalThis.Error("[solidiom] Field sub-parts must be used within <Field.Root>");
  return ctx;
}
function Root(props) {
  const disabled = () => props.disabled ?? false;
  const required = () => props.required ?? false;
  const readOnly = () => props.readOnly ?? false;
  const invalid = () => props.invalid ?? false;
  const formControl = createFormControl({
    id: props.id,
    disabled,
    required,
    readOnly,
    invalid
  });
  return /* @__PURE__ */ React.createElement(FieldContext, { value: { formControl, invalid, disabled, required, readOnly } }, /* @__PURE__ */ React.createElement(
    "div",
    {
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({
        scope: "field",
        part: "root",
        disabled: disabled(),
        required: required(),
        invalid: invalid(),
        readonly: readOnly()
      })
    },
    props.children
  ));
}
function Label(props) {
  const { formControl, disabled, required, invalid } = useField();
  return /* @__PURE__ */ React.createElement(
    "label",
    {
      ...formControl.labelProps(),
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({
        scope: "field",
        part: "label",
        disabled: disabled(),
        required: required(),
        invalid: invalid()
      })
    },
    props.children
  );
}
function Control(props) {
  const { formControl } = useField();
  return /* @__PURE__ */ React.createElement(React.Fragment, null, props.children(formControl.controlProps));
}
function Description(props) {
  const { formControl, invalid } = useField();
  return /* @__PURE__ */ React.createElement(Show, { when: !invalid() }, /* @__PURE__ */ React.createElement(
    "span",
    {
      id: formControl.descriptionId,
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({ scope: "field", part: "description" })
    },
    props.children
  ));
}
function Error(props) {
  const { formControl, invalid } = useField();
  return /* @__PURE__ */ React.createElement(Show, { when: invalid() }, /* @__PURE__ */ React.createElement(
    "span",
    {
      id: formControl.errorId,
      role: "alert",
      "aria-live": "assertive",
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({ scope: "field", part: "error" })
    },
    props.children
  ));
}
export {
  Control,
  Description,
  Error,
  Label,
  Root
};
//# sourceMappingURL=index.js.map