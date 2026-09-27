import * as React from "react"
import { Calendar } from "@/components/ui/calendar"

export default function CalendarPage() {
  const [date, setDate] = React.useState<Date>()
  return (
    <div className="flex justify-center">
      <Calendar mode="single" selected={date} onSelect={setDate} />
    </div>
  )
}
