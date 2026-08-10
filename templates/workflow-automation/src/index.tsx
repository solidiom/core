import { render } from "@solidjs/web"
import { Router, Route } from "@solidjs/router"
import "./index.css"
import { AppShell } from "./components/AppShell"
import { Designer } from "./pages/Designer"
import { Runs } from "./pages/Runs"
import { Integrations } from "./pages/Integrations"

render(
  () => (
    <Router root={AppShell}>
      <Route path="/" component={Designer} />
      <Route path="/runs" component={Runs} />
      <Route path="/integrations" component={Integrations} />
    </Router>
  ),
  document.getElementById("app")!,
)
