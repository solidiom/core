import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route, Link, useParams, Navigate } from "react-router-dom"
import "./index.css"
import Button from "./pages/button"
import Input from "./pages/input"
import Label from "./pages/label"
import Checkbox from "./pages/checkbox"
import RadioGroup from "./pages/radio-group"
import Switch from "./pages/switch"
import Slider from "./pages/slider"
import Select from "./pages/select"
import Textarea from "./pages/textarea"
import InputOtp from "./pages/input-otp"
import Field from "./pages/field"
import InputGroup from "./pages/input-group"
import Dialog from "./pages/dialog"
import AlertDialog from "./pages/alert-dialog"
import Sheet from "./pages/sheet"
import Drawer from "./pages/drawer"
import Popover from "./pages/popover"
import Tooltip from "./pages/tooltip"
import HoverCard from "./pages/hover-card"
import DropdownMenu from "./pages/dropdown-menu"
import ContextMenu from "./pages/context-menu"
import Menubar from "./pages/menubar"
import Tabs from "./pages/tabs"
import Accordion from "./pages/accordion"
import Collapsible from "./pages/collapsible"
import Breadcrumb from "./pages/breadcrumb"
import NavigationMenu from "./pages/navigation-menu"
import Pagination from "./pages/pagination"
import ResizablePanels from "./pages/resizable-panels"
import ScrollArea from "./pages/scroll-area"
import Avatar from "./pages/avatar"
import Badge from "./pages/badge"
import Kbd from "./pages/kbd"
import Sidebar from "./pages/sidebar"
import Table from "./pages/table"
import Calendar from "./pages/calendar"
import DatePicker from "./pages/date-picker"
import DataTable from "./pages/data-table"
import Carousel from "./pages/carousel"
import Progress from "./pages/progress"
import Skeleton from "./pages/skeleton"
import Spinner from "./pages/spinner"
import Toast from "./pages/toast"
import Empty from "./pages/empty"

const pages: Record<string, React.ComponentType> = {
  button: Button,
  input: Input,
  label: Label,
  checkbox: Checkbox,
  "radio-group": RadioGroup,
  switch: Switch,
  slider: Slider,
  select: Select,
  textarea: Textarea,
  "input-otp": InputOtp,
  field: Field,
  "input-group": InputGroup,
  dialog: Dialog,
  "alert-dialog": AlertDialog,
  sheet: Sheet,
  drawer: Drawer,
  popover: Popover,
  tooltip: Tooltip,
  "hover-card": HoverCard,
  "dropdown-menu": DropdownMenu,
  "context-menu": ContextMenu,
  menubar: Menubar,
  tabs: Tabs,
  accordion: Accordion,
  collapsible: Collapsible,
  breadcrumb: Breadcrumb,
  "navigation-menu": NavigationMenu,
  pagination: Pagination,
  "resizable-panels": ResizablePanels,
  "scroll-area": ScrollArea,
  avatar: Avatar,
  badge: Badge,
  kbd: Kbd,
  sidebar: Sidebar,
  table: Table,
  calendar: Calendar,
  "date-picker": DatePicker,
  "data-table": DataTable,
  carousel: Carousel,
  progress: Progress,
  skeleton: Skeleton,
  spinner: Spinner,
  toast: Toast,
  empty: Empty,
}

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
