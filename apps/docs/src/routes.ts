import { lazy } from "solid-js"

export const Home = lazy(() => import("./routes/index"))
export const PrimitivePage = lazy(() => import("./routes/primitives/[name]"))
export const PerformancePage = lazy(() => import("./routes/performance"))
export const RecipesPage = lazy(() => import("./routes/recipes"))
export const AccessibilityPage = lazy(() => import("./routes/accessibility"))
