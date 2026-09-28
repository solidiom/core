import { Textarea } from "@/components/ui/textarea"

export default function TextareaPage() {
  return (
    <div className="flex max-w-md flex-col gap-3">
      <Textarea placeholder="Default" />
      <Textarea placeholder="Disabled" disabled />
      <Textarea aria-invalid defaultValue="With default value" />
    </div>
  )
}
