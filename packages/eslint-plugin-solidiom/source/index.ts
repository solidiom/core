/**
 * @solidiom/eslint-plugin-solidiom — ESLint plugin enforcing Solidiom layer boundaries
 * and primitive anatomy/semantics.
 *
 * Boundary rules:
 * - no-cross-layer-import: prevents imports violating layer hierarchy
 * - no-engine-import-outside-adapters: restricts engine packages to adapters
 * - no-adapter-jsx-attributes: prevents adapters from emitting semantic attrs
 * - no-adapter-import-of-recipes: prevents adapters from importing recipe packages
 *
 * Anatomy / semantics rules:
 * - require-primitive-parts: requires structural child parts inside Root
 * - require-accessible-name: warns when parts lack accessible names
 * - no-forbidden-primitive-props: prevents setting internally-managed props
 */

import noCrossLayerImport from "./rules/no-cross-layer-import"
import noEngineImportOutsideAdapters from "./rules/no-engine-import-outside-adapters"
import noAdapterJsxAttributes from "./rules/no-adapter-jsx-attributes"
import noAdapterImportOfRecipes from "./rules/no-adapter-import-of-recipes"
import requirePrimitiveParts from "./rules/require-primitive-parts"
import requireAccessibleName from "./rules/require-accessible-name"
import noForbiddenPrimitiveProps from "./rules/no-forbidden-primitive-props"

const plugin = {
  meta: {
    name: "@solidiom/eslint-plugin-solidiom",
    version: "0.0.1-next.0",
  },
  rules: {
    "no-cross-layer-import": noCrossLayerImport,
    "no-engine-import-outside-adapters": noEngineImportOutsideAdapters,
    "no-adapter-jsx-attributes": noAdapterJsxAttributes,
    "no-adapter-import-of-recipes": noAdapterImportOfRecipes,
    "require-primitive-parts": requirePrimitiveParts,
    "require-accessible-name": requireAccessibleName,
    "no-forbidden-primitive-props": noForbiddenPrimitiveProps,
  },
}

export default plugin
export {
  noCrossLayerImport,
  noEngineImportOutsideAdapters,
  noAdapterJsxAttributes,
  noAdapterImportOfRecipes,
  requirePrimitiveParts,
  requireAccessibleName,
  noForbiddenPrimitiveProps,
}
