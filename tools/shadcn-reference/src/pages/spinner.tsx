import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export default function SpinnerPage() {
  return (
    <div className="flex items-center gap-4">
      <Spinner />
      <Button disabled>
        <Spinner className="size-4" />
        Loading...
      </Button>
    </div>
  )
}
