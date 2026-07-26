/**
 * @solidiom/eslint-plugin-solidiom — ESLint plugin enforcing Solidiom layer boundaries.
 *
 * Rules:
 * - no-cross-layer-import: prevents imports violating layer hierarchy
 * - no-engine-import-outside-adapters: restricts engine packages to adapters
 * - no-adapter-jsx-attributes: prevents adapters from emitting semantic attrs
 */

import noCrossLayerImport from "./rules/no-cross-layer-import"
import noEngineImportOutsideAdapters from "./rules/no-engine-import-outside-adapters"
import noAdapterJsxAttributes from "./rules/no-adapter-jsx-attributes"
import noPrimitiveImportOfLegacy from "./rules/no-primitive-import-of-legacy"
import noRecipeImportOfMigration from "./rules/no-recipe-import-of-migration"

const plugin = {
  meta: {
    name: "@solidiom/eslint-plugin-solidiom",
    version: "0.0.1-next.0",
  },
  rules: {
    "no-cross-layer-import": noCrossLayerImport,
    "no-engine-import-outside-adapters": noEngineImportOutsideAdapters,
    "no-adapter-jsx-attributes": noAdapterJsxAttributes,
    "no-primitive-import-of-legacy": noPrimitiveImportOfLegacy,
    "no-recipe-import-of-migration": noRecipeImportOfMigration,
  },
}

export default plugin
export {
  noCrossLayerImport,
  noEngineImportOutsideAdapters,
  noAdapterJsxAttributes,
  noPrimitiveImportOfLegacy,
  noRecipeImportOfMigration,
}
