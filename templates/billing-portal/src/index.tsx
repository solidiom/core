import { render } from "@solidjs/web"
import { createRouter, defineRoutes } from "@solidjs/router"
import "./index.css"
import { Plans } from "./pages/Plans"
import { Payment } from "./pages/Payment"
import { Invoices } from "./pages/Invoices"

// Router 2.x: routes are config objects created outside JSX; the instance is
// the provider and the render-prop child plays the old `root` prop's role.
const Router = createRouter({
  routes: defineRoutes([
    { path: "/", component: Plans },
    { path: "/payment", component: Payment },
    { path: "/invoices", component: Invoices },
  ]),
})

render(() => <Router>{(props) => props.children}</Router>, document.getElementById("app")!)
