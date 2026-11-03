import { render } from "@solidjs/web"
import { createRouter, defineRoutes } from "@solidjs/router"
import "./index.css"
import { SignIn } from "./pages/SignIn"
import { SignUp } from "./pages/SignUp"
import { ResetPassword } from "./pages/ResetPassword"

// Router 2.x: routes are config objects created outside JSX; the instance is
// the provider and the render-prop child plays the old `root` prop's role.
const Router = createRouter({
  routes: defineRoutes([
    { path: "/", component: SignIn },
    { path: "/sign-up", component: SignUp },
    { path: "/reset-password", component: ResetPassword },
  ]),
})

render(() => <Router>{(props) => props.children}</Router>, document.getElementById("app")!)
