import { render } from "@solidjs/web"
import { createRouter, defineRoutes } from "@solidjs/router"
import "./index.css"
import { AppShell } from "./components/AppShell"
import { Browse } from "./pages/Browse"
import { SellerDashboard } from "./pages/SellerDashboard"
import { ListingDetail } from "./pages/ListingDetail"

// Router 2.x: routes are config objects created outside JSX; the instance is
// the provider and the render-prop child plays the old `root` prop's role.
const Router = createRouter({
  routes: defineRoutes([
    { path: "/", component: Browse },
    { path: "/seller", component: SellerDashboard },
    { path: "/listing/:id", component: ListingDetail },
  ]),
})

render(
  () => <Router>{(props) => <AppShell>{props.children}</AppShell>}</Router>,
  document.getElementById("app")!,
)
