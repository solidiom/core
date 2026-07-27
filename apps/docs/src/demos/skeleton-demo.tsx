import * as Skeleton from "@solidiom/skeleton"

export function SkeletonDemo() {
  return (
    <div>
      <Skeleton.Root width="200px" height="20px" />
      <Skeleton.Root variant="circular" width={40} height={40} />
    </div>
  )
}

export const skeletonDemoCode = `import * as Skeleton from "@solidiom/skeleton"

function SkeletonExample() {
  return (
    <div>
      <Skeleton.Root width="200px" height="20px" />
      <Skeleton.Root variant="circular" width={40} height={40} />
    </div>
  )
}`
