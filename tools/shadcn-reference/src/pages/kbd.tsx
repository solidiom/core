import { Kbd } from "@/components/ui/kbd"

export default function KbdPage() {
  return (
    <div className="flex items-center gap-2">
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
      <span className="text-sm text-muted-foreground">to open the palette</span>
    </div>
  )
}
