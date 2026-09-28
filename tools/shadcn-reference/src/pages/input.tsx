import { Input } from "@/components/ui/input"

export default function InputPage() {
  return (
    <div className="flex max-w-md flex-col gap-3">
      <Input placeholder="Default" />
      <Input placeholder="Disabled" disabled />
      <Input type="email" placeholder="email" />
    </div>
  )
}
