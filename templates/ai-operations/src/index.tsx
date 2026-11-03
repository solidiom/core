import { render } from "@solidjs/web"
import { createRouter, defineRoutes } from "@solidjs/router"
import "./index.css"
import { AppShell } from "./components/AppShell"
import { ModelMonitoring } from "./pages/ModelMonitoring"
import { Deployments } from "./pages/Deployments"
import { CostTracking } from "./pages/CostTracking"

// Router 2.x: routes are config objects created outside JSX; the instance is
// the provider and the render-prop child plays the old `root` prop's role.
const Router = createRouter({
  routes: defineRoutes([
    { path: "/", component: ModelMonitoring },
    { path: "/deployments", component: Deployments },
    { path: "/costs", component: CostTracking },
  ]),
})

render(
  () => <Router>{(props) => <AppShell>{props.children}</AppShell>}</Router>,
  document.getElementById("app")!,
)
