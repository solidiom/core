import * as React from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"

export default function CollapsiblePageView() {
  const [open, setOpen] = React.useState(false)
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full max-w-sm space-y-2">
      <div className="flex items-center justify-between space-x-4">
        <p className="text-sm font-medium">@peduarte&apos;s recent posts</p>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm">
            {open ? "Hide" : "Show"}
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        <p className="text-sm text-muted-foreground">Your recent posts are being reviewed.</p>
        <p className="text-sm text-muted-foreground">
          You will be notified once they are approved.
        </p>
      </CollapsibleContent>
    </Collapsible>
  )
}
