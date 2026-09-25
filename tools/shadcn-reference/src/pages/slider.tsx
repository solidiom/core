import * as React from "react"
import { Slider } from "@/components/ui/slider"

export default function SliderPage() {
  const [value, setValue] = React.useState([50])
  return (
    <div className="flex w-80 flex-col gap-6">
      <Slider value={value} onValueChange={setValue} max={100} step={1} />
      <Slider value={[20, 60]} onValueChange={(v) => console.log(v)} max={100} />
      <Slider value={[50]} onValueChange={(v) => console.log(v)} disabled max={100} />
    </div>
  )
}
