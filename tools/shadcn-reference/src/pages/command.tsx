import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export default function CommandPage() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && e.metaKey) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <div className="w-96">
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Recent">
            <CommandItem onSelect={() => setOpen(false)}>Save</CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>Undo</CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>Redo</CommandItem>
          </CommandGroup>
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => setOpen(false)}>Settings</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open command palette
      </Button>
    </div>
  )
}
