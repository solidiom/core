import { render } from "@solidjs/web"
import { createRouter, defineRoutes } from "@solidjs/router"
import "./index.css"
import { AppShell } from "./components/AppShell"
import { PipelineBuilder } from "./pages/PipelineBuilder"
import { ModelRegistry } from "./pages/ModelRegistry"
import { ExecutionLogs } from "./pages/ExecutionLogs"

// Router 2.x: routes are config objects created outside JSX; the instance is
// the provider and the render-prop child plays the old `root` prop's role.
const Router = createRouter({
  routes: defineRoutes([
    { path: "/", component: PipelineBuilder },
    { path: "/models", component: ModelRegistry },
    { path: "/executions", component: ExecutionLogs },
  ]),
})

render(
  () => <Router>{(props) => <AppShell>{props.children}</AppShell>}</Router>,
  document.getElementById("app")!,
)
