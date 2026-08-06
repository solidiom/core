import { render } from "@solidjs/web"
import { Router, Route } from "@solidjs/router"
import "./index.css"
import { Teams } from "./pages/Teams"
import { Roles } from "./pages/Roles"
import { AuditLog } from "./pages/AuditLog"

render(
  () => (
    <Router>
      <Route path="/" component={Teams} />
      <Route path="/roles" component={Roles} />
      <Route path="/audit" component={AuditLog} />
    </Router>
  ),
  document.getElementById("app")!,
)
