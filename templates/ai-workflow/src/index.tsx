import { render } from "@solidjs/web"
import { Router, Route } from "@solidjs/router"
import "./index.css"
import { AppShell } from "./components/AppShell"
import { PipelineBuilder } from "./pages/PipelineBuilder"
import { ModelRegistry } from "./pages/ModelRegistry"
import { ExecutionLogs } from "./pages/ExecutionLogs"

render(
  () => (
    <Router root={AppShell}>
      <Route path="/" component={PipelineBuilder} />
      <Route path="/models" component={ModelRegistry} />
      <Route path="/executions" component={ExecutionLogs} />
    </Router>
  ),
  document.getElementById("app")!,
)
