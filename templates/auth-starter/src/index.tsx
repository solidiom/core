import { render } from "@solidjs/web"
import { Router, Route } from "@solidjs/router"
import "./index.css"
import { SignIn } from "./pages/SignIn"
import { SignUp } from "./pages/SignUp"
import { ResetPassword } from "./pages/ResetPassword"

render(
  () => (
    <Router>
      <Route path="/" component={SignIn} />
      <Route path="/sign-up" component={SignUp} />
      <Route path="/reset-password" component={ResetPassword} />
    </Router>
  ),
  document.getElementById("app")!,
)
