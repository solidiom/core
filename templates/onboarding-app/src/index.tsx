import { render } from "@solidjs/web"
import { createRouter, defineRoutes } from "@solidjs/router"
import "./index.css"
import { Welcome } from "./pages/Welcome"
import { ProfileSetup } from "./pages/ProfileSetup"
import { ProjectStarter } from "./pages/ProjectStarter"

// Router 2.x: routes are config objects created outside JSX; the instance is
// the provider and the render-prop child plays the old `root` prop's role.
const Router = createRouter({
  routes: defineRoutes([
    { path: "/", component: Welcome },
    { path: "/profile", component: ProfileSetup },
    { path: "/project", component: ProjectStarter },
  ]),
})

render(() => <Router>{(props) => props.children}</Router>, document.getElementById("app")!)
