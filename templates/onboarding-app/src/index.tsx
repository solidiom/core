import { render } from "@solidjs/web"
import { Router, Route } from "@solidjs/router"
import "./index.css"
import { Welcome } from "./pages/Welcome"
import { ProfileSetup } from "./pages/ProfileSetup"
import { ProjectStarter } from "./pages/ProjectStarter"

render(
  () => (
    <Router>
      <Route path="/" component={Welcome} />
      <Route path="/profile" component={ProfileSetup} />
      <Route path="/project" component={ProjectStarter} />
    </Router>
  ),
  document.getElementById("app")!,
)
