import { render } from "@solidjs/web"
import { Router, Route } from "@solidjs/router"
import "./index.css"
import { Dashboard } from "./pages/Dashboard"
import { Resources } from "./pages/Resources"

render(
  () => (
    <Router>
      <Route path="/" component={Dashboard} />
      <Route path="/resources" component={Resources} />
    </Router>
  ),
  document.getElementById("app")!,
)
