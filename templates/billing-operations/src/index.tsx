import { render } from "@solidjs/web"
import { Router, Route } from "@solidjs/router"
import "./index.css"
import { Invoices } from "./pages/Invoices"
import { Reconciliation } from "./pages/Reconciliation"
import { Reports } from "./pages/Reports"

render(
  () => (
    <Router>
      <Route path="/" component={Invoices} />
      <Route path="/reconciliation" component={Reconciliation} />
      <Route path="/reports" component={Reports} />
    </Router>
  ),
  document.getElementById("app")!,
)
