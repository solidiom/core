// src/index.ts
function getSolidiomVariants(options = {}) {
  const p = options.prefix ?? "ui";
  return [
    { name: `${p}Open`, selector: "[data-state='open']" },
    { name: `${p}Closed`, selector: "[data-state='closed']" },
    { name: `${p}Checked`, selector: "[data-state='checked']" },
    { name: `${p}Unchecked`, selector: "[data-state='unchecked']" },
    { name: `${p}Active`, selector: "[data-state='active']" },
    { name: `${p}Disabled`, selector: "[data-disabled]" },
    { name: `${p}Highlighted`, selector: "[data-highlighted]" },
    { name: `${p}Selected`, selector: "[data-selected]" },
    { name: `${p}Required`, selector: "[data-required]" },
    { name: `${p}Invalid`, selector: "[data-invalid]" },
    { name: `${p}Placeholder`, selector: "[data-placeholder]" }
  ];
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