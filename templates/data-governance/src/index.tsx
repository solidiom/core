import { render } from "@solidjs/web"
import { Router, Route } from "@solidjs/router"
import "./index.css"
import { DataCatalog } from "./pages/DataCatalog"
import { Lineage } from "./pages/Lineage"
import { Classification } from "./pages/Classification"

render(
  () => (
    <Router>
      <Route path="/" component={DataCatalog} />
      <Route path="/lineage" component={Lineage} />
      <Route path="/classification" component={Classification} />
    </Router>
  ),
  document.getElementById("app")!,
)
