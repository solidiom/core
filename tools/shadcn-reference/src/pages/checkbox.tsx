import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"

export default function CheckboxPage() {
  const [checked, setChecked] = React.useState<boolean>(true)
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox
          id="cb-default"
          checked={checked}
          onCheckedChange={(v) => setChecked(v === true)}
        />
        <label htmlFor="cb-default" className="text-sm">
          Default (checked)
        </label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-unchecked" />
        <label htmlFor="cb-unchecked" className="text-sm">
          Unchecked
        </label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-disabled" disabled />
        <label htmlFor="cb-disabled" className="text-sm">
          Disabled
        </label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="cb-disabled-checked" checked disabled />
        <label htmlFor="cb-disabled-checked" className="text-sm">
          Disabled checked
        </label>
      </div>
    </div>
  )
}
