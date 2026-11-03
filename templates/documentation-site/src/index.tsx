import { render } from "@solidjs/web"
import { createRouter, defineRoutes } from "@solidjs/router"
import "./index.css"
import { AppShell } from "./components/AppShell"
import { DocsReader } from "./pages/DocsReader"
import { ApiReference } from "./pages/ApiReference"
import { Guides } from "./pages/Guides"

// Router 2.x: routes are config objects created outside JSX; the instance is
// the provider and the render-prop child plays the old `root` prop's role.
const Router = createRouter({
  routes: defineRoutes([
    { path: "/", component: DocsReader },
    { path: "/api", component: ApiReference },
    { path: "/guides", component: Guides },
  ]),
})

render(
  () => <Router>{(props) => <AppShell>{props.children}</AppShell>}</Router>,
  document.getElementById("app")!,
)
