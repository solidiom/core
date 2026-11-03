/* @refresh reload */
import { render } from "@solidjs/web"
import { createRouter, defineRoutes } from "@solidjs/router"
import App from "./App"
import Home from "./pages/Home"
import About from "./pages/About"
import "./index.css"

const root = document.getElementById("app")

if (!root) {
  throw new Error("Root element #app not found — check index.html.")
}

// Router 2.x: routes are config objects created outside JSX; the instance is
// the provider and the render-prop child plays the old `root` prop's role.
const Router = createRouter({
  routes: defineRoutes([
    { path: "/", component: Home },
    { path: "/about", component: About },
  ]),
})

render(() => <Router>{(props) => <App>{props.children}</App>}</Router>, root)
