import { render } from "@solidjs/web"
import { Router, Route } from "@solidjs/router"
import "./index.css"
import { ProductListing } from "./pages/ProductListing"
import { Cart } from "./pages/Cart"
import { Checkout } from "./pages/Checkout"

render(
  () => (
    <Router>
      <Route path="/" component={ProductListing} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
    </Router>
  ),
  document.getElementById("app")!,
)
