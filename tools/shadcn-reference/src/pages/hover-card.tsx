import * as React from "react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

export default function HoverCardPage() {
  return (
    <div className="w-96">
      <HoverCard>
        <HoverCardTrigger className="underline cursor-pointer text-sm">@solidiom</HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="flex flex-col space-y-2">
            <h4 className="text-sm font-semibold">@solidiom</h4>
            <p className="text-sm text-muted-foreground">
              A modern UI component library built with SolidJS.
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}
