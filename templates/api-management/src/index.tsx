import { render } from "@solidjs/web"
import { Router, Route } from "@solidjs/router"
import "./index.css"
import { EndpointCatalog } from "./pages/EndpointCatalog"
import { ApiKeys } from "./pages/ApiKeys"
import { UsageAnalytics } from "./pages/UsageAnalytics"

render(
  () => (
    <Router>
      <Route path="/" component={EndpointCatalog} />
      <Route path="/keys" component={ApiKeys} />
      <Route path="/usage" component={UsageAnalytics} />
    </Router>
  ),
  document.getElementById("app")!,
)
