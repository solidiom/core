import { render } from "@solidjs/web"
import { Router, Route } from "@solidjs/router"
import "./index.css"
import { AppShell } from "./components/AppShell"
import { ModelMonitoring } from "./pages/ModelMonitoring"
import { Deployments } from "./pages/Deployments"
import { CostTracking } from "./pages/CostTracking"

render(
  () => (
    <Router root={AppShell}>
      <Route path="/" component={ModelMonitoring} />
      <Route path="/deployments" component={Deployments} />
      <Route path="/costs" component={CostTracking} />
    </Router>
  ),
  document.getElementById("app")!,
)
