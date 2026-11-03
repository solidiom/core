import { render } from "@solidjs/web"
import { createRouter, defineRoutes } from "@solidjs/router"
import "./index.css"
import { AppShell } from "./components/AppShell"
import { Landing } from "./pages/Landing"
import { Features } from "./pages/Features"
import { Pricing } from "./pages/Pricing"

// Router 2.x: routes are config objects created outside JSX; the instance is
// the provider and the render-prop child plays the old `root` prop's role.
const Router = createRouter({
  routes: defineRoutes([
    { path: "/", component: Landing },
    { path: "/features", component: Features },
    { path: "/pricing", component: Pricing },
  ]),
})

render(
  () => <Router>{(props) => <AppShell>{props.children}</AppShell>}</Router>,
  document.getElementById("app")!,
)
