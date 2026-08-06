import { render } from "@solidjs/web"
import { Router, Route } from "@solidjs/router"
import "./index.css"
import { Chat } from "./pages/Chat"
import { PromptStudio } from "./pages/PromptStudio"
import { Workflows } from "./pages/Workflows"

render(
  () => (
    <Router>
      <Route path="/" component={Chat} />
      <Route path="/prompts" component={PromptStudio} />
      <Route path="/workflows" component={Workflows} />
    </Router>
  ),
  document.getElementById("app")!,
)
