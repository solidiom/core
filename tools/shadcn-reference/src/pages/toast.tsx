import { Button } from "@/components/ui/button"
import { ToastAction } from "@/components/ui/toast"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/hooks/use-toast"

export default function ToastPage() {
  return (
    <div className="space-y-4">
      <Toaster />
      <Button
        variant="outline"
        onClick={() => {
          toast({
            title: "Event scheduled",
            description: "Friday, February 10, 2023 at 5:57 PM",
            action: <ToastAction altText="Try again">Accept</ToastAction>,
          })
        }}
      >
        Show a toast
      </Button>
    </div>
  )
}
