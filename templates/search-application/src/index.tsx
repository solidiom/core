import { render } from "@solidjs/web"
import { createRouter, defineRoutes } from "@solidjs/router"
import "./index.css"
import { AppShell } from "./components/AppShell"
import { SearchResults } from "./pages/SearchResults"
import { SavedSearches } from "./pages/SavedSearches"
import { SearchAnalytics } from "./pages/SearchAnalytics"

// Router 2.x: routes are config objects created outside JSX; the instance is
// the provider and the render-prop child plays the old `root` prop's role.
const Router = createRouter({
  routes: defineRoutes([
    { path: "/", component: SearchResults },
    { path: "/saved", component: SavedSearches },
    { path: "/analytics", component: SearchAnalytics },
  ]),
})

render(
  () => <Router>{(props) => <AppShell>{props.children}</AppShell>}</Router>,
  document.getElementById("app")!,
)
