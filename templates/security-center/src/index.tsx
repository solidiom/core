import { render } from "@solidjs/web"
import { createRouter, defineRoutes } from "@solidjs/router"
import "./index.css"
import { AppShell } from "./components/AppShell"
import { ThreatDashboard } from "./pages/ThreatDashboard"
import { Vulnerabilities } from "./pages/Vulnerabilities"
import { Policies } from "./pages/Policies"

// Router 2.x: routes are config objects created outside JSX; the instance is
// the provider and the render-prop child plays the old `root` prop's role.
const Router = createRouter({
  routes: defineRoutes([
    { path: "/", component: ThreatDashboard },
    { path: "/vulnerabilities", component: Vulnerabilities },
    { path: "/policies", component: Policies },
  ]),
})

render(
  () => <Router>{(props) => <AppShell>{props.children}</AppShell>}</Router>,
  document.getElementById("app")!,
)
