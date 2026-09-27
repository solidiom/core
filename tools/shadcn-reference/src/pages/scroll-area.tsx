import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function ScrollAreaPage() {
  return (
    <ScrollArea className="h-72 w-full max-w-sm rounded-md border p-4">
      <div className="space-y-3">
        <p className="text-sm leading-6">
          Scrollbars — the little tools that make webpages more usable.
        </p>
        {Array.from({ length: 18 }, (_, i) => (
          <p key={i} className="text-sm leading-6">
            Line {i + 1} — this is some content to give the scroll area something to scroll through.
          </p>
        ))}
      </div>
    </ScrollArea>
  )
}
