import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

export default function LabelPage() {
  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="ref-name">Name</Label>
      <Input id="ref-name" placeholder="Default" />
      <div className="flex items-center gap-2">
        <Checkbox id="ref-agree" />
        <Label htmlFor="ref-agree">Agree</Label>
      </div>
    </div>
  )
}
