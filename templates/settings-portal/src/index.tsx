import { render } from "@solidjs/web"
import { Router, Route } from "@solidjs/router"
import "./index.css"
import { Account } from "./pages/Account"
import { Notifications } from "./pages/Notifications"
import { DangerZone } from "./pages/DangerZone"

render(
  () => (
    <Router>
      <Route path="/" component={Account} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/danger-zone" component={DangerZone} />
    </Router>
  ),
  document.getElementById("app")!,
)
