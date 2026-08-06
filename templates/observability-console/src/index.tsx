import { render } from "@solidjs/web"
import { Router, Route } from "@solidjs/router"
import "./index.css"
import { Overview } from "./pages/Overview"
import { Events } from "./pages/Events"
import { Alerts } from "./pages/Alerts"

render(
  () => (
    <Router>
      <Route path="/" component={Overview} />
      <Route path="/events" component={Events} />
      <Route path="/alerts" component={Alerts} />
    </Router>
  ),
  document.getElementById("app")!,
)
