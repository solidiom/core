/**
 * Probe primitive — validates that JSX packages build correctly
 * with vite-plugin-solid and can import from @solidiom/runtime.
 */
import type { Component } from "solid-js"

/**
 * A minimal probe component to validate the build pipeline.
 */
export const Probe: Component<{ label?: string }> = (props) => {
  return (
    <div data-scope="probe" data-part="root">
      {props.label ?? "probe"}
    </div>
  )
}
