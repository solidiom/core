import { render } from "@solidjs/web"
import { Router, Route } from "@solidjs/router"
import "./index.css"
import { AppShell } from "./components/AppShell"
import { Frameworks } from "./pages/Frameworks"
import { Controls } from "./pages/Controls"
import { Evidence } from "./pages/Evidence"

render(
  () => (
    <Router root={AppShell}>
      <Route path="/" component={Frameworks} />
      <Route path="/controls" component={Controls} />
      <Route path="/evidence" component={Evidence} />
    </Router>
  ),
  document.getElementById("app")!,
)
