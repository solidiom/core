import { render } from "@solidjs/web"
import { Router, Route } from "@solidjs/router"
import "./index.css"
import { AppShell } from "./components/AppShell"
import { DocsReader } from "./pages/DocsReader"
import { ApiReference } from "./pages/ApiReference"
import { Guides } from "./pages/Guides"

render(
  () => (
    <Router root={AppShell}>
      <Route path="/" component={DocsReader} />
      <Route path="/api" component={ApiReference} />
      <Route path="/guides" component={Guides} />
    </Router>
  ),
  document.getElementById("app")!,
)
