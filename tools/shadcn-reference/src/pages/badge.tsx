import { Badge } from "@/components/ui/badge"

export default function BadgePage() {
  return (
    <div className="flex items-center gap-2">
      <Badge>Badge</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  )
}
