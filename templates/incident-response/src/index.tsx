import { render } from "@solidjs/web"
import { Router, Route } from "@solidjs/router"
import "./index.css"
import { ActiveIncidents } from "./pages/ActiveIncidents"
import { Runbooks } from "./pages/Runbooks"
import { Postmortems } from "./pages/Postmortems"

render(
  () => (
    <Router>
      <Route path="/" component={ActiveIncidents} />
      <Route path="/runbooks" component={Runbooks} />
      <Route path="/postmortems" component={Postmortems} />
    </Router>
  ),
  document.getElementById("app")!,
)
