import { render } from "@solidjs/web"
import { Router, Route } from "@solidjs/router"
import "./index.css"
import { AppShell } from "./components/AppShell"
import { ResourceList } from "./pages/ResourceList"
import { ResourceDetail } from "./pages/ResourceDetail"
import { ResourceCreate } from "./pages/ResourceCreate"

render(
  () => (
    <Router root={AppShell}>
      <Route path="/" component={ResourceList} />
      <Route path="/resource/:id" component={ResourceDetail} />
      <Route path="/create" component={ResourceCreate} />
    </Router>
  ),
  document.getElementById("app")!,
)
