import * as React from "react"
import { Switch } from "@/components/ui/switch"

export default function SwitchPage() {
  const [checked, setChecked] = React.useState(true)
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch id="sw-default" checked={checked} onCheckedChange={setChecked} />
        <label htmlFor="sw-default" className="text-sm">
          Default (on)
        </label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="sw-off" />
        <label htmlFor="sw-off" className="text-sm">
          Off
        </label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="sw-disabled" disabled />
        <label htmlFor="sw-disabled" className="text-sm">
          Disabled
        </label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="sw-disabled-on" checked disabled />
        <label htmlFor="sw-disabled-on" className="text-sm">
          Disabled on
        </label>
      </div>
    </div>
  )
}
