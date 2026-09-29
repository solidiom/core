import { createTsupConfig } from "../../tools/build/tsup.config.base"

export default createTsupConfig({
  entry: ["src/index.ts", "src/testing/console-guard.ts"],
})
