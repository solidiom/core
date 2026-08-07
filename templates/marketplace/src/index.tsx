import { render } from "@solidjs/web"
import { Router, Route } from "@solidjs/router"
import "./index.css"
import { Browse } from "./pages/Browse"
import { SellerDashboard } from "./pages/SellerDashboard"
import { ListingDetail } from "./pages/ListingDetail"

render(
  () => (
    <Router>
      <Route path="/" component={Browse} />
      <Route path="/seller" component={SellerDashboard} />
      <Route path="/listing/:id" component={ListingDetail} />
    </Router>
  ),
  document.getElementById("app")!,
)
