import { render } from "@solidjs/web"
import { createRouter, defineRoutes } from "@solidjs/router"
import "./index.css"
import { AppShell } from "./components/AppShell"
import { EndpointCatalog } from "./pages/EndpointCatalog"
import { ApiKeys } from "./pages/ApiKeys"
import { UsageAnalytics } from "./pages/UsageAnalytics"

// Router 2.x: routes are config objects created outside JSX; the instance is
// the provider and the render-prop child plays the old `root` prop's role.
const Router = createRouter({
  routes: defineRoutes([
    { path: "/", component: EndpointCatalog },
    { path: "/keys", component: ApiKeys },
    { path: "/usage", component: UsageAnalytics },
  ]),
})

render(
  () => <Router>{(props) => <AppShell>{props.children}</AppShell>}</Router>,
  document.getElementById("app")!,
)
