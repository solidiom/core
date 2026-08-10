import { render } from "@solidjs/web"
import { Router, Route } from "@solidjs/router"
import "./index.css"
import { AppShell } from "./components/AppShell"
import { Dashboard } from "./pages/Dashboard"
import { Resources } from "./pages/Resources"

render(
  () => (
    <Router root={AppShell}>
      <Route path="/" component={Dashboard} />
      <Route path="/resources" component={Resources} />
    </Router>
  ),
  document.getElementById("app")!,
)
