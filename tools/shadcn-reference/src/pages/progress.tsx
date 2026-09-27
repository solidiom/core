import { Progress } from "@/components/ui/progress"

export default function ProgressPage() {
  return (
    <div className="w-full max-w-md space-y-6">
      <Progress value={65} aria-label="progress" />
      <Progress value={0} aria-label="progress empty" />
    </div>
  )
}
