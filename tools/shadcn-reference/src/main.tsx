import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route, Link, useParams, Navigate } from "react-router-dom"
import "./index.css"
import Button from "./pages/button"

const pages: Record<string, React.ComponentType> = { button: Button }

function ComponentPage() {
  const { id } = useParams<{ id: string }>()
  const Page = pages[id ?? ""]
  if (!Page) return <p className="p-4 text-destructive">No reference page for “{id}”.</p>
  return (
    <div className="min-h-screen p-6">
      <div className="mb-4 flex items-center gap-3">
        <Link to="/" className="text-sm text-muted-foreground hover:underline">
          index
        </Link>
        <span className="text-sm font-mono">/{id}</span>
        <button
          className="ml-auto rounded-md border px-2 py-1 text-xs"
          onClick={() => document.documentElement.classList.toggle("dark")}
        >
          toggle dark
        </button>
      </div>
      <Page />
    </div>
  )
}

function Index() {
  return (
    <div className="min-h-screen p-6">
      <h1 className="mb-4 text-lg font-semibold">shadcn reference</h1>
      <ul className="grid grid-cols-4 gap-2 text-sm">
        {Object.keys(pages).map((id) => (
          <li key={id}>
            <Link to={`/${id}`} className="text-primary hover:underline">
              {id}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/:id" element={<ComponentPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
