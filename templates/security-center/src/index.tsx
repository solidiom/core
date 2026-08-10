import { render } from "@solidjs/web"
import { Router, Route } from "@solidjs/router"
import "./index.css"
import { AppShell } from "./components/AppShell"
import { ThreatDashboard } from "./pages/ThreatDashboard"
import { Vulnerabilities } from "./pages/Vulnerabilities"
import { Policies } from "./pages/Policies"

render(
  () => (
    <Router root={AppShell}>
      <Route path="/" component={ThreatDashboard} />
      <Route path="/vulnerabilities" component={Vulnerabilities} />
      <Route path="/policies" component={Policies} />
    </Router>
  ),
  document.getElementById("app")!,
)
