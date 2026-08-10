import { render } from "@solidjs/web"
import { Router, Route } from "@solidjs/router"
import "./index.css"
import { AppShell } from "./components/AppShell"
import { ProductListing } from "./pages/ProductListing"
import { Cart } from "./pages/Cart"
import { Checkout } from "./pages/Checkout"

render(
  () => (
    <Router root={AppShell}>
      <Route path="/" component={ProductListing} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
    </Router>
  ),
  document.getElementById("app")!,
)
