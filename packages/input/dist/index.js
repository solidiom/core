// src/index.tsx
import { applySemanticAttrs } from "@solidiom/runtime";
function Root(props) {
  const handleInput = (e) => {
    props.onValueChange?.(e.currentTarget.value);
    if (props.onInput) {
      ;
      props.onInput(e);
    }
  };
  return /* @__PURE__ */ React.createElement(
    "input",
    {
      id: props.id,
      type: props.type ?? "text",
      name: props.name,
      value: props.value ?? props.defaultValue ?? "",
      placeholder: props.placeholder,
      disabled: props.disabled,
      readonly: props.readOnly,
      required: props.required,
      "aria-invalid": props.invalid ? "true" : void 0,
      "aria-required": props.required ? "true" : void 0,
      "aria-disabled": props.disabled ? "true" : void 0,
      class: props.class,
      style: props.style,
      onInput: handleInput,
      onBlur: props.onBlur,
      onFocus: props.onFocus,
      ...applySemanticAttrs({
        scope: "input",
        part: "root",
        disabled: props.disabled,
        readonly: props.readOnly,
        required: props.required,
        invalid: props.invalid,
        placeholder: !props.value && !!props.placeholder
      })
    }
  );
}
function Textarea(props) {
  const handleInput = (e) => {
    props.onValueChange?.(e.currentTarget.value);
    if (props.onInput) {
      ;
      props.onInput(e);
    }
  };
  return /* @__PURE__ */ React.createElement(
    "textarea",
    {
      id: props.id,
      name: props.name,
      rows: props.rows,
      placeholder: props.placeholder,
      disabled: props.disabled,
      readonly: props.readOnly,
      required: props.required,
      "aria-invalid": props.invalid ? "true" : void 0,
      "aria-required": props.required ? "true" : void 0,
      "aria-disabled": props.disabled ? "true" : void 0,
      class: props.class,
      style: props.style,
      onInput: handleInput,
      onBlur: props.onBlur,
      onFocus: props.onFocus,
      ...applySemanticAttrs({
        scope: "input",
        part: "textarea",
        disabled: props.disabled,
        readonly: props.readOnly,
        required: props.required,
        invalid: props.invalid,
        placeholder: !props.value && !!props.placeholder
      })
    },
    props.value ?? props.defaultValue ?? ""
  );
}
export {
  Root,
  Textarea
};
//# sourceMappingURL=index.js.map