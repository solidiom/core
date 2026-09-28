import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonPage() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="flex items-center gap-4">
        <Skeleton className="size-12 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    </div>
  )
}
