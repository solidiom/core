// src/index.tsx
import { applySemanticAttrs as applySemanticAttrs3 } from "@solidiom/runtime";

// src/icon-button.tsx
function IconButton(props) {
  return /* @__PURE__ */ React.createElement(
    Root,
    {
      disabled: props.disabled,
      loading: props.loading,
      onClick: props.onClick,
      type: props.type,
      class: props.class
    },
    /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, props.children)
  );
}

// src/toggle-button.tsx
import { applySemanticAttrs } from "@solidiom/runtime";
function ToggleButton(props) {
  const isDisabled = () => props.disabled || props.loading;
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      disabled: isDisabled(),
      "aria-pressed": props.pressed ? "true" : "false",
      "aria-busy": props.loading ? "true" : void 0,
      class: props.class,
      onClick: () => {
        if (!isDisabled()) {
          props.onPressedChange?.(!props.pressed);
        }
      },
      ...applySemanticAttrs({
        scope: "button",
        part: "toggle",
        state: props.pressed ? "on" : "off",
        disabled: isDisabled(),
        loading: props.loading
      })
    },
    props.children
  );
}

// src/button-group.tsx
import { applySemanticAttrs as applySemanticAttrs2 } from "@solidiom/runtime";
function ButtonGroup(props) {
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "group",
      class: props.class,
      ...applySemanticAttrs2({
        scope: "button",
        part: "group",
        orientation: props.orientation ?? "horizontal"
      })
    },
    props.children
  );
}

// src/index.tsx
function Root(props) {
  const isDisabled = () => props.disabled || props.loading;
  const semanticAttrs = () => applySemanticAttrs3({
    scope: "button",
    part: "root",
    disabled: isDisabled(),
    loading: props.loading
  });
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      type: props.type ?? "button",
      disabled: isDisabled(),
      "aria-busy": props.loading ? "true" : void 0,
      onClick: props.onClick,
      class: props.class,
      ...semanticAttrs()
    },
    props.children
  );
}
export {
  ButtonGroup,
  IconButton,
  Root,
  ToggleButton
};
//# sourceMappingURL=index.js.map