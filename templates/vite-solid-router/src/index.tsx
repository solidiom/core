/* @refresh reload */
import { render } from "@solidjs/web"
import { Router, Route } from "@solidjs/router"
import App from "./App"
import Home from "./pages/Home"
import About from "./pages/About"
import "./index.css"

const root = document.getElementById("app")

if (!root) {
  throw new Error("Root element #app not found — check index.html.")
}

render(
  () => (
    <Router root={App}>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
    </Router>
  ),
  root,
)
