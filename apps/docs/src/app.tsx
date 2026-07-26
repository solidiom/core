import { Router, Route } from "@solidjs/router"
import { Loading } from "solid-js"
import { Layout } from "./components/layout"
import { Home, PrimitivePage, PerformancePage, RecipesPage, AccessibilityPage } from "./routes"

export default function App() {
  return (
    <Router
      root={(props) => (
        <Loading
          fallback={<p class="p-8 text-sm text-[hsl(var(--muted-foreground))]">Loading...</p>}
        >
          <Layout>{props.children}</Layout>
        </Loading>
      )}
    >
      <Route path="/" component={Home} />
      <Route path="/primitives/:name" component={PrimitivePage} />
      <Route path="/recipes" component={RecipesPage} />
      <Route path="/performance" component={PerformancePage} />
      <Route path="/accessibility" component={AccessibilityPage} />
    </Router>
  )
}
