import { render } from "@solidjs/web"
import { Router, Route } from "@solidjs/router"
import "./index.css"
import { TicketQueue } from "./pages/TicketQueue"
import { KnowledgeBase } from "./pages/KnowledgeBase"
import { Metrics } from "./pages/Metrics"

render(
  () => (
    <Router>
      <Route path="/" component={TicketQueue} />
      <Route path="/knowledge-base" component={KnowledgeBase} />
      <Route path="/metrics" component={Metrics} />
    </Router>
  ),
  document.getElementById("app")!,
)
