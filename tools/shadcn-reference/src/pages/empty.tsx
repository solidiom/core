import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Inbox } from "lucide-react"

export default function EmptyPage() {
  return (
    <div className="w-full max-w-md">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Inbox className="size-4" />
          </EmptyMedia>
          <EmptyTitle>No results</EmptyTitle>
          <EmptyDescription>
            Try adjusting your search or filter to find what you are looking for.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="sm">Reset filters</Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
