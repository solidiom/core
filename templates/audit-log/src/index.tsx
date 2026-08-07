import { render } from "@solidjs/web"
import { Router, Route } from "@solidjs/router"
import "./index.css"
import { EventStream } from "./pages/EventStream"
import { Filters } from "./pages/Filters"
import { Export } from "./pages/Export"

render(
  () => (
    <Router>
      <Route path="/" component={EventStream} />
      <Route path="/filters" component={Filters} />
      <Route path="/export" component={Export} />
    </Router>
  ),
  document.getElementById("app")!,
)
