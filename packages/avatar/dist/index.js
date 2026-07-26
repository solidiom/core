// src/index.tsx
import { createSignal, createContext, useContext, Show } from "solid-js";
import { applySemanticAttrs } from "@solidiom/runtime";
var AvatarContext = createContext();
function Root(props) {
  const [imageStatus, setImageStatus] = createSignal("loading");
  return /* @__PURE__ */ React.createElement(AvatarContext, { value: { imageStatus, setImageStatus } }, /* @__PURE__ */ React.createElement("span", { class: props.class, ...applySemanticAttrs({ scope: "avatar", part: "root" }) }, props.children));
}
function Image(props) {
  const ctx = useContext(AvatarContext);
  const [localStatus, setLocalStatus] = createSignal("loading");
  const handleLoad = () => {
    setLocalStatus("loaded");
    ctx?.setImageStatus("loaded");
  };
  const handleError = () => {
    setLocalStatus("error");
    ctx?.setImageStatus("error");
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: props.src,
      alt: props.alt,
      class: props.class,
      style: localStatus() === "loaded" ? void 0 : { display: "none" },
      onLoad: handleLoad,
      onError: handleError,
      ...applySemanticAttrs({ scope: "avatar", part: "image" })
    }
  ));
}
function Fallback(props) {
  const ctx = useContext(AvatarContext);
  const showFallback = () => {
    if (!ctx) return true;
    return ctx.imageStatus() !== "loaded";
  };
  return /* @__PURE__ */ React.createElement(Show, { when: showFallback() }, /* @__PURE__ */ React.createElement("span", { class: props.class, ...applySemanticAttrs({ scope: "avatar", part: "fallback" }) }, props.children));
}
export {
  Fallback,
  Image,
  Root
};
//# sourceMappingURL=index.js.map