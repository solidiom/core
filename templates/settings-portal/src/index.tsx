import { render } from "@solidjs/web"
import { createRouter, defineRoutes } from "@solidjs/router"
import "./index.css"
import { Account } from "./pages/Account"
import { Notifications } from "./pages/Notifications"
import { DangerZone } from "./pages/DangerZone"

// Router 2.x: routes are config objects created outside JSX; the instance is
// the provider and the render-prop child plays the old `root` prop's role.
const Router = createRouter({
  routes: defineRoutes([
    { path: "/", component: Account },
    { path: "/notifications", component: Notifications },
    { path: "/danger-zone", component: DangerZone },
  ]),
})

render(() => <Router>{(props) => props.children}</Router>, document.getElementById("app")!)
