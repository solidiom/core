import { render } from "@solidjs/web"
import { createRouter, defineRoutes } from "@solidjs/router"
import "./index.css"
import { AppShell } from "./components/AppShell"
import { Editor } from "./pages/Editor"
import { Library } from "./pages/Library"
import { Workflow } from "./pages/Workflow"

// Router 2.x: routes are config objects created outside JSX; the instance is
// the provider and the render-prop child plays the old `root` prop's role.
const Router = createRouter({
  routes: defineRoutes([
    { path: "/", component: Editor },
    { path: "/library", component: Library },
    { path: "/workflow", component: Workflow },
  ]),
})

render(
  () => <Router>{(props) => <AppShell>{props.children}</AppShell>}</Router>,
  document.getElementById("app")!,
)
