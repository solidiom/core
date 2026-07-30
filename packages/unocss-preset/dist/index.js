// src/index.ts
import {
  SEMANTIC_FLAGS,
  SEMANTIC_ORIENTATIONS,
  SEMANTIC_SIDES,
  allStateValues
} from "@solidiom/runtime";
var FLAG_NAMES = new Set(SEMANTIC_FLAGS);
function pascalCase(value) {
  return value.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("");
}
function getSolidiomVariants(options = {}) {
  const p = options.prefix ?? "ui";
  const flagVariants = SEMANTIC_FLAGS.map((flag) => ({
    name: `${p}${pascalCase(flag)}`,
    selector: `[data-${flag}]`
  }));
  const stateVariants = allStateValues().map((state) => ({
    name: FLAG_NAMES.has(state) ? `${p}State${pascalCase(state)}` : `${p}${pascalCase(state)}`,
    selector: `[data-state='${state}']`
  }));
  const orientationVariants = SEMANTIC_ORIENTATIONS.map((orientation) => ({
    name: `${p}${pascalCase(orientation)}`,
    selector: `[data-orientation='${orientation}']`
  }));
  const sideVariants = SEMANTIC_SIDES.map((side) => ({
    name: `${p}Side${pascalCase(side)}`,
    selector: `[data-side='${side}']`
  }));
  return [...flagVariants, ...stateVariants, ...orientationVariants, ...sideVariants];
}
function presetSolidiom(options = {}) {
  const variants = getSolidiomVariants(options);
  return {
    name: "@solidiom/unocss-preset",
    variants: variants.map((v) => ({
      name: v.name,
      match: (input) => {
        if (!input.startsWith(`${v.name}:`)) return void 0;
        return {
          matcher: input.slice(v.name.length + 1),
          selector: (s) => `${s}${v.selector}`
        };
      }
    }))
  };
}
export {
  getSolidiomVariants,
  presetSolidiom
};
//# sourceMappingURL=index.js.map