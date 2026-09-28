import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const fruits = ["Apple", "Banana", "Cherry", "Grape", "Mango"]

export default function SelectPage() {
  const [value, setValue] = React.useState("")
  return (
    <div className="flex w-64 flex-col gap-3">
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger id="sel-fruit">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          {fruits.map((f) => (
            <SelectItem key={f} value={f}>
              {f}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select defaultValue="fixed">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fixed">Fixed default</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
