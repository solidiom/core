import type { JSX } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Card from "@solidiom/card"
import { CodeBlock } from "../components/CodeBlock"

const GUIDES = [
  {
    title: "Setting Up Your First Project",
    description: "Learn how to scaffold a new project, install dependencies, and run the development server.",
    difficulty: "Beginner",
    time: "10 min",
    steps: 5,
    code: `npx create-solidiom-app my-project
cd my-project
npm install
npm run dev`,
  },
  {
    title: "Building a Dashboard Layout",
    description: "Create a responsive dashboard with sidebar navigation, data tables, and real-time updates.",
    difficulty: "Intermediate",
    time: "25 min",
    steps: 8,
    code: `import { createSignal } from "solid-js";
import * as DataTable from "@solidiom/data-table";

export function Dashboard() {
  const [data, setData] = createSignal([]);
  // ...
}`,
  },
  {
    title: "Authentication and Authorization",
    description: "Implement user authentication with JWT tokens, role-based access control, and protected routes.",
    difficulty: "Advanced",
    time: "40 min",
    steps: 12,
    code: `import { createProtectedRoute } from "@solidiom/auth";

const ProtectedDashboard = createProtectedRoute(Dashboard, {
  requiredRole: "admin",
  redirectTo: "/login",
});`,
  },
  {
    title: "Deploying to Production",
    description: "Configure build optimization, environment variables, and deploy to your preferred hosting platform.",
    difficulty: "Intermediate",
    time: "20 min",
    steps: 6,
    code: `# Build for production
npm run build

# Preview the build
npm run preview

# Deploy (example with Vercel)
vercel deploy --prod`,
  },
]

const difficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Beginner": return "bg-green-100 text-green-700"
    case "Intermediate": return "bg-yellow-100 text-yellow-700"
    case "Advanced": return "bg-red-100 text-red-700"
    default: return "bg-gray-100 text-gray-700"
  }
}

export function Guides(): JSX.Element {
  return (
    <div>
      <Breadcrumb.Root>
        <Breadcrumb.List class="flex items-center gap-2">
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Docs</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#" current>Guides</Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <div class="mt-6">
        <h1 class="text-2xl font-bold text-gray-900">Guides</h1>
        <p class="mt-1 text-sm text-gray-500">Step-by-step tutorials and how-to guides with code samples.</p>
      </div>

      <div class="mt-8 grid gap-6 sm:grid-cols-2">
        {GUIDES.map((guide) => (
          <Card.Root>
            <Card.Header>
              <div class="mb-2 flex items-center gap-2">
                <span class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${difficultyColor(guide.difficulty)}`}>
                  {guide.difficulty}
                </span>
                <span class="text-xs text-gray-400">{guide.time}</span>
                <span class="text-xs text-gray-400">{guide.steps} steps</span>
              </div>
              <Card.Title>{guide.title}</Card.Title>
            </Card.Header>
            <Card.Content>
              <p class="mb-4 text-sm text-gray-500">{guide.description}</p>
              <CodeBlock code={guide.code} language="bash" />
            </Card.Content>
          </Card.Root>
        ))}
      </div>
    </div>
  )
}
