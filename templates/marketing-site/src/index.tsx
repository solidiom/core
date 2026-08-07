import { render } from "@solidjs/web"
import { Router, Route } from "@solidjs/router"
import "./index.css"
import { Landing } from "./pages/Landing"
import { Features } from "./pages/Features"
import { Pricing } from "./pages/Pricing"

render(
  () => (
    <Router>
      <Route path="/" component={Landing} />
      <Route path="/features" component={Features} />
      <Route path="/pricing" component={Pricing} />
    </Router>
  ),
  document.getElementById("app")!,
)
