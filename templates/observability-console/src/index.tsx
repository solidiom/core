import { render } from "@solidjs/web"
import { Router, Route } from "@solidjs/router"
import "./index.css"
import { AppShell } from "./components/AppShell"
import { Overview } from "./pages/Overview"
import { Events } from "./pages/Events"
import { Alerts } from "./pages/Alerts"

render(
  () => (
    <Router root={AppShell}>
      <Route path="/" component={Overview} />
      <Route path="/events" component={Events} />
      <Route path="/alerts" component={Alerts} />
    </Router>
  ),
  document.getElementById("app")!,
)
