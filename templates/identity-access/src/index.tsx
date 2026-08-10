import { render } from "@solidjs/web"
import { Router, Route } from "@solidjs/router"
import "./index.css"
import { AppShell } from "./components/AppShell"
import { Users } from "./pages/Users"
import { Roles } from "./pages/Roles"
import { Sessions } from "./pages/Sessions"

render(
  () => (
    <Router root={AppShell}>
      <Route path="/" component={Users} />
      <Route path="/roles" component={Roles} />
      <Route path="/sessions" component={Sessions} />
    </Router>
  ),
  document.getElementById("app")!,
)
