import { render } from "@solidjs/web"
import { Router, Route } from "@solidjs/router"
import "./index.css"
import { Frameworks } from "./pages/Frameworks"
import { Controls } from "./pages/Controls"
import { Evidence } from "./pages/Evidence"

render(
  () => (
    <Router>
      <Route path="/" component={Frameworks} />
      <Route path="/controls" component={Controls} />
      <Route path="/evidence" component={Evidence} />
    </Router>
  ),
  document.getElementById("app")!,
)
