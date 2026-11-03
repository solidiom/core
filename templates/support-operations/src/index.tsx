import { render } from "@solidjs/web"
import { createRouter, defineRoutes } from "@solidjs/router"
import "./index.css"
import { AppShell } from "./components/AppShell"
import { TicketQueue } from "./pages/TicketQueue"
import { KnowledgeBase } from "./pages/KnowledgeBase"
import { Metrics } from "./pages/Metrics"

// Router 2.x: routes are config objects created outside JSX; the instance is
// the provider and the render-prop child plays the old `root` prop's role.
const Router = createRouter({
  routes: defineRoutes([
    { path: "/", component: TicketQueue },
    { path: "/knowledge-base", component: KnowledgeBase },
    { path: "/metrics", component: Metrics },
  ]),
})

render(
  () => <Router>{(props) => <AppShell>{props.children}</AppShell>}</Router>,
  document.getElementById("app")!,
)
