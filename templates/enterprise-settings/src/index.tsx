import { render } from "@solidjs/web"
import { Router, Route } from "@solidjs/router"
import "./index.css"
import { Organization } from "./pages/Organization"
import { Security } from "./pages/Security"
import { Integrations } from "./pages/Integrations"

render(
  () => (
    <Router>
      <Route path="/" component={Organization} />
      <Route path="/security" component={Security} />
      <Route path="/integrations" component={Integrations} />
    </Router>
  ),
  document.getElementById("app")!,
)
