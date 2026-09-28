import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function RadioGroupPage() {
  return (
    <RadioGroup defaultValue="apple" className="grid gap-3">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="apple" id="rg-apple" />
        <Label htmlFor="rg-apple">Apple</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="banana" id="rg-banana" />
        <Label htmlFor="rg-banana">Banana</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="cherry" id="rg-cherry" disabled />
        <Label htmlFor="rg-cherry">Cherry (disabled)</Label>
      </div>
    </RadioGroup>
  )
}
