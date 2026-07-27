// src/index.tsx
import { Show, createContext, useContext } from "solid-js";
import { createControllableValue, createChangeDetails, applySemanticAttrs } from "@solidiom/runtime";
var CheckboxContext = createContext();
var CheckboxGroupContext = createContext(null);
function Group(props) {
  const { value, requestChange } = createControllableValue({
    value: props.value,
    defaultValue: props.defaultValue ?? [],
    onChange: (next) => props.onValueChange?.(next),
    equals: (a, b) => a.length === b.length && a.every((v, i) => v === b[i])
  });
  const toggle = (itemValue) => {
    const current = value();
    const next = current.includes(itemValue) ? current.filter((v) => v !== itemValue) : [...current, itemValue];
    requestChange(next, createChangeDetails("toggle"));
  };
  return /* @__PURE__ */ React.createElement(CheckboxGroupContext, { value: { value, toggle, disabled: props.disabled } }, /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "group",
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({
        scope: "checkbox",
        part: "group",
        disabled: props.disabled
      })
    },
    props.children
  ));
}
function useCheckboxGroup() {
  return useContext(CheckboxGroupContext);
}
function Root(props) {
  const groupCtx = useContext(CheckboxGroupContext);
  const groupChecked = () => {
    if (groupCtx && props.value) {
      return groupCtx.value().includes(props.value);
    }
    return void 0;
  };
  const { value: checked, requestChange } = createControllableValue({
    value: props.checked ?? (groupCtx && props.value ? () => groupChecked() ?? false : void 0),
    defaultValue: props.defaultChecked ?? false,
    onChange: (next) => {
      props.onCheckedChange?.(next);
      if (groupCtx && props.value && typeof next === "boolean") {
        groupCtx.toggle(props.value);
      }
    }
  });
  const isDisabled = () => props.disabled || groupCtx?.disabled;
  const ariaChecked = () => checked() === "indeterminate" ? "mixed" : checked() ? "true" : "false";
  const state = () => checked() === "indeterminate" ? "indeterminate" : checked() ? "checked" : "unchecked";
  const handleClick = () => {
    if (isDisabled()) return;
    if (groupCtx && props.value) {
      groupCtx.toggle(props.value);
    } else {
      requestChange(checked() === true ? false : true, createChangeDetails("toggle"));
    }
  };
  return /* @__PURE__ */ React.createElement(CheckboxContext, { value: { checked } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      role: "checkbox",
      "aria-checked": ariaChecked(),
      "aria-disabled": isDisabled() ? "true" : void 0,
      "aria-required": props.required ? "true" : void 0,
      onClick: handleClick,
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({
        scope: "checkbox",
        part: "root",
        state: state(),
        disabled: isDisabled()
      })
    },
    props.children
  ));
}
function Indicator(props) {
  const ctx = useContext(CheckboxContext);
  const isVisible = () => {
    const val = ctx?.checked();
    return val === true || val === "indeterminate";
  };
  const state = () => {
    const val = ctx?.checked();
    return val === "indeterminate" ? "indeterminate" : val ? "checked" : "unchecked";
  };
  return /* @__PURE__ */ React.createElement(Show, { when: isVisible() }, /* @__PURE__ */ React.createElement(
    "span",
    {
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({ scope: "checkbox", part: "indicator", state: state() })
    },
    props.children
  ));
}
export {
  Group,
  Indicator,
  Root,
  useCheckboxGroup
};
//# sourceMappingURL=index.js.map