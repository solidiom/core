import { render } from "@solidjs/web"
import { Router, Route } from "@solidjs/router"
import "./index.css"
import { AppShell } from "./components/AppShell"
import { ActiveIncidents } from "./pages/ActiveIncidents"
import { Runbooks } from "./pages/Runbooks"
import { Postmortems } from "./pages/Postmortems"

render(
  () => (
    <Router root={AppShell}>
      <Route path="/" component={ActiveIncidents} />
      <Route path="/runbooks" component={Runbooks} />
      <Route path="/postmortems" component={Postmortems} />
    </Router>
  ),
  document.getElementById("app")!,
)
