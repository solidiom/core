import * as Spinner from "@solidiom/spinner"

export function SpinnerDemo() {
  return <Spinner.Root label="Loading content" />
}

export const spinnerDemoCode = `import * as Spinner from "@solidiom/spinner"

function SpinnerExample() {
  return (
    <Spinner.Root label="Loading content" />
  )
}`
