import { render } from "@solidjs/web"
import { Router, Route } from "@solidjs/router"
import "./index.css"
import { SearchResults } from "./pages/SearchResults"
import { SavedSearches } from "./pages/SavedSearches"
import { SearchAnalytics } from "./pages/SearchAnalytics"

render(
  () => (
    <Router>
      <Route path="/" component={SearchResults} />
      <Route path="/saved" component={SavedSearches} />
      <Route path="/analytics" component={SearchAnalytics} />
    </Router>
  ),
  document.getElementById("app")!,
)
