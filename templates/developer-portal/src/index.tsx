import { render } from "@solidjs/web"
import { Router, Route } from "@solidjs/router"
import "./index.css"
import { AppShell } from "./components/AppShell"
import { Documentation } from "./pages/Documentation"
import { Playground } from "./pages/Playground"
import { Applications } from "./pages/Applications"

render(
  () => (
    <Router root={AppShell}>
      <Route path="/" component={Documentation} />
      <Route path="/playground" component={Playground} />
      <Route path="/apps" component={Applications} />
    </Router>
  ),
  document.getElementById("app")!,
)
