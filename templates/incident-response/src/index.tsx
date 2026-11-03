import { render } from "@solidjs/web"
import { createRouter, defineRoutes } from "@solidjs/router"
import "./index.css"
import { AppShell } from "./components/AppShell"
import { ActiveIncidents } from "./pages/ActiveIncidents"
import { Runbooks } from "./pages/Runbooks"
import { Postmortems } from "./pages/Postmortems"

// Router 2.x: routes are config objects created outside JSX; the instance is
// the provider and the render-prop child plays the old `root` prop's role.
const Router = createRouter({
  routes: defineRoutes([
    { path: "/", component: ActiveIncidents },
    { path: "/runbooks", component: Runbooks },
    { path: "/postmortems", component: Postmortems },
  ]),
})

render(
  () => <Router>{(props) => <AppShell>{props.children}</AppShell>}</Router>,
  document.getElementById("app")!,
)
