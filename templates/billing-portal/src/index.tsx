import { render } from "@solidjs/web"
import { Router, Route } from "@solidjs/router"
import "./index.css"
import { Plans } from "./pages/Plans"
import { Payment } from "./pages/Payment"
import { Invoices } from "./pages/Invoices"

render(
  () => (
    <Router>
      <Route path="/" component={Plans} />
      <Route path="/payment" component={Payment} />
      <Route path="/invoices" component={Invoices} />
    </Router>
  ),
  document.getElementById("app")!,
)
