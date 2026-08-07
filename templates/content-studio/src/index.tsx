import { render } from "@solidjs/web"
import { Router, Route } from "@solidjs/router"
import "./index.css"
import { Editor } from "./pages/Editor"
import { Library } from "./pages/Library"
import { Workflow } from "./pages/Workflow"

render(
  () => (
    <Router>
      <Route path="/" component={Editor} />
      <Route path="/library" component={Library} />
      <Route path="/workflow" component={Workflow} />
    </Router>
  ),
  document.getElementById("app")!,
)
