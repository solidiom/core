import type { Element } from "solid-js"

export interface RecipeDemoEntry {
  component: () => Element
  code: string
  label: string
}

import { ButtonRecipeDemo, buttonRecipeDemoCode } from "./button-recipe-demo"
import { DialogRecipeDemo, dialogRecipeDemoCode } from "./dialog-recipe-demo"
import { SwitchRecipeDemo, switchRecipeDemoCode } from "./switch-recipe-demo"
import { CheckboxRecipeDemo, checkboxRecipeDemoCode } from "./checkbox-recipe-demo"
import { TabsRecipeDemo, tabsRecipeDemoCode } from "./tabs-recipe-demo"
import { TypesetRecipeDemo, typesetRecipeDemoCode } from "./typeset-recipe-demo"
import { ProseRecipeDemo, proseRecipeDemoCode } from "./prose-recipe-demo"

export const recipeDemos: Record<string, RecipeDemoEntry> = {
  button: { component: () => ButtonRecipeDemo(), code: buttonRecipeDemoCode, label: "Button" },
  dialog: { component: () => DialogRecipeDemo(), code: dialogRecipeDemoCode, label: "Dialog" },
  switch: { component: () => SwitchRecipeDemo(), code: switchRecipeDemoCode, label: "Switch" },
  checkbox: {
    component: () => CheckboxRecipeDemo(),
    code: checkboxRecipeDemoCode,
    label: "Checkbox",
  },
  tabs: { component: () => TabsRecipeDemo(), code: tabsRecipeDemoCode, label: "Tabs" },
  typeset: { component: () => TypesetRecipeDemo(), code: typesetRecipeDemoCode, label: "Typeset" },
  prose: { component: () => ProseRecipeDemo(), code: proseRecipeDemoCode, label: "Prose" },
}
