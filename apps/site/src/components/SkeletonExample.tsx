import * as Skeleton from "@solidiom/skeleton"
import type { Locale } from "../lib/locale"

export interface SkeletonExampleProps {
  locale: Locale
}

/**
 * Canonical executable source for the Skeleton documentation example.
 * Demonstrates text, circular, and rectangular skeleton placeholders.
 */
export function SkeletonExample(props: SkeletonExampleProps) {
  return (
    <div
      ref={(element) => element.setAttribute("data-hydrated", "true")}
      class="skeleton-example"
      data-skeleton-example
    >
      <div class="skeleton-example__row">
        <Skeleton.Root variant="rectangular" width="200" height="1.5rem" />
      </div>
      <div class="skeleton-example__row">
        <Skeleton.Root variant="text" width="150" />
      </div>
      <div class="skeleton-example__row">
        <Skeleton.Root variant="circular" width="3rem" height="3rem" />
      </div>
    </div>
  )
}
